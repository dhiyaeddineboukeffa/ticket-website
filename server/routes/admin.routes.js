import express from "express";
import {
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
  getClientCredits,
  adjustClientCredit,
  getAdminTransactions,
  seedSampleData,
} from "../controllers/admin.js";

const router = express.Router();

// User management
router.get("/users", getAdminUsers);
router.post("/users", createAdminUser);
router.put("/users/:_id", updateAdminUser);
router.delete("/users/:_id", deleteAdminUser);

// Client credits
router.get("/credits", getClientCredits);
router.post("/credits/adjust", adjustClientCredit);

// Transactions
router.get("/transactions", getAdminTransactions);

// Seeding
router.post("/seed", seedSampleData);

export default router;
