import express from "express";
import { applyAgent } from "../controllers/agent.controller.js";
import { upload } from "../middleware/upload.js";
import { setPassword } from "../controllers/auth.controller.js";

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
  applyAgent
);

router.post("/auth/set-password", setPassword);
export default router;
