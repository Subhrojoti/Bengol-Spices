import mongoose from "mongoose";

const storeSchema = new mongoose.Schema(
  {
    // 🔑 Business identifier (after OTP verification)
    consumerId: {
      type: String,
      unique: true,
      index: true,
      sparse: true,
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
      index: true,
    },

    address: {
      type: String,
      required: true,
    },

    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },

    storeType: {
      type: String,
      enum: ["RETAILER", "WHOLESALER"],
      required: true,
    },

    registeredBy: {
      type: String, // agentId
      required: true,
      index: true,
    },

    // 🖼️ Store image (required)
    image: {
      url: { type: String },
      publicId: { type: String },
    },

    // 🔐 OTP verification
    otp: String,
    otpExpiresAt: Date,
    isVerified: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Store", storeSchema);
