import express from "express";
import {
  initiateStoreRegistration,
  verifyStoreOtp,
  getMyStores,
} from "../controllers/store.controller.js";
import { protect } from "../middleware/auth.js";
import { isAgent } from "../middleware/role.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// STEP 1 — initiate (send OTP)
router.post(
  "/register/initiate",
  protect,
  isAgent,
  upload.single("image"),
  initiateStoreRegistration,
);

// STEP 2 — verify OTP
router.post("/register/verify-otp", protect, isAgent, verifyStoreOtp);

// GET MY STORES
router.get("/my-stores", protect, isAgent, getMyStores);

export default router;
