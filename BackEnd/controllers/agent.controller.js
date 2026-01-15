import Agent from "../models/Agent.js";
import { sendAdminNotification } from "../utils/email.js";
import cloudinary from "../config/cloudinary.js";

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

    const { name, email, phone, address } = req.body;

    if (!name || !email || !phone || !address) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingAgent = await Agent.findOne({ email });
    if (existingAgent) {
      // 🔥 CLEANUP uploaded files
      await cleanupCloudinaryFiles(req.files);

      return res.status(400).json({
        success: false,
        message: "You have already applied",
      });
    }
    /* =============================
       CUSTOM AGENT ID GENERATION
       ============================= */

    const currentYear = new Date().getFullYear();

    const agentCount = await Agent.countDocuments({
      agentId: { $regex: `^BS${currentYear}` },
    });

    const serial = String(agentCount + 1).padStart(3, "0");
    const customAgentId = `BS${currentYear}-${serial}`;

    /* =============================
       CREATE AGENT
       ============================= */

    const agent = await Agent.create({
      agentId: customAgentId,
      name,
      email,
      phone,
      address,
      documents: {
        aadhaar: aadhaarPath,
        pan: panPath,
        photo: photoPath,
      },
      status: "PENDING",
      role: "AGENT",
    });

    await sendAdminNotification({
      customAgentId,
      name,
      email,
      phone,
    });

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      agentId: agent.agentId, // ✅ CUSTOM ID
    });
  } catch (error) {
    console.error("APPLY AGENT ERROR:", error);

    // 🔥 CLEANUP uploaded files on any failure
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
    // id comes from JWT (agentLogin → protect middleware)
    const agentMongoId = req.user.id;

    const agent = await Agent.findById(agentMongoId).select(
      "-password -passwordResetToken -passwordResetExpires"
    );

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found",
      });
    }

    res.json({
      success: true,
      agent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch agent profile",
    });
  }
};
