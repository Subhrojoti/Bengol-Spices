// models/Agent.js
import mongoose from "mongoose";

const agentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    phone: {
      type: String,
      required: true,
    },

    documents: {
      aadhaar: {
        type: String, // file path / url
        required: true,
      },
      pan: {
        type: String,
        required: true,
      },
      photo: {
        type: String,
        required: true,
      },
    },

    address: {
      type: String,
      required: true,
    },

    agentId: {
      type: String,
      unique: true,
      sparse: true, // important
    },

    password: {
      type: String,
    },

    passwordResetToken: String,
    passwordResetExpires: Date,

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },

    role: {
      type: String,
      default: "AGENT",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Agent", agentSchema);
