import Agent from "../models/Agent.js";
import { sendAdminNotification } from "../utils/email.js";

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

    // handle duplicate agentId edge case
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
