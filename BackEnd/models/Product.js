import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    /* =============================
       BASIC PRODUCT INFO
       ============================= */

    name: {
      type: String, // Short name (e.g. Turmeric)
      required: true,
      trim: true,
    },

    title: {
      type: String, // Full display name
      required: true,
    },

    description: {
      type: String,
    },

    brand: {
      type: String,
      default: "Bengol Spices",
    },

    /* =============================
       CATEGORY & IDENTIFICATION
       ============================= */

    category: {
      type: String, // e.g. Whole Spices, Powder
      required: true,
      index: true,
    },

    sku: {
      type: String, // Unique product code
      required: true,
      unique: true,
      index: true,
    },

    uom: {
      type: String, // kg, g, packet, box
      required: true,
    },

    /* =============================
       PRICING
       ============================= */

    price: {
      type: Number, // Original price
      required: true,
      min: 0,
    },

    discountPrice: {
      type: Number, // Selling price
      min: 0,
    },

    gstPercentage: {
      type: Number, // 0, 5, 12, 18
      default: 5,
    },

    /* =============================
       STOCK & ORDER RULES
       ============================= */

    stock: {
      type: Number, // Current available stock
      required: true,
      min: 0,
    },

    minOrderQty: {
      type: Number, // Minimum order quantity
      default: 1,
      min: 1,
    },

    /* =============================
       CERTIFICATIONS
       ============================= */

    certificates: [
      {
        type: String, // FSSAI, ISO, Organic etc
      },
    ],

    /* =============================
       PRODUCT IMAGES
       ============================= */

    images: {
      front: {
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
          required: true,
        },
      },
      back: {
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
          required: true,
        },
      },
    },

    /* =============================
       PRODUCT STATUS
       ============================= */

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
      index: true,
    },

    /* =============================
       AUDIT
       ============================= */

    createdBy: {
      type: String, // ADMIN / EMPLOYEE ID (optional)
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
  },
);

export default mongoose.model("Product", productSchema);
