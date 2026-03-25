import Target from "../models/Target.js";
import AgentTargetProgress from "../models/AgentTargetProgress.js";
import { sendBulkNotification } from "../services/notification.service.js";
import Agent from "../models/Agent.js";
import Product from "../models/Product.js";

// Create Taget
export const createTarget = async (req, res) => {
  try {
    const {
      name,
      type,
      targetMode,
      productRules,
      globalTarget,
      startDate,
      endDate,
    } = req.body;

    // ✅ Optional: validate productIds
    if (productRules?.length) {
      for (const rule of productRules) {
        const productExists = await Product.findById(rule.productId);
        if (!productExists) {
          return res.status(400).json({
            success: false,
            message: `Invalid productId: ${rule.productId}`,
          });
        }
      }
    }

    // ✅ Create Target with FULL data
    const target = await Target.create({
      name,
      type,
      targetMode,
      productRules,
      globalTarget,
      startDate,
      endDate,
    });

    const agents = await Agent.find({ status: "APPROVED" });

    await sendBulkNotification({
      users: agents.map((agent) => ({
        _id: agent._id,
        role: "Agent",
      })),
      title: "🎯 New Target Assigned",
      message: `A new target "${name}" has been assigned to all agents`,
      senderId: req.user._id,
    });

    res.json({
      success: true,
      message: "Target created and assigned to all agents",
      data: target,
    });
  } catch (error) {
    console.error("CREATE TARGET ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create target",
    });
  }
};

// Get Target Performance
export const getTargetPerformance = async (req, res) => {
  try {
    const date = req.query.date || new Date().toISOString().split("T")[0];

    const data = await AgentTargetProgress.find({ date });

    res.json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch performance",
    });
  }
};

// Get Daily Target Agent Access Only
export const getTodayTarget = async (req, res) => {
  try {
    const now = new Date();

    // ✅ IST start & end of day
    const startOfDay = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
    );
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
    );
    endOfDay.setHours(23, 59, 59, 999);

    // ✅ Find ACTIVE target for today
    const target = await Target.findOne({
      isActive: true,
      type: "ORDER_PLACEMENT",
      startDate: { $lte: endOfDay },
      endDate: { $gte: startOfDay },
    });

    // ✅ If no active target → check upcoming
    if (!target) {
      const upcomingTarget = await Target.findOne({
        isActive: true,
        type: "ORDER_PLACEMENT",
        startDate: { $gt: endOfDay },
      }).sort({ startDate: 1 });

      if (upcomingTarget) {
        return res.json({
          success: true,
          message: "Upcoming target",
          upcoming: upcomingTarget, // ✅ full object
        });
      }

      return res.json({
        success: true,
        message: "No active target",
      });
    }

    // ✅ IST date string for progress
    const todayString = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });

    // ✅ Find progress
    const progress = await AgentTargetProgress.findOne({
      agentId: req.user.agentId,
      date: todayString,
      type: target.type,
      targetId: target._id,
    });

    const count = progress ? progress.count : 0;

    // ✅ FINAL RESPONSE (FIXED)
    return res.json({
      success: true,
      target, // ✅ FULL TARGET NOW
      progress: count,
    });
  } catch (error) {
    console.error("GET TARGET ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load target",
    });
  }
};
