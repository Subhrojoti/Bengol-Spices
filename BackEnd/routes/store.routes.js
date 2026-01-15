import express from "express";
import { registerStore } from "../controllers/store.controller.js";
import { protect } from "../middleware/auth.js";
import { isAgent } from "../middleware/role.js";

const router = express.Router();

// 🔒 REGISTER STORE (AGENT ONLY)
router.post("/register", protect, isAgent, registerStore);

export default router;
