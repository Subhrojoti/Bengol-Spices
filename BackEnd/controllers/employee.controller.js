import bcrypt from "bcryptjs";
import Employee from "../models/Employee.js";
import { sendEmployeeWelcomeMail } from "../utils/email.js";
import { createNotification } from "../services/notification.service.js";

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

    // 📷 PROFILE IMAGE (OPTIONAL)
    let profilePic = {
      url: "",
      publicId: "",
    };

    if (req.file) {
      profilePic = {
        url: req.file.path, // Cloudinary URL
        publicId: req.file.filename, // Cloudinary public_id
      };
    }

    // 🔹 AUTO EMPLOYEE ID
    const currentYear = new Date().getFullYear();

    const count = await Employee.countDocuments({
      employeeId: { $regex: `^EMP${currentYear}` },
    });

    const serial = String(count + 1).padStart(3, "0");
    const employeeId = `EMP${currentYear}-${serial}`;

    const hashedPassword = await bcrypt.hash(password, 10);

    // console.log("Files", req.file);
    // console.log("Body", req.body);

    const employee = await Employee.create({
      employeeId,
      name,
      email,
      password: hashedPassword,
      role: "EMPLOYEE",
      profilePic,
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
      profilePic: employee.profilePic,
    });
  } catch (error) {
    console.error("CREATE EMPLOYEE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create employee",
    });
  }
};

// ADMIN - GET ALL ACTIVE EMPLOYEES
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({ status: "ACTIVE" }) // ✅ only active
      .select("employeeId name email role permissions status createdAt")
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

    // 🧠 Detect changes
    const previousPermissions = { ...employee.permissions };

    let granted = [];
    let revoked = [];

    for (const key in permissions) {
      if (permissions[key] === true && !previousPermissions[key]) {
        granted.push(key);
      }

      if (permissions[key] === false && previousPermissions[key]) {
        revoked.push(key);
      }
    }

    // ✅ Update permissions
    employee.permissions = {
      ...employee.permissions,
      ...permissions,
    };

    await employee.save();

    // 🔥 Send notification based on change
    if (granted.length > 0 || revoked.length > 0) {
      let message = "";

      if (granted.length > 0 && revoked.length === 0) {
        message = "New permissions granted. Please re-login.";
      } else if (revoked.length > 0 && granted.length === 0) {
        message = "Some permissions were removed. Access may be restricted.";
      } else {
        message = "Your permissions have been updated. Please re-login.";
      }

      await createNotification({
        title: "Permission Update",
        message,
        recipientId: employee._id, // ✅ always use _id
        recipientModel: "Employee",
        meta: {
          granted,
          revoked,
        },
      });
    }

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

// EMPLOYEE - GET OWN PROFILE
export const getEmployeeProfile = async (req, res) => {
  try {
    const employeeId = req.user.id; // coming from auth middleware

    const employee = await Employee.findById(employeeId).select("-password");

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    return res.status(200).json({
      success: true,
      employee,
    });
  } catch (error) {
    console.error("GET EMPLOYEE PROFILE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch employee profile",
    });
  }
};

// ADMIN - SOFT DELETE EMPLOYEE
export const deleteEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const employee = await Employee.findOne({ employeeId });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // ❗ Prevent admin deleting themselves
    if (employee._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account",
      });
    }

    // ❗ Already inactive check
    if (employee.status === "INACTIVE") {
      return res.status(400).json({
        success: false,
        message: "Employee already deleted",
      });
    }

    // ✅ SOFT DELETE
    employee.status = "INACTIVE";
    employee.isOnline = false;

    await employee.save();

    return res.status(200).json({
      success: true,
      message: "Employee deleted (soft) successfully",
    });
  } catch (error) {
    console.error("DELETE EMPLOYEE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete employee",
    });
  }
};
