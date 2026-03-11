import express from "express";
import {
  approveAgent,
  getAllAgents,
  getDashboardSummary,
  rejectAgent,
} from "../controllers/admin.controller.js";

import { updateEmployeePermissions } from "../controllers/employee.controller.js";

import { protect } from "../middleware/auth.js";
import { isAdmin } from "../middleware/role.js";
import { checkPermission } from "../middleware/permission.js";

const router = express.Router();

// 🔒 All routes require login
router.use(protect);

// =============================
// ADMIN ONLY
// =============================

// Admin updates employee permissions
router.put("/:employeeId/permissions", isAdmin, updateEmployeePermissions);

// =============================
// PERMISSION BASED
// =============================

// Approve Agent
router.post(
  "/agents/:agentId/approve",
  checkPermission("canApproveAgents"),
  approveAgent,
);

// Reject Agent
router.post(
  "/agents/:agentId/reject",
  checkPermission("canManageAgents"),
  rejectAgent,
);

// Get all agents
router.get("/agents", checkPermission("canManageAgents"), getAllAgents);

// Dashboard summary
router.get(
  "/dashboard-summary",
  checkPermission("canViewDashboardSummary"),
  getDashboardSummary,
);

export default router;
