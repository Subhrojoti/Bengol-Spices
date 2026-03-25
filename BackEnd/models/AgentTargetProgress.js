import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    agentId: {
      type: String,
      required: true,
      index: true,
    },

    date: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      required: true,
    },

    count: {
      type: Number,
      default: 0,
    },

    incentiveEarned: {
      type: Number,
      default: 0,
    },

    bulkAchieved: {
      type: Boolean,
      default: false,
    },

    milestonesNotified: {
      type: [Number], // e.g. [50, 80, 100]
      default: [],
    },

    targetAchieved: {
      type: Boolean,
      default: false,
    },

    // ✅ NEW (optional, no breaking)
    productBreakdown: [
      {
        productId: mongoose.Schema.Types.ObjectId,
        quantity: Number,
      },
    ],

    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Target",
    },
  },
  { timestamps: true },
);

export default mongoose.model("AgentTargetProgress", progressSchema);
