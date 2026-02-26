import mongoose from "mongoose";

const returnSchema = new mongoose.Schema(
  {
    /* =============================
       BASIC IDENTIFIERS
       ============================= */

    returnId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    orderId: {
      type: String,
      required: true,
      index: true,
    },

    consumerId: {
      type: String,
      required: true,
      index: true,
    },

    agentId: {
      type: String,
      required: true,
      index: true,
    },

    /* =============================
       RETURN DETAILS
       ============================= */

    reason: {
      type: String,
      required: true,
      trim: true,
    },

    initiatedBy: {
      id: String,
      name: String,
      role: {
        type: String,
        enum: ["AGENT"],
      },
    },

    initiatedAt: {
      type: Date,
      default: Date.now,
    },

    /* =============================
       RETURN STATUS FLOW
       ============================= */

    status: {
      type: String,
      enum: [
        "INITIATED",
        "PICKUP_ASSIGNED",
        "PICKED_UP",
        "RECEIVED_AT_WAREHOUSE",
        "REFUND_PROCESSED",
        "COMPLETED",
        "CANCELLED",
      ],
      default: "INITIATED",
    },

    statusHistory: [
      {
        status: {
          type: String,
        },
        changedAt: {
          type: Date,
          default: Date.now,
        },
        changedBy: {
          id: String,
          name: String,
          role: String,
        },
        note: String,
      },
    ],

    /* =============================
       PICKUP DETAILS (Future)
       ============================= */

    pickup: {
      partnerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DeliveryPartner",
      },
      assignedAt: Date,
      pickedUpAt: Date,
    },

    /* =============================
       REFUND DETAILS (Future)
       ============================= */

    refund: {
      amount: Number,
      method: {
        type: String,
        enum: ["CASH", "ONLINE", "ADJUSTMENT"],
      },
      processedAt: Date,
      processedBy: {
        id: String,
        name: String,
        role: String,
      },
    },

    /* =============================
       INTERNAL FLAGS
       ============================= */

    isClosed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

/* =============================
   INDEXES FOR PERFORMANCE
   ============================= */

returnSchema.index({ status: 1 });

export default mongoose.model("Return", returnSchema);
