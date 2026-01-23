import express from "express";
import { createEmployee } from "../controllers/employee.controller.js";
import { protect } from "../middleware/auth.js";
import { isAdmin } from "../middleware/role.js";

const router = express.Router();

// ADMIN creates employee
router.post("/create", protect, isAdmin, createEmployee);

export default router;
