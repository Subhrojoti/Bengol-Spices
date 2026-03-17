import Target from "../models/Target.js";
import AgentTargetProgress from "../models/AgentTargetProgress.js";
import Agent from "../models/Agent.js";

// Create Taget
export const createTarget = async (req, res) => {
  try {
    const { name, type, requiredCount, incentiveAmount, startDate, endDate } =
      req.body;

    const target = await Target.create({
      name,
      type,
      requiredCount,
      incentiveAmount,
      startDate,
      endDate,
    });

    res.json({
      success: true,
      data: target,
    });
  } catch (error) {
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

    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
      0,
    );

    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999,
    );
    const target = await Target.findOne({
      isActive: true,
      startDate: { $lte: endOfDay },
      endDate: { $gte: startOfDay },
    });

    if (!target) {
      // console.log("startOfDay:", startOfDay);
      // console.log("endOfDay:", endOfDay);
      return res.json({
        success: true,
        message: "New target coming soon",
      });
    }

    const todayString = new Date().toISOString().split("T")[0];

    const progress = await AgentTargetProgress.findOne({
      agentId: req.user.agentId,
      date: todayString,
      type: target.type,
    });

    const count = progress ? progress.count : 0;

    res.json({
      success: true,
      target: {
        name: target.name,
        requiredCount: target.requiredCount,
        incentiveAmount: target.incentiveAmount,
      },
      progress: count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load target",
    });
  }
};
