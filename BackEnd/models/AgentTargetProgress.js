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
  },
  { timestamps: true },
);

export default mongoose.model("AgentTargetProgress", progressSchema);
