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
