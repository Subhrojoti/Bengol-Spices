import express from "express";
import {
  registerDeliveryPartner,
  loginDeliveryPartner,
  logoutDeliveryPartner,
  getAllDeliveryPartners,
  getMyAssignedOrders,
  getDeliveryPartnerDashboard,
} from "../controllers/deliveryPartner.controller.js";
import { upload } from "../middleware/upload.js";
import { protect } from "../middleware/auth.js";
import { isAdminOrEmployee, isDeliveryPartner } from "../middleware/role.js";

const router = express.Router();

router.post("/register", upload.single("document"), registerDeliveryPartner);
router.post("/login", loginDeliveryPartner);
router.post("/logout", protect, isDeliveryPartner, logoutDeliveryPartner);
router.get("/all", protect, isAdminOrEmployee, getAllDeliveryPartners);
router.get("/orders", protect, isDeliveryPartner, getMyAssignedOrders);
router.get(
  "/dashboard",
  protect,
  isDeliveryPartner,
  getDeliveryPartnerDashboard,
);
export default router;
