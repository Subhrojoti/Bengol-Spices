import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    /* =============================
       BASIC REFERENCES
       ============================= */

    orderId: {
      type: String, // Business-friendly order ID
      required: true,
      unique: true,
      index: true,
    },

    consumerId: {
      type: String, // CS2026-0001
      required: true,
      index: true,
    },

    agentId: {
      type: String, // BS2026-001
      required: true,
      index: true,
    },

    /* =============================
       PRODUCTS (SPICES)
       ============================= */

    products: [
      {
        name: {
          type: String,
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
          min: 1,
        },

        unitPrice: {
          type: Number,
          required: true,
          min: 0,
        },

        totalPrice: {
          type: Number,
          required: true,
          min: 0,
        },

        image: {
          type: String, // product image URL
        },
      },
    ],

    /* =============================
       AMOUNT DETAILS
       ============================= */

    totalAmount: {
      type: Number,
      required: true,
      min: 1,
    },

    paidAmount: {
      type: Number,
      required: true,
      min: 1, // 🔥 mandatory minimum payment
    },

    dueAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentMode: {
      type: String,
      enum: ["CASH", "ONLINE", "MIXED"],
      required: true,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    /* =============================
       ORDER STATUS & DELIVERY
       ============================= */

    status: {
      type: String,
      enum: [
        "PLACED",
        "CONFIRMED",
        "ASSIGNED_FOR_DELIVERY",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "CANCELLED",
      ],
      default: "PLACED",
    },

    /* =============================
       LOCATION (ORDER PLACED FROM)
       ============================= */

    orderLocation: {
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    },

    /* =============================
       DELIVERY DETAILS (FILLED BY OFFICE)
       ============================= */

    delivery: {
      partnerName: String,
      driverName: String,
      vehicleNumber: String,
      assignedAt: Date,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Order", orderSchema);
