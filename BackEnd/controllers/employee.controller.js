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
