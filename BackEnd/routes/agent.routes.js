import express from "express";
import {
  applyAgent,
  getAgentProfile,
} from "../controllers/agent.controller.js";
import { upload } from "../middleware/upload.js";
import { setPassword } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.js";
import { isAgent } from "../middleware/role.js";

const router = express.Router();

router.post(
  "/apply",
  (req, res, next) => {
    upload.fields([
      { name: "aadhaar", maxCount: 1 },
      { name: "pan", maxCount: 1 },
      { name: "photo", maxCount: 1 },
    ])(req, res, function (err) {
      if (err) {
        // 🔥 THIS IS THE KEY FIX
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }
      next();
    });
  },
  applyAgent,
);

router.post("/auth/agent-set-password", setPassword);

// 🔒 AGENT ONLY ROUTE
router.get(
  "/profile",
  protect, // 1️⃣ Check login
  isAgent, // 2️⃣ Check role = AGENT
  getAgentProfile, // 3️⃣ Controller
);

export default router;
