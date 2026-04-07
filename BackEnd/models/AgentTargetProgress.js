import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    agentId: {
      type: String, // 🔥 CHANGE THIS
      required: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Target",
      required: true,
    },

    type: {
      type: String,
      enum: ["STORE_CREATION", "ORDER", "PAYMENT"],
    },

    date: {
      type: String, // "YYYY-MM-DD"
      required: true,
    },

    // 📊 PROGRESS TRACKING
    achievedValue: {
      type: Number,
      default: 0,
    },

    earnedAmount: {
      type: Number,
      default: 0,
    },

    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// 🚀 PERFORMANCE INDEX (VERY IMPORTANT)
progressSchema.index({ agentId: 1, targetId: 1, date: 1 });

export default mongoose.model("AgentTargetProgress", progressSchema);
