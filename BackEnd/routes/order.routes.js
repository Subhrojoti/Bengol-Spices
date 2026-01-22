import express from "express";
import {
  placeOrder,
  getMyOrders,
  getAllOrders,
} from "../controllers/order.controller.js";
import { protect } from "../middleware/auth.js";
import { isAdminOrEmployee, isAgent } from "../middleware/role.js";

const router = express.Router();

// PLACE ORDER (AGENT)
router.post("/", protect, isAgent, placeOrder);
// GET MY ORDERS
router.get("/my-orders", protect, isAgent, getMyOrders);
// ADMIN / EMPLOYEE
router.get("/all", protect, isAdminOrEmployee, getAllOrders);

export default router;
