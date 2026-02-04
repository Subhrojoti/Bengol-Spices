import Store from "../models/store.js";
import cloudinary from "../config/cloudinary.js";
import { generateOTP, sendOtpSMS } from "../utils/otp.js";

export const initiateStoreRegistration = async (req, res) => {
  let uploadedImageId = null;

  try {
    const {
      storeName,
      ownerName,
      phone,
      address,
      latitude,
      longitude,
      storeType,
    } = req.body;

    if (
      !storeName ||
      !ownerName ||
      !phone ||
      !address ||
      latitude === undefined ||
      longitude === undefined ||
      !storeType
    ) {
      throw new Error("All fields are required");
    }

    if (!req.file) {
      throw new Error("Store image is required");
    }

    uploadedImageId = req.file.filename;

    const exists = await Store.findOne({
      phone,
      isVerified: true,
    });

    if (exists) {
      throw new Error("Store already registered with this phone");
    }

    const otp = generateOTP();

    const store = await Store.create({
      storeName,
      ownerName,
      phone,
      address,
      location: {
        latitude: Number(latitude),
        longitude: Number(longitude),
      },
      storeType,
      registeredBy: req.user.agentId,
      image: {
        url: req.file.path,
        publicId: req.file.filename,
      },
      otp,
      otpExpiresAt: Date.now() + 5 * 60 * 1000, // 5 min
      isVerified: false,
    });

    await sendOtpSMS(phone, otp);

    return res.json({
      success: true,
      message: "OTP sent to store mobile number",
      storeId: store._id,
    });
  } catch (error) {
    // 🔥 cleanup image if failed
    if (uploadedImageId) {
      await cloudinary.uploader.destroy(uploadedImageId);
    }

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyStoreOtp = async (req, res) => {
  try {
    const { storeId, otp } = req.body;

    if (!storeId || !otp) {
      return res.status(400).json({
        success: false,
        message: "Store ID and OTP are required",
      });
    }

    const store = await Store.findById(storeId);

    if (
      !store ||
      store.isVerified ||
      store.otp !== otp ||
      store.otpExpiresAt < Date.now()
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // 🔑 Generate consumerId
    const year = new Date().getFullYear();
    const count = await Store.countDocuments({
      consumerId: { $regex: `^CS${year}` },
    });

    store.consumerId = `CS${year}-${String(count + 1).padStart(4, "0")}`;
    store.isVerified = true;
    store.otp = undefined;
    store.otpExpiresAt = undefined;

    await store.save();

    return res.json({
      success: true,
      message: "Store registered successfully",
      consumerId: store.consumerId,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "OTP verification failed",
    });
  }
};

// GET STORES REGISTERED BY LOGGED-IN AGENT
export const getMyStores = async (req, res) => {
  try {
    // 🔒 agentId comes from JWT
    const agentId = req.user.agentId;

    if (!agentId) {
      return res.status(401).json({
        success: false,
        message: "Agent identity missing in token",
      });
    }

    const stores = await Store.find({ registeredBy: agentId }).sort({
      createdAt: -1,
    });

    return res.json({
      success: true,
      count: stores.length,
      stores,
    });
  } catch (error) {
    console.error("GET MY STORES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch stores",
    });
  }
};
