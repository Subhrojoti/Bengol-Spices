import express from "express";
import {
  assignReturnPickup,
  getAssignedReturns,
  initiateReturn,
  updateReturnStatus,
} from "../controllers/return.controller.js";
import { protect } from "../middleware/auth.js";
import {
  isAdminOrEmployee,
  isAgent,
  isDeliveryPartner,
} from "../middleware/role.js";

const router = express.Router();

router.post("/:orderId/initiate", protect, isAgent, initiateReturn);
router.put(
  "/:returnId/assign-pickup",
  protect,
  isAdminOrEmployee,
  assignReturnPickup,
);

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
export default router;
