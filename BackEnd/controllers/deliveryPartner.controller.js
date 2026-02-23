import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import DeliveryPartner from "../models/DeliveryPartner.js";
import cloudinary from "../config/cloudinary.js";

/* REGISTER */
export const registerDeliveryPartner = async (req, res) => {
  let uploadedPublicId = null;

  try {
    const {
      name,
      phone,
      password,
      idType,
      idNumber,
      state,
      city,
      street,
      pincode,
    } = req.body;

    if (req.file) {
      uploadedPublicId = req.file.filename; // Cloudinary public_id
    }

    // 🔥 Basic Validation
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
      throw new Error("All fields including complete address are required");
    }

    if (!req.file) {
      throw new Error("Document is required");
    }

    // 🔥 Pincode Validation
    if (!/^[0-9]{6}$/.test(pincode)) {
      throw new Error("Invalid pincode format");
    }

    const exists = await DeliveryPartner.findOne({ phone });
    if (exists) {
      throw new Error("Delivery partner already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await DeliveryPartner.create({
      name: name.trim(),
      phone: phone.trim(),
      password: hashedPassword,
      address: {
        state: state.trim().toUpperCase(),
        city: city.trim(),
        street: street.trim(),
        pincode: pincode.trim(),
      },
      documents: {
        idType,
        idNumber,
        documentUrl: req.file.path,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Delivery partner registered successfully",
    });
  } catch (error) {
    // 🔥 CLOUDINARY CLEANUP ON FAILURE
    if (uploadedPublicId) {
      await cloudinary.uploader.destroy(uploadedPublicId);
    }

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* LOGIN */
export const loginDeliveryPartner = async (req, res) => {
  const { phone, password } = req.body;

  const partner = await DeliveryPartner.findOne({ phone, status: "ACTIVE" });
  if (!partner) {
    return res
      .status(404)
      .json({ success: false, message: "Phone No. or Password doesnot match" });
  }

  const isMatch = await bcrypt.compare(password, partner.password);
  if (!isMatch) {
    return res
      .status(401)
      .json({ success: false, message: "Phone No. or Password doesnot match" });
  }

  partner.isOnline = true;
  await partner.save();

  const token = jwt.sign(
    { id: partner._id, role: partner.role },
    process.env.JWT_SECRET,
    { expiresIn: "30d" },
  );

  res.json({ success: true, token });
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
