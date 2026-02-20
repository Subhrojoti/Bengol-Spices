import DeliveryPartner from "../models/DeliveryPartner.js";
import Order from "../models/Order.js";
import Store from "../models/store.js";
import { createShiprocketOrder } from "../services/shiprocket.service.js";

// PLACE ORDER (AGENT)
export const placeOrder = async (req, res) => {
  try {
    const {
      consumerId,
      products,
      uom,
      paidAmount,
      paymentMode,
      latitude,
      longitude,
    } = req.body;

    const agentId = req.user.agentId;

    /* =============================
       BASIC VALIDATION
       ============================= */

    if (
      !consumerId ||
      !Array.isArray(products) ||
      products.length === 0 ||
      !paidAmount ||
      !paymentMode ||
      latitude === undefined ||
      longitude === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    if (!agentId) {
      return res.status(401).json({
        success: false,
        message: "Agent identity missing",
      });
    }

    /* =============================
       STORE VALIDATION
       ============================= */

    const store = await Store.findOne({
      consumerId,
      registeredBy: agentId, // 🔥 ownership check
    });

    if (!store) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to place order for this store or the store doesnot exist",
      });
    }

    /* =============================
       PRODUCT & AMOUNT CALCULATION
       ============================= */

    let totalAmount = 0;

    products.forEach((item) => {
      if (
        !item.name ||
        !item.uom ||
        !item.quantity ||
        !item.unitPrice ||
        item.quantity <= 0 ||
        item.unitPrice < 0
      ) {
        throw new Error("Invalid product details");
      }

      item.totalPrice = item.quantity * item.unitPrice;
      totalAmount += item.totalPrice;
    });

    if (paidAmount <= 0 || paidAmount > totalAmount) {
      return res.status(400).json({
        success: false,
        message: "Invalid paid amount",
      });
    }

    const dueAmount = totalAmount - paidAmount;

    /* =============================
       ORDER ID & DUE DATE
       ============================= */

    const currentYear = new Date().getFullYear();

    const orderCount = await Order.countDocuments({
      orderId: { $regex: `^ORD${currentYear}` },
    });

    const serial = String(orderCount + 1).padStart(4, "0");
    const orderId = `ORD${currentYear}-${serial}`;

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    /* =============================
       CREATE ORDER
       ============================= */

    const order = await Order.create({
      orderId,
      consumerId,
      agentId,
      products,
      uom,
      totalAmount,
      paidAmount,
      dueAmount,
      paymentMode,
      dueDate,
      orderLocation: {
        latitude,
        longitude,
      },
      status: "PLACED",
    });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      orderId: order.orderId,
    });
  } catch (error) {
    console.error("PLACE ORDER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

//GET STOREWISE ORDERS
export const getOrdersByStoreConsumerId = async (req, res) => {
  try {
    const { consumerId } = req.params;
    const user = req.user;

    if (!consumerId) {
      return res.status(400).json({
        success: false,
        message: "Consumer ID is required",
      });
    }

    // 🔐 AGENT ACCESS CONTROL
    // Agent can only see orders of stores created by himself
    if (user.role === "AGENT") {
      const orders = await Order.find({
        consumerId,
        agentId: user.agentId, // IMPORTANT
      }).sort({ createdAt: -1 });

      return res.json({
        success: true,
        totalOrders: orders.length,
        orders,
      });
    }

    // 🔐 ADMIN & EMPLOYEE ACCESS
    if (user.role === "ADMIN" || user.role === "EMPLOYEE") {
      const orders = await Order.find({ consumerId }).sort({
        createdAt: -1,
      });

      return res.json({
        success: true,
        totalOrders: orders.length,
        orders,
      });
    }

    return res.status(403).json({
      success: false,
      message: "Access denied",
    });
  } catch (error) {
    console.error("STORE WISE ORDER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch store orders",
    });
  }
};

// GET ORDERS PLACED BY LOGGED-IN AGENT
export const getMyOrders = async (req, res) => {
  try {
    const agentId = req.user.agentId;

    if (!agentId) {
      return res.status(401).json({
        success: false,
        message: "Agent identity missing in token",
      });
    }

    const orders = await Order.find({ agentId }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("GET MY ORDERS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

// GET ALL ORDERS (ADMIN / EMPLOYEE)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("GET ALL ORDERS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

// Confirm order (ADMIN)
export const confirmOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.status !== "PLACED") {
      return res.status(400).json({
        success: false,
        message: "Only PLACED orders can be confirmed",
      });
    }

    order.status = "CONFIRMED";
    await order.save();

    res.json({
      success: true,
      message: "Order confirmed successfully",
    });
  } catch (error) {
    console.error("CONFIRM ORDER ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to confirm order",
    });
  }
};

//Assign delivery partner (ADMIN / EMPLOYEE)
export const assignDeliveryPartner = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { partnerId } = req.body; // this will be MongoDB _id

    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.status !== "CONFIRMED" && order.status !== "ASSIGNED") {
      return res.status(400).json({
        success: false,
        message: "Order cannot be assigned at this stage",
      });
    }

    const partner = await DeliveryPartner.findById(partnerId);

    if (!partner || partner.status !== "ACTIVE") {
      return res.status(404).json({
        success: false,
        message: "Delivery partner not found or inactive",
      });
    }

    order.delivery = {
      partnerId: partner._id,
      assignedBy: req.user.employeeId,
      assignedAt: new Date(),
    };

    order.status = "ASSIGNED";

    await order.save();

    res.json({
      success: true,
      message: "Delivery partner assigned successfully",
    });
  } catch (error) {
    console.error("ASSIGN DELIVERY ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to assign delivery partner",
    });
  }
};
// Update Delivery Status (DELIVERY PARTNER)
export const updateDeliveryStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Must be assigned to this delivery partner
    if (
      !order.delivery.partnerId ||
      order.delivery.partnerId.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized for this order",
      });
    }

    // Strict sequence control
    const allowedTransitions = {
      ASSIGNED: "SHIPPED",
      SHIPPED: "OUT_FOR_DELIVERY",
      OUT_FOR_DELIVERY: "DELIVERED",
    };

    if (allowedTransitions[order.status] !== status) {
      return res.status(400).json({
        success: false,
        message: "Invalid status transition",
      });
    }

    // Cannot directly mark DELIVERED (OTP required)
    if (status === "DELIVERED") {
      return res.status(400).json({
        success: false,
        message: "Use OTP verification to complete delivery",
      });
    }

    order.status = status;
    await order.save();

    res.json({
      success: true,
      message: "Status updated successfully",
    });
  } catch (error) {
    console.error("UPDATE DELIVERY STATUS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update status",
    });
  }
};
// OTP Generation for Delivery Confirmation
export const generateDeliveryOtp = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ orderId });

    if (!order || order.status !== "OUT_FOR_DELIVERY") {
      return res.status(400).json({
        success: false,
        message: "Order not ready for delivery",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    order.deliveryOtp = {
      code: otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      verified: false,
    };

    await order.save();

    console.log("Delivery OTP:", otp);

    res.json({
      success: true,
      message: "OTP generated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to generate OTP",
    });
  }
};

// OTP Verification for Delivery Completion
export const verifyDeliveryOtp = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { otp } = req.body;

    const order = await Order.findOne({ orderId });

    if (!order || !order.deliveryOtp) {
      return res.status(400).json({
        success: false,
        message: "OTP not generated",
      });
    }

    if (order.deliveryOtp.code !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (order.deliveryOtp.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    order.status = "DELIVERED";
    order.deliveryOtp.verified = true;

    await order.save();

    res.json({
      success: true,
      message: "Order delivered successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to verify OTP",
    });
  }
};
// Complete Payment (DELIVERY PARTNER)
export const completePayment = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.paymentStatus = "COMPLETED";
    await order.save();

    res.json({
      success: true,
      message: "Payment marked as completed",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update payment",
    });
  }
};
// CREATE SHIPMENT (DUMMY VERSION)
export const createShipment = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.shipment && order.shipment.status) {
      return res.status(400).json({
        success: false,
        message: "Shipment already created",
      });
    }

    // 🔥 Call service (dummy for now)
    const shipmentData = await createShiprocketOrder(order);

    order.shipment = {
      ...shipmentData,
      createdAt: new Date(),
    };

    order.status = "SHIPPED";
    await order.save();

    return res.json({
      success: true,
      message: "Shipment created successfully",
    });
  } catch (error) {
    console.error("CREATE SHIPMENT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create shipment",
    });
  }
};
