import Store from "../models/store.js";
import cloudinary from "../config/cloudinary.js";
export const createStore = async (req, res) => {
  let uploadedImageId = null;

  try {
    const {
      storeName,
      ownerName,
      phone,
      state,
      city,
      street,
      pincode,
      latitude,
      longitude,
      storeType,
    } = req.body;

    if (
      !storeName ||
      !ownerName ||
      !phone ||
      !state ||
      !city ||
      !street ||
      !pincode ||
      latitude === undefined ||
      longitude === undefined ||
      !storeType
    ) {
      throw new Error("All fields including complete address are required");
    }

    if (!req.file) {
      throw new Error("Store image is required");
    }

    uploadedImageId = req.file.filename;

    const exists = await Store.findOne({ phone });
    if (exists) {
      throw new Error("Store already registered with this phone");
    }

    // 🔑 Generate consumerId
    const year = new Date().getFullYear();
    const count = await Store.countDocuments({
      consumerId: { $regex: `^CS${year}` },
    });

    const consumerId = `CS${year}-${String(count + 1).padStart(4, "0")}`;

    const store = await Store.create({
      consumerId,
      storeName: storeName.trim(),
      ownerName: ownerName.trim(),
      phone: phone.trim(),
      address: {
        state: state.trim().toUpperCase(),
        city: city.trim(),
        street: street.trim(),
        pincode: pincode.trim(),
      },
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
      status: "ACTIVE",
    });

    return res.status(201).json({
      success: true,
      message: "Store registered successfully",
      consumerId: store.consumerId,
    });
  } catch (error) {
    if (uploadedImageId) {
      await cloudinary.uploader.destroy(uploadedImageId);
    }

    return res.status(400).json({
      success: false,
      message: error.message,
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
