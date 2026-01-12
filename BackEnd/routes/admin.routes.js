import express from "express";
import { approveAgent } from "../controllers/admin.controller.js";
import { protect } from "../middleware/auth.js";
import { isAdmin } from "../middleware/role.js";

const router = express.Router();

// 🔒 ADMIN ONLY ROUTE
router.post(
  "/agents/:agentId/approve",
  protect, // 1️⃣ Check login (JWT)
  isAdmin, // 2️⃣ Check role = ADMIN
  approveAgent // 3️⃣ Run controller
);
router.post("/agents/:agentId/approve", approveAgent);

export default router;
