import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "bengol_spices",
    allowed_formats: ["jpg", "jpeg", "png", "pdf"],
    public_id: (req, file) => {
      return Date.now() + "-" + file.originalname.split(".")[0];
    },
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
