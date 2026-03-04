import express from "express";
import {
  placeOrder,
  getMyOrders,
  getAllOrders,
  // createShipment,
  getOrdersByStoreConsumerId,
  confirmOrder,
  assignDeliveryPartner,
  updateDeliveryStatus,
  generateDeliveryOtp,
  verifyDeliveryOtp,
  completePayment,
  cancelOrder,
} from "../controllers/order.controller.js";
import { protect } from "../middleware/auth.js";
import {
  isAdminOrEmployee,
  isAgent,
  isDeliveryPartner,
} from "../middleware/role.js";
import { checkPermission } from "../middleware/permission.js";

const router = express.Router();

// PLACE ORDER (AGENT)
router.post("/", protect, isAgent, placeOrder);
// STORE-WISE ORDERS
router.get("/store/:consumerId", protect, getOrdersByStoreConsumerId);
// GET MY ORDERS
router.get("/my-orders", protect, isAgent, getMyOrders);
// ADMIN / EMPLOYEE
router.get("/all", protect, checkPermission("canGetAllOrders"), getAllOrders);
//Confirm Order (Admin / Employee)
router.put(
  "/confirm",
  protect,
  checkPermission("canConfirmOrders"),
  confirmOrder,
);
router.put("/:orderId/cancel", protect, isAdminOrEmployee, cancelOrder);
//Assign Delivery Partner (Admin / Employee)
router.put(
  "/:orderId/assign",
  protect,
  checkPermission("canAssignDelivery"),
  assignDeliveryPartner,
);
//Deliver Status Update (Delivery Partner)
router.put(
  "/:orderId/delivery-status",
  protect,
  isDeliveryPartner,
  updateDeliveryStatus,
);
//Generate OTP for Delivery Partner
router.put(
  "/:orderId/generate-otp",
  protect,
  isDeliveryPartner,
  generateDeliveryOtp,
);
//Verify OTP for Delivery Partner
router.put(
  "/:orderId/verify-otp",
  protect,
  isDeliveryPartner,
  verifyDeliveryOtp,
);
//Complete Payment (Future code mode --- Razorpay / Stripe)
router.put(
  "/:orderId/complete-payment",
  protect,
  isAdminOrEmployee,
  completePayment,
);
// CREATE SHIPMENT (EMPLOYEE / ADMIN) [Future code mode --- ShipRocket]
// router.post(
//   "/:orderId/create-shipment",
//   protect,
//   isAdminOrEmployee,
//   createShipment,
// );

export default router;
