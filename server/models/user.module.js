import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    password: { type: String, minlength: 6, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    isVerified: { type: Boolean, required: true, default: false },
    email: { type: String, required: true, unique: true },
    fullName: { type: String, required: true, minlength: 3 },
    phoneNumber: { type: String },
    OTP: {
      type: String,
      default: String(Math.floor(100000 + Math.random() * 900000)),
    },
    role: { type: String, default: "normal" },
    balance: { type: Number, required: true, default: 0, min: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
