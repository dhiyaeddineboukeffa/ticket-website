import express from "express";

import { adminAuth, userAuth, workerAuth } from "../utils/userAuth.js";
import {
  getProfile,
  login,
  logout,
  Signup,
  updateProfile,
  userProfile,
} from "../controllers/user.js";

const router = express.Router();

router.post("/signup", Signup).post("/", login);

router
  .get("/logout", userAuth, logout)
  .get("/myProfile", userAuth, userProfile)
  .put("/myProfile", userAuth, updateProfile)
  .get("/getProfile/:_id", userAuth, workerAuth, getProfile);

export default router;
