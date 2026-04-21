import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import DeliveryPartner from "../models/DeliveryPartner.js";
import cloudinary from "../config/cloudinary.js";
import Order from "../models/Order.js";
import Return from "../models/Return.js";

/* REGISTER */
export const registerDeliveryPartner = async (req, res) => {
  let uploadedPublicId = null;

  try {
    const {
      name,
      phone,
      email,
      password,
      idType,
      idNumber,
      state,
      city,
      street,
      pincode,
      accountHolderName,
      accountNumber,
      ifscCode,
      bankName,
    } = req.body;

    if (!req.file) throw new Error("Document is required");
    uploadedPublicId = req.file.filename;

    if (
      !name ||
      !phone ||
      !password ||
      !idType ||
      !idNumber ||
      !state ||
      !city ||
      !street ||
      !pincode
    ) {
      throw new Error("All fields are required");
    }

    const exists = await DeliveryPartner.findOne({ phone });
    if (exists) throw new Error("Already registered");

    const hashedPassword = await bcrypt.hash(password, 10);

    const partnerData = {
      name,
      phone,
      email,
      password: hashedPassword,
      status: "PENDING", // 🔥 IMPORTANT
      address: { state, city, street, pincode },
      documents: {
        idType,
        idNumber,
        documentUrl: req.file.path,
      },
    };

    if (accountHolderName && accountNumber && ifscCode && bankName) {
      partnerData.bankDetails = {
        accountHolderName,
        accountNumber,
        ifscCode,
        bankName,
      };
    }

    await DeliveryPartner.create(partnerData);

    res.status(201).json({
      success: true,
      message: "Application submitted. Await admin approval.",
    });
  } catch (error) {
    if (uploadedPublicId) {
      await cloudinary.uploader.destroy(uploadedPublicId);
    }

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// DELIVERY PARTNER LOGIN (STRICT STATUS VALIDATION)
export const loginDeliveryPartner = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const partner = await DeliveryPartner.findOne({ phone });

    // ❌ Not found
    if (!partner) {
      return res.status(404).json({
        success: false,
        message: "Phone No. or Password does not match",
      });
    }

    // 🔒 STRICT STATUS CHECK (MOST IMPORTANT FIX)
    if (partner.status !== "ACTIVE") {
      let message = "Your account is not active";

      if (partner.status === "PENDING") {
        message =
          "Your account is under review. Please wait for admin approval.";
      } else if (partner.status === "REJECTED") {
        message =
          "Your application has been rejected. Please contact support or reapply.";
      } else if (partner.status === "INACTIVE") {
        message = "Your account is inactive. Contact support.";
      } else {
        // ❗ Handles corrupted values like "SA"
        message = "Invalid account status. Please contact support.";
      }

      return res.status(403).json({
        success: false,
        message,
      });
    }

    // 🔐 PASSWORD CHECK
    const isMatch = await bcrypt.compare(password, partner.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Phone No. or Password does not match",
      });
    }

    // ✅ UPDATE ONLINE STATUS
    await DeliveryPartner.updateOne(
      { _id: partner._id },
      { $set: { isOnline: true } },
    );

    // 🔑 TOKEN
    const token = jwt.sign(
      {
        id: partner._id,
        role: partner.role,
        name: partner.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" },
    );

    return res.json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("LOGIN DELIVERY PARTNER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to login",
    });
  }
};
/* LOGOUT */
export const logoutDeliveryPartner = async (req, res) => {
  const partner = await DeliveryPartner.findById(req.user.id);
  if (partner) {
    partner.isOnline = false;
    await partner.save();
  }

  res.json({ success: true });
};

/* GET ALL ACTIVE DELIVERY PARTNERS (ADMIN) */
export const getAllDeliveryPartners = async (req, res) => {
  try {
    const partners = await DeliveryPartner.find()
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: partners.length,
      data: partners,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch delivery partners",
    });
  }
};

/* Get My assigned orders (DELIVERY PARTNER) */
export const getMyAssignedOrders = async (req, res) => {
  try {
    const partnerId = req.user.id;

    const orders = await Order.find({
      "delivery.partnerId": partnerId,
      status: {
        $in: ["ASSIGNED", "SHIPPED", "OUT_FOR_DELIVERY"],
      },
    })
      .populate("store", "storeName deliveryCode address location") // 🔥 MAGIC LINE
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch assigned orders",
    });
  }
};

/* Get Delivery partner Dashboard Stats */
export const getDeliveryPartnerDashboard = async (req, res) => {
  try {
    const partnerId = req.user.id;
    const currentYear = new Date().getFullYear();

    /* ============================
       SUMMARY COUNTS
    ============================ */

    const totalDelivered = await Order.countDocuments({
      "delivery.partnerId": partnerId,
      status: "DELIVERED",
    });

    const totalReturnsHandled = await Return.countDocuments({
      "pickup.partnerId": partnerId,
      status: "COMPLETED",
    });

    const totalPendingPickups = await Return.countDocuments({
      "pickup.partnerId": partnerId,
      status: {
        $in: ["PICKUP_ASSIGNED", "PICKED_UP", "RECEIVED_AT_WAREHOUSE"],
      },
    });

    /* ============================
       MONTHLY DELIVERY DISTRIBUTION
       (Current Year)
    ============================ */

    const monthlyDelivered = await Order.aggregate([
      {
        $match: {
          "delivery.partnerId": partnerId,
          status: "DELIVERED",
          updatedAt: {
            $gte: new Date(`${currentYear}-01-01`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$updatedAt" },
          delivered: { $sum: 1 },
        },
      },
    ]);

    const monthlyReturns = await Return.aggregate([
      {
        $match: {
          "pickup.partnerId": partnerId,
          status: "COMPLETED",
          updatedAt: {
            $gte: new Date(`${currentYear}-01-01`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$updatedAt" },
          returns: { $sum: 1 },
        },
      },
    ]);

    // Format months 1–12
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const monthlyDistribution = months.map((month, index) => {
      const deliveredData = monthlyDelivered.find((d) => d._id === index + 1);

      const returnData = monthlyReturns.find((r) => r._id === index + 1);

      return {
        month,
        delivered: deliveredData ? deliveredData.delivered : 0,
        returns: returnData ? returnData.returns : 0,
      };
    });

    /* ============================
       YEARLY COMPARISON (LAST 3 YEARS)
    ============================ */

    const yearlyComparison = [];

    for (let i = 0; i < 3; i++) {
      const year = currentYear - i;

      const start = new Date(`${year}-01-01`);
      const end = new Date(`${year}-12-31`);

      const deliveredCount = await Order.countDocuments({
        "delivery.partnerId": partnerId,
        status: "DELIVERED",
        updatedAt: { $gte: start, $lte: end },
      });

      yearlyComparison.push({
        year,
        delivered: deliveredCount,
      });
    }

    return res.json({
      success: true,
      data: {
        summary: {
          totalDelivered,
          totalReturnsHandled,
          totalPendingPickups,
        },
        monthlyDeliveryDistribution: monthlyDistribution,
        yearlyComparison,
        meta: {
          generatedAt: new Date(),
        },
      },
    });
  } catch (error) {
    console.error("DELIVERY DASHBOARD ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard",
    });
  }
};

/* Get Partner Profile */
export const getProfile = async (req, res) => {
  try {
    const partnerId = req.user.id;

    const partner =
      await DeliveryPartner.findById(partnerId).select("-password");

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: "Delivery partner not found",
      });
    }

    // Convert to plain object
    const data = partner.toObject();

    // 👉 If bankDetails doesn't exist, remove it OR set null
    if (!data.bankDetails || Object.keys(data.bankDetails).length === 0) {
      data.bankDetails = null; // OR delete data.bankDetails;
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
