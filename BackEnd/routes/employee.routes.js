import express from "express";
import {
  createEmployee,
  getAllEmployees,
  getEmployeeProfile,
} from "../controllers/employee.controller.js";
import { protect } from "../middleware/auth.js";
import { isAdmin, isEmployee } from "../middleware/role.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// ADMIN creates employee
router.post(
  "/create",
  protect,
  isAdmin,
  upload.single("profilePic"),
  createEmployee,
);
// ADMIN - GET ALL EMPLOYEES
router.get("/all", protect, isAdmin, getAllEmployees);
// Get Employee Profile - Employee Access Only
router.get("/profile", protect, isEmployee, getEmployeeProfile);

export default router;
