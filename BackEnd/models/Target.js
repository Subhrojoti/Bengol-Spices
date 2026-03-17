import mongoose from "mongoose";

const targetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["STORE_CREATION", "ORDER_PLACEMENT", "PAYMENT_COLLECTION"],
      required: true,
    },

    requiredCount: {
      type: Number,
      required: true,
    },

    incentiveAmount: {
      type: Number,
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Target", targetSchema);
