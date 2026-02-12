import express from "express";
import {
  createEmployee,
  getAllEmployees,
} from "../controllers/employee.controller.js";
import { protect } from "../middleware/auth.js";
import { isAdmin } from "../middleware/role.js";

const router = express.Router();

// ADMIN creates employee
router.post("/create", protect, isAdmin, createEmployee);
// ADMIN - GET ALL EMPLOYEES
router.get("/all", protect, isAdmin, getAllEmployees);

export default router;
