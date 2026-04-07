import Target from "../models/Target.js";
import AgentTargetProgress from "../models/AgentTargetProgress.js";
import { sendBulkNotification } from "../services/notification.service.js";
import Agent from "../models/Agent.js";
import Product from "../models/Product.js";

/* =====================================================
   ✅ CREATE TARGET (ADMIN)
===================================================== */
export const createTarget = async (req, res) => {
  try {
    const {
      name,
      type,
      targetValue,
      rewardAmount,
      productCommissions,
      paymentConfig,
      startDate,
      endDate,
    } = req.body;

    // 🔴 BASIC VALIDATION
    if (
      !name ||
      !type ||
      !targetValue ||
      !rewardAmount ||
      !startDate ||
      !endDate
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // 🟡 VALIDATE PRODUCT COMMISSIONS (ONLY FOR ORDER)
    if (type === "ORDER" && productCommissions?.length) {
      for (const rule of productCommissions) {
        const exists = await Product.findById(rule.productId);
        if (!exists) {
          return res.status(400).json({
            success: false,
            message: `Invalid productId: ${rule.productId}`,
          });
        }
      }
    }

    // ✅ CREATE TARGET
    const target = await Target.create({
      name,
      type,
      targetValue,
      rewardAmount,
      productCommissions,
      paymentConfig,
      startDate,
      endDate,
    });

    // ✅ NOTIFY ALL AGENTS
    const agents = await Agent.find({ status: "APPROVED" });

    await sendBulkNotification({
      users: agents.map((agent) => ({
        _id: agent._id,
        role: "Agent",
      })),
      title: "🎯 New Target Assigned",
      message: `A new target "${name}" has been assigned`,
      senderId: req.user._id,
    });

    return res.json({
      success: true,
      message: "Target created successfully",
      data: target,
    });
  } catch (error) {
    console.error("CREATE TARGET ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create target",
    });
  }
};

/* =====================================================
   ✅ GET TARGET PERFORMANCE (ADMIN)
===================================================== */
export const getTargetPerformance = async (req, res) => {
  try {
    const date =
      req.query.date ||
      new Date().toLocaleDateString("en-CA", {
        timeZone: "Asia/Kolkata",
      });

    const data = await AgentTargetProgress.find({ date });

    return res.json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch performance",
    });
  }
};

/* =====================================================
   ✅ GET TODAY TARGET (AGENT)
===================================================== */
export const getTodayTarget = async (req, res) => {
  try {
    const now = new Date();

    const startOfDay = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
    );
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
    );
    endOfDay.setHours(23, 59, 59, 999);

    // ✅ GET ALL ACTIVE TARGETS
    const targets = await Target.find({
      isActive: true,
      startDate: { $lte: endOfDay },
      endDate: { $gte: startOfDay },
    });

    if (!targets.length) {
      return res.json({
        success: true,
        message: "No active targets",
      });
    }

    const todayString = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });

    // ✅ GET PROGRESS
    const progress = await AgentTargetProgress.find({
      agentId: req.user.agentId,
      date: todayString,
    });

    return res.json({
      success: true,
      targets,
      progress,
    });
  } catch (error) {
    console.error("GET TARGET ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load target",
    });
  }
};
