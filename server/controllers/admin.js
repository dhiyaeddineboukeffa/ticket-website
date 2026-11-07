import User from "../models/user.module.js";
import Transaction from "../models/transaction.module.js";
import Passengers from "../models/passengers.module.js";
import mongoose from "mongoose";

// GET ALL USERS
export const getAdminUsers = async (req, res) => {
  try {
    const { search, role } = req.query;
    let query = {};

    if (role && role !== "all") {
      if (role === "admin") {
        query.isAdmin = true;
      } else {
        query.role = role;
      }
    }

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phoneNumber: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(query)
      .select("-password -OTP -__v")
      .sort({ createdAt: -1 });

    const totalUsers = await User.countDocuments();
    const clientCount = await User.countDocuments({ role: { $in: ["normal", "client"] }, isAdmin: false });
    const workerCount = await User.countDocuments({ role: "worker" });
    const adminCount = await User.countDocuments({ isAdmin: true });

    res.status(200).json({
      users,
      stats: {
        totalUsers,
        clientCount,
        workerCount,
        adminCount,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CREATE A NEW USER
export const createAdminUser = async (req, res) => {
  try {
    const { fullName, email, password, phoneNumber, role, balance, isAdmin } = req.body;

    if (!email || !fullName || !password) {
      return res.status(400).json({ error: "FullName, Email, and Password are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "A user with this email already exists" });
    }

    const userRole = role || (isAdmin ? "admin" : "normal");
    const userIsAdmin = Boolean(isAdmin || role === "admin");

    const newUser = await User.create({
      fullName,
      email,
      password,
      phoneNumber: phoneNumber || "",
      role: userRole,
      isAdmin: userIsAdmin,
      isVerified: true,
      balance: Number(balance) || 0,
    });

    const { password: _, ...userDoc } = newUser._doc;
    res.status(201).json(userDoc);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE USER (ROLE, BALANCE, DETAILS)
export const updateAdminUser = async (req, res) => {
  try {
    const { _id } = req.params;
    const { fullName, email, phoneNumber, role, isAdmin, balance } = req.body;

    const updateFields = {};
    if (fullName !== undefined) updateFields.fullName = fullName;
    if (email !== undefined) updateFields.email = email;
    if (phoneNumber !== undefined) updateFields.phoneNumber = phoneNumber;
    if (role !== undefined) {
      updateFields.role = role;
      if (role === "admin") updateFields.isAdmin = true;
    }
    if (isAdmin !== undefined) updateFields.isAdmin = Boolean(isAdmin);
    if (balance !== undefined) updateFields.balance = Number(balance);

    const updatedUser = await User.findByIdAndUpdate(_id, updateFields, {
      new: true,
    }).select("-password -OTP -__v");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE USER
export const deleteAdminUser = async (req, res) => {
  try {
    const { _id } = req.params;
    const deleted = await User.findByIdAndDelete(_id);
    if (!deleted) {
      return res.status(404).json({ error: "User not found" });
    }
    // Also cleanup transactions associated with this user
    await Transaction.deleteMany({ $or: [{ client: _id }, { worker: _id }] });
    res.status(200).json({ message: "User and related transactions deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET CLIENT CREDITS OVERVIEW
export const getClientCredits = async (req, res) => {
  try {
    const { search } = req.query;
    let query = { role: { $in: ["normal", "client"] } };

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phoneNumber: { $regex: search, $options: "i" } },
      ];
    }

    const clients = await User.find(query)
      .select("fullName email phoneNumber balance role createdAt")
      .sort({ balance: -1 });

    const totalBalanceAgg = await User.aggregate([
      { $match: { role: { $in: ["normal", "client"] } } },
      { $group: { _id: null, total: { $sum: "$balance" }, avg: { $avg: "$balance" }, count: { $sum: 1 } } },
    ]);

    const stats = totalBalanceAgg[0] || { total: 0, avg: 0, count: 0 };

    res.status(200).json({
      clients,
      stats: {
        totalBalance: stats.total,
        averageBalance: Math.round(stats.avg || 0),
        totalClients: stats.count,
        topClient: clients[0] || null,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ADJUST CLIENT CREDIT BALANCE
export const adjustClientCredit = async (req, res) => {
  try {
    const { clientId, amount, note, workerId } = req.body;
    const adjustAmount = Number(amount);

    if (!clientId || isNaN(adjustAmount) || adjustAmount === 0) {
      return res.status(400).json({ error: "Valid clientId and non-zero amount are required" });
    }

    const client = await User.findById(clientId);
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    if (adjustAmount < 0 && client.balance < Math.abs(adjustAmount)) {
      return res.status(400).json({ error: `Insufficient balance (${client.balance} DZD)` });
    }

    // Default worker to admin user or worker
    let effectiveWorkerId = workerId;
    if (!effectiveWorkerId) {
      const adminUser = await User.findOne({ isAdmin: true }) || await User.findOne();
      effectiveWorkerId = adminUser?._id;
    }

    // Update client balance
    const updatedClient = await User.findByIdAndUpdate(
      clientId,
      { $inc: { balance: adjustAmount } },
      { new: true }
    ).select("fullName email balance");

    // Record the transaction
    const transaction = await Transaction.create({
      balance: adjustAmount,
      client: clientId,
      worker: effectiveWorkerId,
    });

    res.status(201).json({
      client: updatedClient,
      transaction,
      message: `Successfully adjusted balance by ${adjustAmount > 0 ? "+" : ""}${adjustAmount} DZD`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL TRANSACTIONS WITH POPULATED USERS
export const getAdminTransactions = async (req, res) => {
  try {
    const { type, search, limit = 50 } = req.query;
    let query = {};

    if (type === "recharge") {
      query.balance = { $gt: 0 };
    } else if (type === "ride") {
      query.balance = { $lt: 0 };
    }

    const transactions = await Transaction.find(query)
      .populate("client", "fullName email phoneNumber")
      .populate("worker", "fullName email role")
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    let filtered = transactions;
    if (search) {
      const s = search.toLowerCase();
      filtered = transactions.filter((t) => {
        const cName = t.client?.fullName?.toLowerCase() || "";
        const cEmail = t.client?.email?.toLowerCase() || "";
        const wName = t.worker?.fullName?.toLowerCase() || "";
        return cName.includes(s) || cEmail.includes(s) || wName.includes(s);
      });
    }

    // Compute stats
    const allTx = await Transaction.find({});
    let totalAdded = 0;
    let totalSpent = 0;
    allTx.forEach((tx) => {
      if (tx.balance > 0) totalAdded += tx.balance;
      else totalSpent += Math.abs(tx.balance);
    });

    res.status(200).json({
      transactions: filtered,
      stats: {
        totalTransactions: allTx.length,
        totalCreditAdded: totalAdded,
        totalTicketSpent: totalSpent,
        netFlow: totalAdded - totalSpent,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// SEED SAMPLE DATA
export const seedSampleData = async (req, res) => {
  try {
    const sampleUsers = [
      {
        fullName: "Amine Benali",
        email: "amine.benali@gmail.com",
        password: "password123",
        phoneNumber: "0550123456",
        role: "admin",
        isAdmin: true,
        isVerified: true,
        balance: 1500,
      },
      {
        fullName: "Karim Station Agent",
        email: "karim.worker@tramcredit.dz",
        password: "password123",
        phoneNumber: "0661234567",
        role: "worker",
        isAdmin: false,
        isVerified: true,
        balance: 500,
      },
      {
        fullName: "Yasmine Controller",
        email: "yasmine.controle@tramcredit.dz",
        password: "password123",
        phoneNumber: "0770987654",
        role: "worker",
        isAdmin: false,
        isVerified: true,
        balance: 200,
      },
      {
        fullName: "Sara Mansouri",
        email: "sara.mansouri@yahoo.com",
        password: "password123",
        phoneNumber: "0540112233",
        role: "normal",
        isAdmin: false,
        isVerified: true,
        balance: 850,
      },
      {
        fullName: "Mohamed Belkacem",
        email: "m.belkacem@hotmail.com",
        password: "password123",
        phoneNumber: "0670334455",
        role: "normal",
        isAdmin: false,
        isVerified: true,
        balance: 1200,
      },
      {
        fullName: "Fatima Zohra Khelifi",
        email: "fz.khelifi@gmail.com",
        password: "password123",
        phoneNumber: "0555778899",
        role: "normal",
        isAdmin: false,
        isVerified: true,
        balance: 400,
      },
      {
        fullName: "Walid Cherif",
        email: "walid.cherif@gmail.com",
        password: "password123",
        phoneNumber: "0668990011",
        role: "normal",
        isAdmin: false,
        isVerified: true,
        balance: 150,
      },
      {
        fullName: "Ines Boutaleb",
        email: "ines.boutaleb@outlook.com",
        password: "password123",
        phoneNumber: "0790223344",
        role: "normal",
        isAdmin: false,
        isVerified: true,
        balance: 2100,
      },
    ];

    const createdUsers = [];
    for (const u of sampleUsers) {
      let user = await User.findOne({ email: u.email });
      if (!user) {
        user = await User.create(u);
      }
      createdUsers.push(user);
    }

    const worker = createdUsers.find((u) => u.role === "worker") || createdUsers[0];
    const clients = createdUsers.filter((u) => u.role === "normal");

    // Generate realistic transactions if none exist
    const txCount = await Transaction.countDocuments();
    let seededTxCount = 0;
    if (txCount < 5) {
      const sampleAmounts = [500, -50, 1000, -50, -50, 200, -50, 1500, -50, 300, -50];
      const now = Date.now();

      for (let i = 0; i < sampleAmounts.length; i++) {
        const client = clients[i % clients.length];
        const amt = sampleAmounts[i];
        const createdAt = new Date(now - (i * 3600000 * 4)); // spaced out every 4 hours

        await Transaction.create({
          balance: amt,
          client: client._id,
          worker: worker._id,
          createdAt,
        });
        seededTxCount++;
      }
    }

    res.status(200).json({
      message: "Sample data seeded successfully!",
      usersCount: createdUsers.length,
      transactionsSeeded: seededTxCount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ADMIN SYSTEM OVERVIEW (100% REAL DATABASE METRICS)
export const getAdminOverview = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const clientCount = await User.countDocuments({
      role: { $in: ["normal", "client"] },
      isAdmin: false,
    });
    const workerCount = await User.countDocuments({ role: "worker" });
    const adminCount = await User.countDocuments({ isAdmin: true });

    const totalTransactions = await Transaction.countDocuments();
    const totalPassengerRecords = await Passengers.countDocuments();

    // Aggregations for total credit added and ticket spent
    const creditAgg = await Transaction.aggregate([
      { $match: { balance: { $gt: 0 } } },
      { $group: { _id: null, total: { $sum: "$balance" } } },
    ]);
    const totalCreditAdded = creditAgg[0]?.total || 0;

    const spentAgg = await Transaction.aggregate([
      { $match: { balance: { $lt: 0 } } },
      { $group: { _id: null, total: { $sum: { $abs: "$balance" } } } },
    ]);
    const totalTicketSpent = spentAgg[0]?.total || 0;

    const walletAgg = await User.aggregate([
      { $group: { _id: null, total: { $sum: "$balance" } } },
    ]);
    const totalWalletBalance = walletAgg[0]?.total || 0;

    // Real ping to MongoDB Atlas
    let latencyMs = 0;
    try {
      const t0 = Date.now();
      await mongoose.connection.db.admin().ping();
      latencyMs = Date.now() - t0;
    } catch {
      latencyMs = -1;
    }

    res.status(200).json({
      users: {
        total: totalUsers,
        clients: clientCount,
        workers: workerCount,
        admins: adminCount,
      },
      transactions: {
        total: totalTransactions,
        creditAdded: totalCreditAdded,
        ticketSpent: totalTicketSpent,
        netRevenue: totalCreditAdded - totalTicketSpent,
      },
      wallets: {
        totalBalance: totalWalletBalance,
      },
      passengers: {
        totalRecords: totalPassengerRecords,
      },
      database: {
        status: mongoose.connection.readyState === 1 ? "Online" : "Connecting",
        cluster: "MongoDB Atlas",
        name: mongoose.connection.name || "BABI",
        latencyMs: latencyMs >= 0 ? latencyMs : 0,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
