import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import DeliveryPartner from "../models/DeliveryPartner.js";
import cloudinary from "../config/cloudinary.js";

/* REGISTER */
export const registerDeliveryPartner = async (req, res) => {
  let uploadedPublicId = null;

  try {
    const { name, phone, password, idType, idNumber } = req.body;

    if (req.file) {
      uploadedPublicId = req.file.filename; // Cloudinary public_id
    }

    if (!name || !phone || !password || !idType || !idNumber) {
      throw new Error("All fields are required");
    }

    if (!req.file) {
      throw new Error("Document is required");
    }

    const exists = await DeliveryPartner.findOne({ phone });
    if (exists) {
      throw new Error("Delivery partner already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await DeliveryPartner.create({
      name,
      phone,
      password: hashedPassword,
      documents: {
        idType,
        idNumber,
        documentUrl: req.file.path,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Delivery partner registered",
    });
  } catch (error) {
    // 🔥 CLEANUP CLOUDINARY FILE
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
