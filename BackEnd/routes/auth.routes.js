import express from "express";
import {
  agentLogin,
  logout,
  changePassword,
} from "../controllers/auth.controller.js";
import { adminLogin } from "../controllers/admin.auth.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/agent/login", agentLogin);
router.post("/admin/login", adminLogin);

// 🔒 LOGOUT (LOGIN REQUIRED)
router.post("/logout", protect, logout);

// 🔒 CHANGE PASSWORD (AGENT)
router.post("/change-password", protect, changePassword);

export default router;
