import Store from "../models/store.js";

// REGISTER NEW STORE (AGENT)
export const registerStore = async (req, res) => {
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

    // 🔒 Validation (location MUST come from frontend)
    if (
      !storeName ||
      !ownerName ||
      !phone ||
      !address ||
      latitude === undefined ||
      longitude === undefined ||
      !storeType
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields including location are required",
      });
    }

    // 🚫 Prevent duplicate store
    const existingStore = await Store.findOne({ phone });
    if (existingStore) {
      return res.status(400).json({
        success: false,
        message: "Store already registered with this phone number",
      });
    }

    /* =============================
       CONSUMER ID GENERATION
       ============================= */
    const currentYear = new Date().getFullYear();

    const storeCount = await Store.countDocuments({
      consumerId: { $regex: `^CS${currentYear}` },
    });

    const serial = String(storeCount + 1).padStart(4, "0");
    const consumerId = `CS${currentYear}-${serial}`;

    /* =============================
       CREATE STORE
       ============================= */
    const store = await Store.create({
      consumerId,
      storeName,
      ownerName,
      phone,
      address,
      location: {
        latitude: Number(latitude),
        longitude: Number(longitude),
      },
      storeType,
      registeredBy: req.user.agentId, // comes from JWT
      status: "ACTIVE",
    });

    return res.status(201).json({
      success: true,
      message: "Store registered successfully",
      consumerId: store.consumerId,
    });
  } catch (error) {
    console.error("REGISTER STORE ERROR:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Consumer ID conflict, please retry",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
