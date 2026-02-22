import express from "express";
import { createStore, getMyStores } from "../controllers/store.controller.js";
import { protect } from "../middleware/auth.js";
import { isAgent } from "../middleware/role.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// 🔥 DIRECT STORE CREATION (NO OTP)
router.post("/register", protect, isAgent, upload.single("image"), createStore);

// GET MY STORES
router.get("/my-stores", protect, isAgent, getMyStores);

export default router;
