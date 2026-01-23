import bcrypt from "bcryptjs";
import Employee from "../models/Employee.js";

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

    const hashedPassword = await bcrypt.hash(password, 10);

    const employee = await Employee.create({
      name,
      email,
      password: hashedPassword,
      role: "EMPLOYEE",
    });

    return res.status(201).json({
      success: true,
      message: "Employee created successfully",
      employeeId: employee._id,
    });
  } catch (error) {
    console.error("CREATE EMPLOYEE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create employee",
    });
  }
};
