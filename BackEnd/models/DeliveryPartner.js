import mongoose from "mongoose";

const deliveryPartnerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
    },

    password: {
      type: String,
      required: true,
    },

    documents: {
      idType: {
        type: String,
        enum: ["AADHAAR", "DRIVING_LICENSE"],
        required: true,
      },
      idNumber: {
        type: String,
        required: true,
      },
      documentUrl: {
        type: String, // Cloudinary URL
        required: true,
      },
    },

    isOnline: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },

    role: {
      type: String,
      default: "DELIVERY_PARTNER",
    },
  },
  { timestamps: true },
);

export default mongoose.model("DeliveryPartner", deliveryPartnerSchema);
