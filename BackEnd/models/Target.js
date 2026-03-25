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

    // ✅ OLD (keep for backward compatibility)
    requiredCount: Number,
    incentiveAmount: Number,

    // ✅ NEW: Target mode
    targetMode: {
      type: String,
      enum: ["PER_PACKET", "BULK", "HYBRID"],
      default: "BULK",
    },

    // ✅ NEW: Product-specific rules
    productRules: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },

        productName: String,

        // per packet commission
        perPacketCommission: Number,

        // bulk target
        bulkTarget: Number,
        bulkIncentive: Number,
      },
    ],

    // ✅ NEW: Global bulk target (optional)
    globalTarget: {
      totalPackets: Number,
      incentive: Number,
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
