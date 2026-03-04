import bcrypt from "bcryptjs";
import Employee from "../models/Employee.js";
import { sendEmployeeWelcomeMail } from "../utils/email.js";

// ADMIN CREATE EMPLOYEE
export const createEmployee = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const exists = await Employee.findOne({ email });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Employee already exists",
      });
    }

    // 🔹 AUTO EMPLOYEE ID
    const currentYear = new Date().getFullYear();

    const count = await Employee.countDocuments({
      employeeId: { $regex: `^EMP${currentYear}` },
    });

    const serial = String(count + 1).padStart(3, "0");
    const employeeId = `EMP${currentYear}-${serial}`;

    const hashedPassword = await bcrypt.hash(password, 10);

    const employee = await Employee.create({
      employeeId,
      name,
      email,
      password: hashedPassword,
      role: "EMPLOYEE",
    });

    // 📧 SEND EMAIL
    await sendEmployeeWelcomeMail({
      name,
      email,
      employeeId,
    });

    return res.status(201).json({
      success: true,
      message: "Employee created successfully",
      employeeId: employee.employeeId,
    });
  } catch (error) {
    console.error("CREATE EMPLOYEE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create employee",
    });
  }
};

// ADMIN - GET ALL EMPLOYEES
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .select("employeeId name email role canManageProducts status createdAt")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: employees.length,
      employees,
    });
  } catch (error) {
    console.error("GET ALL EMPLOYEES ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch employees",
    });
  }
};

// ADMIN - UPDATE EMPLOYEE PERMISSIONS
export const updateEmployeePermissions = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { permissions } = req.body;

    const employee = await Employee.findOne({ employeeId });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    employee.permissions = {
      ...employee.permissions,
      ...permissions,
    };

    await employee.save();

    return res.json({
      success: true,
      message: "Permissions updated successfully",
      permissions: employee.permissions,
    });
  } catch (error) {
    console.error("UPDATE PERMISSION ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update permissions",
    });
  }
};
