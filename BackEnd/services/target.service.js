import Target from "../models/Target.js";
import AgentTargetProgress from "../models/AgentTargetProgress.js";
import AgentIncentiveLedger from "../models/AgentIncentiveLedger.js";

export const updateTargetProgress = async ({
  agentId,
  type,
  value = 0,
  amount = 0,
  order = null,
}) => {
  try {
    const today = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });

    const targets = await Target.find({
      type,
      isActive: true,
    });

    for (const target of targets) {
      let progress = await AgentTargetProgress.findOne({
        agentId,
        targetId: target._id,
        date: today,
      });

      if (!progress) {
        progress = await AgentTargetProgress.create({
          agentId,
          targetId: target._id,
          type,
          date: today,
        });
      }

      // 🟢 STORE
      if (type === "STORE_CREATION") {
        progress.achievedValue += value;
      }

      // 🟡 ORDER
      if (type === "ORDER" && order) {
        for (const item of order.products) {
          const rule = target.productCommissions.find(
            (r) => r.productId.toString() === item.productId.toString(),
          );

          if (rule) {
            progress.achievedValue += item.quantity;
            progress.earnedAmount += item.quantity * rule.commissionPerUnit;
          }
        }
      }

      // 🔵 PAYMENT
      if (type === "PAYMENT") {
        progress.achievedValue += value;
      }

      // ✅ COMPLETE CHECK
      if (
        !progress.isCompleted &&
        progress.achievedValue >= target.targetValue
      ) {
        progress.isCompleted = true;
        progress.earnedAmount += target.rewardAmount;
      }

      await AgentIncentiveLedger.create({
        agentId,
        amount: target.rewardAmount,
        type: "EARNING",
        source: "TARGET",
        referenceId: progress._id,
      });

      await progress.save();
    }
  } catch (error) {
    console.error("TARGET ERROR:", error);
  }
};
