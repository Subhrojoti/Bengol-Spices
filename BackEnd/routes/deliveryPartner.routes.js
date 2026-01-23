import express from "express";
import {
  registerDeliveryPartner,
  loginDeliveryPartner,
  logoutDeliveryPartner,
} from "../controllers/deliveryPartner.controller.js";
import { upload } from "../middleware/upload.js";
import { protect } from "../middleware/auth.js";
import { isDeliveryPartner } from "../middleware/role.js";

const router = express.Router();

router.post("/register", upload.single("document"), registerDeliveryPartner);
router.post("/login", loginDeliveryPartner);
router.post("/logout", protect, isDeliveryPartner, logoutDeliveryPartner);

export default router;
