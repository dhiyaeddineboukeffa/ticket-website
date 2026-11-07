//////!   SIGNUP   !//////

import User from "../models/user.module.js";
import { setCookie } from "../utils/generateToken.js";

export const Signup = async (req, res) => {
  try {
    const { fullName, password, confirmPassword, email, phoneNumber } =
      req.body;
    if (password != confirmPassword)
      return res.status(400).json({ error: "Passwords Don't Match" });

    const user = await User.findOne({ email });
    if (user) return res.status(402).json({ error: "Email Already Exist" });

    const newUser = await User.create({
      email,
      fullName,
      phoneNumber,
      password,
    });

    const { password: sss, __v, ...user1 } = newUser._doc;

    if (user1) {
      setCookie(user1._id, res);
      return res.status(201).json(user1);
    }
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

//////!   LOGIN   !//////

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("email");
    if (!user) return res.status(403).json({ error: "Email Not Found" });
    const account = await User.findOne({ email, password }).select(
      "-password -__v"
    );
    if (!account) return res.status(402).json({ error: "Wrong Password" });
    setCookie(account._id, res);
    res.json(account);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//////!   LOGOUT   !//////

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "");
    res.json("Logge Out Successfuly");
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

//////!  PROFILE  !//////

export const userProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "-__v -password -OTP -isVerified"
    );
    return res.json(user);
  } catch (error) {
    return res.status(401).json({ error });
  }
};

//////!  Update PROFILE   !//////

export const updateProfile = async (req, res) => {
  try {
    if (req.body.email) {
      const emailExist = await User.findOne({ email: req.body.email });
      if (emailExist)
        return res.status(402).json({ error: "Email Already Exist" });
    }

    let args = {};
    Object.keys(req.body).map((key, i) =>
      addKeyIfTruthy(args, key, Object.values(req.body)[i])
    );

    console.log({ args, ...req.body });

    const user = await User.findByIdAndUpdate(req.user._id, args, {
      new: true,
    }).select("-password -OTP -__v");

    res.status(202).json(user);
  } catch (error) {
    return res.status(401).json({ error });
  }
};

function addKeyIfTruthy(obj, key, value) {
  if (value) {
    obj[key] = value;
  }
}

//////!  UPDATE USER BALANCE   !//////

export const updateBalance = async (req, res) => {
  try {
  } catch (error) {
    res.status(401).json(error);
  }
};

export const getProfile = async (req, res) => {
  try {
    const { _id } = req.params;
    const user = await User.findById(_id).select("-password -OTP -__v ");
    res.status(201).json(user);
  } catch (error) {
    res.status(401).json(error);
  }
};
