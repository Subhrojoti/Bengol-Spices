import express from "express";
const router = express.Router();

import {
  getMyNotifications,
  markAsRead,
  sendCustomNotification,
} from "../controllers/notification.controller.js";

import { protect } from "../middleware/auth.js";

router.get("/", protect, getMyNotifications);
router.patch("/:id/read", protect, markAsRead);
router.post("/send", protect, sendCustomNotification);

export default router;
