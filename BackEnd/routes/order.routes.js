import express from "express";
import {
  placeOrder,
  getMyOrders,
  getAllOrders,
  createShipment,
  getOrdersByStoreConsumerId,
} from "../controllers/order.controller.js";
import { protect } from "../middleware/auth.js";
import { isAdminOrEmployee, isAgent } from "../middleware/role.js";

const router = express.Router();

// PLACE ORDER (AGENT)
router.post("/", protect, isAgent, placeOrder);
// STORE-WISE ORDERS
router.get("/store/:consumerId", protect, getOrdersByStoreConsumerId);
// GET MY ORDERS
router.get("/my-orders", protect, isAgent, getMyOrders);
// ADMIN / EMPLOYEE
router.get("/all", protect, isAdminOrEmployee, getAllOrders);
// CREATE SHIPMENT (EMPLOYEE / ADMIN) [Future code mode --- ShipRocket]
router.post(
  "/:orderId/create-shipment",
  protect,
  isAdminOrEmployee,
  createShipment,
);

export default router;
