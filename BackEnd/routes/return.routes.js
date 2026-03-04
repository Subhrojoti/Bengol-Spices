import express from "express";
import {
  assignReturnPickup,
  cancelReturn,
  getAssignedReturns,
  getMyReturns,
  initiateReturn,
  updateReturnStatus,
} from "../controllers/return.controller.js";
import { protect } from "../middleware/auth.js";
import { isAgent, isDeliveryPartner } from "../middleware/role.js";
import { checkPermission } from "../middleware/permission.js";

const router = express.Router();

router.post("/:orderId/initiate", protect, isAgent, initiateReturn);
router.put(
  "/:returnId/assign-pickup",
  protect,
  checkPermission("canAssignReturn"),
  assignReturnPickup,
);

router.get("/my-returns", protect, isAgent, getMyReturns);

// Delivery Partner - Get Assigned Returns
router.get(
  "/delivery/assigned",
  protect,
  isDeliveryPartner,
  getAssignedReturns,
);

// Delivery Partner - Update Return Status
router.put(
  "/delivery/:returnId/status",
  protect,
  isDeliveryPartner,
  updateReturnStatus,
);

// Cancel Return (Agent)
router.put("/:returnId/cancel", protect, isAgent, cancelReturn);
export default router;
