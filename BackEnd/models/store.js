import mongoose from "mongoose";

const storeSchema = new mongoose.Schema(
  {
    // 🔑 Business Identifier (used everywhere)
    consumerId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // 🏪 Store details
    storeName: {
      type: String,
      required: true,
      trim: true,
    },

    ownerName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    // 📍 Exact location (for map & delivery)
    location: {
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    },

    // 🏷️ Store category
    storeType: {
      type: String,
      enum: ["RETAILER", "WHOLESALER"],
      required: true,
    },

    // 👤 Which agent registered this store
    registeredBy: {
      type: String, // agentId like BS2026-001
      required: true,
      index: true,
    },

    // 🟢 Store status
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

export default mongoose.model("Store", storeSchema);
