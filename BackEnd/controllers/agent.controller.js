import Agent from "../models/Agent.js";
import { sendAdminNotification } from "../utils/email.js";
import cloudinary from "../config/cloudinary.js";
import AgentSalesLocation from "../models/AgentSalesLocation.js";
import { getAgentDashboard } from "../services/dashboard.service.js";
import { getLeaderboard } from "../services/leaderboard.service.js";

const cleanupCloudinaryFiles = async (files) => {
  if (!files) return;

  const allFiles = [];

  Object.values(files).forEach((fileArr) => {
    fileArr.forEach((file) => {
      if (file.filename) {
        allFiles.push(file.filename);
      }
    });
  });

  for (const publicId of allFiles) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (err) {
      console.error("Failed to delete file:", publicId);
    }
  }
};

// AGENT - APPLY
export const applyAgent = async (req, res) => {
  try {
    const files = req.files || [];

    const getFilePath = (fieldName) => {
      if (Array.isArray(files)) {
        return files.find((f) => f.fieldname === fieldName)?.path;
      }
      return files[fieldName]?.[0]?.path;
    };

    const aadhaarPath = getFilePath("aadhaar");
    const panPath = getFilePath("pan");
    const photoPath = getFilePath("photo");

    if (!aadhaarPath || !panPath || !photoPath) {
      return res.status(400).json({
        success: false,
        message: "All documents are required",
      });
    }

    const {
      name,
      email,
      phone,

      // ✅ FULL ADDRESS (manual input)
      address,

      // ✅ STRUCTURED ADDRESS
      state,
      city,
      street,
      pincode,

      // ✅ BANK FIELDS
      accountHolderName,
      accountNumber,
      ifscCode,
      bankName,
    } = req.body;

    // ✅ VALIDATION (updated safely)
    if (
      !name ||
      !email ||
      !phone ||
      !address ||
      !state ||
      !city ||
      !street ||
      !pincode
    ) {
      await cleanupCloudinaryFiles(req.files);

      return res.status(400).json({
        success: false,
        message: "All fields including full address are required",
      });
    }

    // 🔥 STRICT BANK VALIDATION
    const hasAnyBankField =
      accountHolderName || accountNumber || ifscCode || bankName;

    const hasAllBankFields =
      accountHolderName && accountNumber && ifscCode && bankName;

    if (hasAnyBankField && !hasAllBankFields) {
      await cleanupCloudinaryFiles(req.files);

      return res.status(400).json({
        success: false,
        message: "Please provide complete bank details",
      });
    }

    const existingAgent = await Agent.findOne({ email });
    if (existingAgent) {
      await cleanupCloudinaryFiles(req.files);

      return res.status(400).json({
        success: false,
        message: "You have already applied",
      });
    }

    /* =============================
       SAFE AGENT ID GENERATION
       ============================= */
    const currentYear = new Date().getFullYear();

    const counter = await Counter.findByIdAndUpdate(
      `agent-${currentYear}`,
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );

    const customAgentId = `BS${currentYear}-${String(counter.seq).padStart(3, "0")}`;

    /* =============================
       CREATE AGENT
       ============================= */

    const agentData = {
      agentId: customAgentId,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),

      // ✅ FULL ADDRESS (user input)
      address: address.trim(),

      // ✅ STRUCTURED ADDRESS
      addressDetails: {
        state: state.trim().toUpperCase(),
        city: city.trim(),
        street: street.trim(),
        pincode: pincode.trim(),
      },

      documents: {
        aadhaar: aadhaarPath,
        pan: panPath,
        photo: photoPath,
      },

      status: "PENDING",
      role: "AGENT",
    };

    // ✅ ADD BANK DETAILS ONLY IF COMPLETE
    if (hasAllBankFields) {
      agentData.bankDetails = {
        accountHolderName: accountHolderName.trim(),
        accountNumber: accountNumber.trim(),
        ifscCode: ifscCode.trim().toUpperCase(),
        bankName: bankName.trim(),
      };
    }

    const agent = await Agent.create(agentData);

    await sendAdminNotification({
      customAgentId,
      name,
      email,
      phone,
    });

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      agentId: agent.agentId,
    });
  } catch (error) {
    console.error("APPLY AGENT ERROR:", error);

    await cleanupCloudinaryFiles(req.files);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Agent ID conflict, please retry",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

// GET LOGGED-IN AGENT PROFILE
export const getAgentProfile = async (req, res) => {
  try {
    const agentMongoId = req.user.id;

    const agent = await Agent.findById(agentMongoId).select(
      "-password -passwordResetToken -passwordResetExpires",
    );

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found",
      });
    }

    const data = agent.toObject();

    // ✅ Handle missing bank details
    if (!data.bankDetails || Object.keys(data.bankDetails).length === 0) {
      data.bankDetails = null;
    }

    // ✅ Add helper flag (very useful for frontend)
    data.hasBankDetails = !!data.bankDetails?.accountNumber;

    res.json({
      success: true,
      agent: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch agent profile",
    });
  }
};

// ASSIGN SALES LOCATION
export const assignSalesLocation = async (req, res) => {
  try {
    const { agentId, pincodes, state, city } = req.body;

    if (!agentId || !pincodes || pincodes.length === 0 || !state) {
      return res.status(400).json({
        success: false,
        message: "agentId, state and at least one pincode are required",
      });
    }

    // ✅ Check Agent exists
    const agent = await Agent.findOne({ agentId });
    if (!agent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found",
      });
    }

    // ✅ Validate pincodes
    const invalidPins = pincodes.filter((pin) => !/^[0-9]{6}$/.test(pin));

    if (invalidPins.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid pincodes: ${invalidPins.join(", ")}`,
      });
    }

    // ✅ Upsert (update or create)
    const location = await AgentSalesLocation.findOneAndUpdate(
      { agentId, state: state.toUpperCase() },
      {
        agentId,
        pincodes,
        state: state.toUpperCase(),
        city,
        assignedBy: req.user._id,
        assignedByModel: req.user.role === "ADMIN" ? "Admin" : "Employee",
      },
      { new: true, upsert: true },
    );

    return res.status(200).json({
      success: true,
      message: "Sales location assigned successfully",
      data: location,
    });
  } catch (error) {
    console.error("ASSIGN LOCATION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Agent Dashboard

export const agentDashboard = async (req, res) => {
  const agentId = req.user.agentId; // ✅ FROM TOKEN
  try {
    const { from, to } = req.query;

    // ✅ DEFAULT (1 MONTH)
    const endDate = to ? new Date(to) : new Date();
    const startDate = from
      ? new Date(from)
      : new Date(new Date().setMonth(endDate.getMonth() - 1));

    const data = await getAgentDashboard({
      agentId,
      from: startDate,
      to: endDate,
    });

    // console.log("FROM:", startDate);
    // console.log("TO:", endDate);
    // console.log("AGENT:", agentId);

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Dashboard error",
    });
  }
};

// Agent Leaderboard

export const leaderboard = async (req, res) => {
  try {
    const { from, to, limit } = req.query;

    // ✅ Default: last 30 days
    const endDate = to ? new Date(to) : new Date();
    const startDate = from
      ? new Date(from)
      : new Date(new Date().setDate(endDate.getDate() - 30));

    const data = await getLeaderboard({
      from: startDate,
      to: endDate,
      limit: limit || 10,
    });

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Leaderboard error",
    });
  }
};
