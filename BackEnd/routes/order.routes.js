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
  cancelOrder,
  getActiveOrders,
  collectPayment,
  getOrderPayments,
  getAgentDueOrders,
  getAgentCollectionPerformance,
  getCompletePaymentSummary,
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../controllers/order.controller.js";
import { protect } from "../middleware/auth.js";
import { isAgent, isDeliveryPartner } from "../middleware/role.js";
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

// GET ALL ACTIVE ORDERS (Admin / Employee)
router.get(
  "/active",
  protect,
  checkPermission("canGetAllOrders"),
  getActiveOrders,
);

//Confirm Order (Admin / Employee)
router.put(
  "/:orderId/confirm",
  protect,
  checkPermission("canConfirmOrders"),
  confirmOrder,
);
router.put(
  "/:orderId/cancel",
  protect,
  checkPermission("canCancelOrders"),
  cancelOrder,
);
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

// Collect Payment (Agent Access Only)
router.post("/:orderId/collect-payment", protect, isAgent, collectPayment);

// Get Payment Info (Admin / Employee with permission)
router.get(
  "/:orderId/payments",
  protect,
  checkPermission("canSeePaymentInfo"),
  getOrderPayments,
);

// Agent Due Orders (Agent Access Only)
router.get("/due-orders", protect, isAgent, getAgentDueOrders);

// Get Complete Payment Summary (Admin / Employee with permission)
router.get(
  "/complete-payment-summary",
  protect,
  checkPermission("canSeePaymentInfo"),
  getCompletePaymentSummary,
);

// Get Agent CollectionPerformance (Admin / Employee with permission)
router.get(
  "/agent-collection-performance",
  protect,
  checkPermission("canSeePaymentInfo"),
  getAgentCollectionPerformance,
);

// Razorpay Payment Gateway route
router.post("/razorpay/create", protect, isAgent, createRazorpayOrder);
router.post("/razorpay/verify", protect, isAgent, verifyRazorpayPayment);

// CREATE SHIPMENT (EMPLOYEE / ADMIN) [Future code mode --- ShipRocket]
// router.post(
//   "/:orderId/create-shipment",
//   protect,
//   isAdminOrEmployee,
//   createShipment,
// );

export default router;
