import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";

export const createProduct = async (req, res) => {
  let frontPublicId = null;
  let backPublicId = null;

  try {
    const {
      name,
      title,
      description,
      category,
      sku,
      uom,
      price,
      discountPrice,
      gstPercentage,
      stock,
      minOrderQty,
      certificates,
      // ✅ NEW: Tiered pricing fields (all optional)
      retailerPrice,
      wholesalerPrice,
      distributorPrice,
    } = req.body;

    if (!req.files?.frontImage || !req.files?.backImage) {
      throw new Error("Both front and back images are required");
    }

    frontPublicId = req.files.frontImage[0].filename;
    backPublicId = req.files.backImage[0].filename;

    const exists = await Product.findOne({ sku });
    if (exists) {
      throw new Error("Product with this SKU already exists");
    }

    const product = await Product.create({
      name,
      title,
      description,
      category,
      sku,
      uom,
      price,
      discountPrice,
      gstPercentage,
      stock,
      minOrderQty,
      certificates: certificates ? certificates.split(",") : [],

      // ✅ NEW: Save tiered prices — stored as null if not provided (safe)
      // Parse to Number because req.body from multipart/form-data is string
      retailerPrice: retailerPrice !== undefined ? Number(retailerPrice) : null,
      wholesalerPrice:
        wholesalerPrice !== undefined ? Number(wholesalerPrice) : null,
      distributorPrice:
        distributorPrice !== undefined ? Number(distributorPrice) : null,

      images: {
        front: {
          url: req.files.frontImage[0].path,
          publicId: req.files.frontImage[0].filename,
        },
        back: {
          url: req.files.backImage[0].path,
          publicId: req.files.backImage[0].filename,
        },
      },
      createdBy: req.user.role,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      productId: product._id,
    });
  } catch (error) {
    // 🔥 CLEANUP CLOUDINARY FILES
    if (frontPublicId) {
      await cloudinary.uploader.destroy(frontPublicId);
    }
    if (backPublicId) {
      await cloudinary.uploader.destroy(backPublicId);
    }

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Products For Admin and Allowed Employees
export const getAllProductsInternal = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};

// Admin and AllowedEmployee — get single product by ID
export const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.json({
      success: true,
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch product",
    });
  }
};

export const updateProduct = async (req, res) => {
  let newFrontId = null;
  let newBackId = null;

  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }

    // FRONT IMAGE UPDATE
    if (req.files?.frontImage) {
      await cloudinary.uploader.destroy(product.images.front.publicId);
      product.images.front = {
        url: req.files.frontImage[0].path,
        publicId: req.files.frontImage[0].filename,
      };
    }

    // BACK IMAGE UPDATE
    if (req.files?.backImage) {
      await cloudinary.uploader.destroy(product.images.back.publicId);
      product.images.back = {
        url: req.files.backImage[0].path,
        publicId: req.files.backImage[0].filename,
      };
    }

    // Update all scalar fields dynamically
    // ✅ Tiered pricing fields (retailerPrice, wholesalerPrice, distributorPrice)
    //    are handled naturally here since they're in req.body
    //    We just make sure to parse them as Numbers since multipart sends strings
    const numericFields = [
      "price",
      "discountPrice",
      "retailerPrice",
      "wholesalerPrice",
      "distributorPrice",
      "gstPercentage",
      "stock",
      "minOrderQty",
    ];

    Object.keys(req.body).forEach((key) => {
      if (key === "certificates") return; // handled separately below

      if (numericFields.includes(key)) {
        // ✅ Safely parse numeric fields — avoids string storage from multipart
        product[key] = req.body[key] !== "" ? Number(req.body[key]) : null;
      } else {
        product[key] = req.body[key];
      }
    });

    if (req.body.certificates) {
      product.certificates = req.body.certificates.split(",");
    }

    await product.save();

    return res.json({
      success: true,
      message: "Product updated successfully",
    });
  } catch (error) {
    // Cleanup newly uploaded images on error
    if (newFrontId) await cloudinary.uploader.destroy(newFrontId);
    if (newBackId) await cloudinary.uploader.destroy(newBackId);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await cloudinary.uploader.destroy(product.images.front.publicId);
    await cloudinary.uploader.destroy(product.images.back.publicId);
    await product.deleteOne();

    return res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
  }
};

// ✅ All public products for agents/users
// Now includes tiered pricing fields so agent can display correct price per store type
export const getAllPublicProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: "ACTIVE" })
      .select(
        // ✅ NEW: Added retailerPrice, wholesalerPrice, distributorPrice
        "name title description category uom price discountPrice retailerPrice wholesalerPrice distributorPrice images gstPercentage minOrderQty",
      )
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};

// ✅ Single public product — also includes tiered pricing
export const getSinglePublicProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findOne({
      _id: productId,
      status: "ACTIVE",
    }).select(
      // ✅ NEW: Added retailerPrice, wholesalerPrice, distributorPrice
      "name title description category uom price discountPrice retailerPrice wholesalerPrice distributorPrice images gstPercentage minOrderQty",
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.json({
      success: true,
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch product",
    });
  }
};
