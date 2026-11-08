import Transaction from "../models/transaction.module.js";
import User from "../models/user.module.js";
import Passenger from "../models/passengers.module.js";
//////!  CREATE TRAN  !//////

export const createTransaction = async (req, res) => {
  try {
    const { client, balance } = req.body;

    const oldUser = await User.findById(client);
    if (balance < 0 && Math.abs(balance) > oldUser.balance)
      return res.status(402).json("You Don't Have Enough Balance");

    const transaction = await Transaction.create({
      client,
      balance,
      worker: req.user._id,
    });

    const user = await User.findByIdAndUpdate(
      client,
      {
        $inc: { balance },
      },
      { new: true }
    ).select("balance email fullName");

    res.status(202).json({ transaction, user });
  } catch (error) {
    res.status(401).json(error);
  }
};

// export const redeemTransaction = async({params},res) => {
//   try {
//     const
//   } catch (error) {
//     res.status(401).json(error)
//   }
// }

//////!  GET TRAN  !//////

export const getTransaction = async (req, res) => {
  try {
    if (!req.params._id) return res.status(404).json("Pease Provide An Id");
    const transaction = await Transaction.findById(req.params._id).populate([
      { path: "client", select: "email fullName phoneNumber " },
      { path: "worker", select: "email fullName phoneNumber " },
    ]);
    res.status(201).json(transaction);
  } catch (error) {
    res.status(404).json(error);
  }
};

//////!  GET MY  !//////

export const getMyTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      client: req.user._id,
    })
      .populate([
        { path: "client", select: "email fullName phoneNumber " },
        { path: "worker", select: "email fullName phoneNumber " },
      ])
      .select("-__v")
      .sort({ createdAt: -1 });

    res.status(201).json(transactions);
  } catch (error) {
    res.status(401).json(error);
  }
};

// WORKER

//////!  GET USER TRANSACTIONS  !//////

export const getUserTransactions = async (req, res) => {
  try {
    const { client } = req.params;
    const transactions = await Transaction.find({ client })
      .select("-__v")
      .sort({ createdAt: -1 });

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json(error);
  }
};

// ADMIN

export const getAllTransactions = async ({ query }, res) => {
  try {
    const transactions = await Transaction.find()
      .limit(query?.limit || 10)
      .skip((query?.page - 1) * query?.limit);

    res.status(201).json(transactions);
  } catch (error) {
    res.status(401).json(error);
  }
};

// Passenger

export const createManyPassenger = async ({ body }, res) => {
  try {
    const items = Array.isArray(body) ? body : (body ? [body] : []);
    if (!items || !items.length)
      return res.status(400).json("Please Enter An Array of Passenger Records");

    const isValid = items.every((obj) =>
      ["createdAt", "in", "out", "inFrame"].every((key) =>
        Object.prototype.hasOwnProperty.call(obj, key)
      )
    );
    if (!isValid)
      return res.status(400).json("Please Enter Valid Data: each record must include createdAt, in, out, inFrame");

    const passenger = await Passenger.insertMany(items);
    res.status(201).json(passenger);
  } catch (error) {
    res.status(500).json({ error: error.message || error });
  }
};

export const getAllPassengers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const passengers = await Passenger.find().sort({ createdAt: -1 }).limit(limit);
    res.status(200).json(passengers);
  } catch (error) {
    res.status(500).json({ error: error.message || error });
  }
};

export const getPassengerStats = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 30;
    const latest = await Passenger.findOne().sort({ createdAt: -1 });
    const recent = await Passenger.find().sort({ createdAt: -1 }).limit(limit);
    const totalRecords = await Passenger.countDocuments();

    const maxInDoc = await Passenger.findOne().sort({ in: -1 }).select("in");
    const maxOutDoc = await Passenger.findOne().sort({ out: -1 }).select("out");

    res.status(200).json({
      latest: latest || { in: 0, out: 0, inFrame: 0, createdAt: new Date() },
      recent: recent || [],
      totalRecords,
      totalIn: maxInDoc ? maxInDoc.in : (latest ? latest.in : 0),
      totalOut: maxOutDoc ? maxOutDoc.out : (latest ? latest.out : 0),
      currentInFrame: latest ? latest.inFrame : 0,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || error });
  }
};
