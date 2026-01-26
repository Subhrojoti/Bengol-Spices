import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllPublicProducts,
  getProductById,
  getSinglePublicProduct,
  updateProduct,
} from "../controllers/product.controller.js";
import { protect } from "../middleware/auth.js";
import { isAdminOrAllowedEmployee } from "../middleware/role.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.post(
  "/create",
  protect,
  isAdminOrAllowedEmployee,
  upload.fields([
    { name: "frontImage", maxCount: 1 },
    { name: "backImage", maxCount: 1 },
  ]),
  createProduct,
);

router.get(
  "/single/:productId",
  protect,
  isAdminOrAllowedEmployee,
  getProductById,
);
router.put(
  "/update/:productId",
  protect,
  isAdminOrAllowedEmployee,
  upload.fields([
    { name: "frontImage", maxCount: 1 },
    { name: "backImage", maxCount: 1 },
  ]),
  updateProduct,
);

router.delete(
  "/delete/:productId",
  protect,
  isAdminOrAllowedEmployee,
  deleteProduct,
);

//Public Route
router.get("/public/allProduct", getAllPublicProducts);
router.get("/public/:productId", getSinglePublicProduct);

export default router;
