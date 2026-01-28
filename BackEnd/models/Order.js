import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    /* =============================
       BASIC IDENTIFIERS
       ============================= */

    orderId: {
      type: String, // e.g. ORD2026-0001
      required: true,
      unique: true,
      index: true,
    },

    consumerId: {
      type: String, // e.g. CS2026-0001 (Store)
      required: true,
      index: true,
    },

    agentId: {
      type: String, // e.g. BS2026-001
      required: true,
      index: true,
    },

    /* =============================
       PRODUCTS ORDERED (SPICES)
       ============================= */

    products: [
      {
        name: {
          type: String, // Spice name
          required: true,
        },

        quantity: {
          type: Number, // Quantity ordered
          required: true,
          min: 1,
        },

        unitPrice: {
          type: Number, // Price per unit
          required: true,
          min: 0,
        },

        uom: {
          type: String,
          required: true,
        },

        totalPrice: {
          type: Number, // quantity × unitPrice
          required: true,
          min: 0,
        },

        image: {
          type: String, // Product image URL (optional)
        },
      },
    ],

    /* =============================
       PAYMENT DETAILS
       ============================= */

    totalAmount: {
      type: Number, // Sum of all products
      required: true,
      min: 1,
    },

    paidAmount: {
      type: Number, // Mandatory initial payment
      required: true,
      min: 1,
    },

    dueAmount: {
      type: Number, // Remaining amount
      required: true,
      min: 0,
    },

    paymentMode: {
      type: String,
      enum: ["CASH", "ONLINE", "MIXED"],
      required: true,
    },

    dueDate: {
      type: Date, // Order date + 7 days
      required: true,
    },

    /* =============================
       ORDER STATUS
       ============================= */

    status: {
      type: String,
      enum: [
        "PLACED",
        "CONFIRMED",
        "SHIPPED",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "CANCELLED",
      ],
      default: "PLACED",
    },

    /* =============================
       LOCATION (WHERE ORDER WAS PLACED)
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
       SHIPMENT DETAILS (IMPORTANT PART)
       ============================= */

    shipment: {
      provider: {
        type: String, // e.g. SHIPROCKET
      },

      awb: {
        type: String, // Courier tracking number
      },

      trackingUrl: {
        type: String, // Courier tracking link
      },

      status: {
        type: String, // CREATED, IN_TRANSIT, DELIVERED, FAILED
      },

      createdAt: {
        type: Date,
      },
    },

    /* =============================
       LEGACY / OPTIONAL MANUAL DELIVERY
       (KEEP EMPTY FOR NOW)
       ============================= */

    delivery: {
      partnerName: String,
      driverName: String,
      vehicleNumber: String,
      assignedAt: Date,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt auto
  },
);

export default mongoose.model("Order", orderSchema);
