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

// Admin and AllowedEmployee
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
      // delete old image
      await cloudinary.uploader.destroy(product.images.front.publicId);

      // save new image
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

    // Update fields dynamically
    Object.keys(req.body).forEach((key) => {
      if (key !== "certificates") {
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

    // Delete images from Cloudinary
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

// All product for User
export const getAllPublicProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: "ACTIVE" })
      .select(
        "name title description category uom price discountPrice images gstPercentage",
      )
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};

export const getSinglePublicProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findOne({
      _id: productId,
      status: "ACTIVE",
    }).select(
      "name title description category uom price discountPrice images gstPercentage",
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
