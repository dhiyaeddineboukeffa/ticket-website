import express from "express";

import { adminAuth, userAuth, workerAuth } from "../utils/userAuth.js";
import {
  createManyPassenger,
  createTransaction,
  getAllPassengers,
  getAllTransactions,
  getMyTransactions,
  getPassengerStats,
  getTransaction,
  getUserTransactions,
} from "../controllers/transaction.js";

const router = express.Router();

router
  .post("/create", userAuth, workerAuth, createTransaction)
  .get("/getMy", userAuth, getMyTransactions)
  .get("/get/:_id", userAuth, getTransaction)
  .get("/pay/:client", userAuth, workerAuth, getUserTransactions)
  .get("/all", userAuth, adminAuth, getAllTransactions)
  .post("/Passenger", createManyPassenger)
  .get("/Passenger", getAllPassengers)
  .get("/Passenger/stats", getPassengerStats);

export default router;
