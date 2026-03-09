import express from "express";
import {
  approveAgent,
  getAllAgents,
  getDashboardSummary,
  rejectAgent,
  // updateProductPermission,
} from "../controllers/admin.controller.js";
import { protect } from "../middleware/auth.js";
import { isAdmin } from "../middleware/role.js";
import { updateEmployeePermissions } from "../controllers/employee.controller.js";
import { checkPermission } from "../middleware/permission.js";

const router = express.Router();

// 🔒 ADMIN ONLY ROUTE
router.post(
  "/agents/:agentId/approve",
  protect, // 1️⃣ Check login (JWT)
  isAdmin, // 2️⃣ Check role = ADMIN
  approveAgent, // 3️⃣ Run controller
);
// 🔒 ADMIN ONLY – GET ALL AGENTS
router.get(
  "/agents",
  protect, // JWT check
  isAdmin, // ADMIN role check
  getAllAgents,
);
// 🔒 ADMIN ONLY – REJECT AGENT
router.post(
  "/agents/:agentId/reject",
  protect, // JWT check
  isAdmin, // ADMIN role check
  rejectAgent,
);
// Admin Give Role to Employee
// router.patch(
//   "/employees/:employeeId/product-permission",
//   protect,
//   isAdmin,
//   updateProductPermission,
// );

// Admin employee permissions
router.put(
  "/:employeeId/permissions",
  protect,
  isAdmin,
  updateEmployeePermissions,
);

//Admin Dashboard Data
router.get(
  "/dashboard-summary",
  protect,
  checkPermission("canViewDashboardSummary"),
  getDashboardSummary,
);
router.post(
  "/agents/:agentId/approve",
  protect,
  checkPermission("canApproveAgents"),
  approveAgent,
);

export default router;
