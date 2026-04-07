import crypto from "crypto";
import Counter from "../models/Counter.js";
import DeliveryPartner from "../models/DeliveryPartner.js";
import Employee from "../models/Employee.js";
import Admin from "../models/Admin.js";
import Order from "../models/Order.js";
import Store from "../models/store.js";
import Product from "../models/Product.js";
import Target from "../models/Target.js";
import Invoice from "../models/Invoice.js";
import AgentTargetProgress from "../models/AgentTargetProgress.js";
import {
  createInvoiceFromOrder,
  regenerateInvoicePDF,
  updateInvoiceAfterPayment,
} from "../services/invoice.service.js";
import { uploadPdfToCloudinary } from "../utils/uploadPdf.js";
import { createShiprocketOrder } from "../services/shiprocket.service.js";
import Payment from "../models/Payment.js";
import { createNotification } from "../services/notification.service.js";
import { razorpayInstance } from "../config/razorpay.js";
import Agent from "../models/Agent.js";

// PLACE ORDER (AGENT)
export const placeOrder = async (req, res) => {
  try {
    const {
      consumerId,
      products,
      paidAmount,
      paymentMode,
      latitude,
      longitude,
    } = req.body;

    const agentId = req.user?.agentId;

    /* =============================
       BASIC VALIDATION
       ============================= */

    if (
      !consumerId ||
      !Array.isArray(products) ||
      products.length === 0 ||
      paidAmount === undefined ||
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
       STORE VALIDATION + OWNERSHIP
       ============================= */

    const store = await Store.findOne({
      consumerId,
      registeredBy: agentId,
    });

    if (!store) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to place order for this store or the store does not exist",
      });
    }

    /* =============================
       PRODUCT VALIDATION & AMOUNT
       ============================= */

    let totalAmount = 0;

    for (const item of products) {
      // ✅ BASIC VALIDATION (NO productId required)
      if (
        !item.name ||
        !item.uom ||
        !item.quantity ||
        !item.unitPrice ||
        item.quantity <= 0 ||
        item.unitPrice < 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid product details",
        });
      }

      /* =============================
         AUTO FETCH PRODUCT (SAFE)
         ============================= */

      let productDoc = null;

      if (item.productId) {
        productDoc = await Product.findById(item.productId);
      } else {
        productDoc = await Product.findOne({
          name: item.name,
          status: "ACTIVE",
        });
      }

      /* =============================
         ENRICH DATA (NO BREAK)
         ============================= */

      if (productDoc) {
        item.productId = productDoc._id;
        item.name = productDoc.name;
        item.image = productDoc.images?.front?.url;

        // ✅ ADD THIS LINE (VERY IMPORTANT)
        item.gstPercentage = productDoc.gstPercentage || 0;
      }

      /* =============================
         CALCULATE TOTAL
         ============================= */

      item.totalPrice = item.quantity * item.unitPrice;
      totalAmount += item.totalPrice;
    }

    if (paidAmount < 0 || paidAmount > totalAmount) {
      return res.status(400).json({
        success: false,
        message: "Invalid paid amount",
      });
    }

    const dueAmount = totalAmount - paidAmount;

    /* =============================
       SAFE ORDER ID GENERATION
       ============================= */

    const currentYear = new Date().getFullYear();

    const counter = await Counter.findByIdAndUpdate(
      `order_${currentYear}`,
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );

    const serial = String(counter.seq).padStart(4, "0");
    const orderId = `ORD${currentYear}-${serial}`;

    /* =============================
       DUE DATE (7 DAYS)
       ============================= */

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
      totalAmount,
      paidAmount,
      dueAmount,
      paymentMode,
      dueDate,
      orderLocation: {
        latitude,
        longitude,
      },
      deliveryAddress: {
        storeName: store.storeName,
        ownerName: store.ownerName,
        phone: store.phone,
        state: store.address.state,
        city: store.address.city,
        street: store.address.street,
        pincode: store.address.pincode,
      },
      status: "PLACED",
      statusHistory: [
        {
          status: "PLACED",
          changedBy: {
            id: agentId,
            role: "AGENT",
          },
        },
      ],
      paymentStatus: dueAmount === 0 ? "COMPLETED" : "PENDING",
    });

    // ✅ FIX: Create payment entry for CASH / initial payment
    if (paidAmount > 0) {
      await Payment.create({
        orderId: order.orderId,
        consumerId: order.consumerId,
        agentId: order.agentId,
        amount: paidAmount,
        method: paymentMode === "ONLINE" ? "RAZORPAY" : "CASH",
        collectedBy: {
          id: agentId,
          role: "AGENT",
        },
      });
    }

    /* ============================= 
        Auto Invoice Generation 
       ============================= */

    await createInvoiceFromOrder(order);
    /* =============================
       TARGET + COMMISSION + NOTIFICATION
       ============================= */

    const today = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });

    const activeTargets = await Target.find({
      type: "ORDER_PLACEMENT",
      isActive: true,
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() },
    });

    for (const target of activeTargets) {
      let progress = await AgentTargetProgress.findOne({
        agentId,
        date: today,
        type: "ORDER_PLACEMENT",
        targetId: target._id,
      });

      if (!progress) {
        progress = await AgentTargetProgress.create({
          agentId,
          date: today,
          type: "ORDER_PLACEMENT",
          targetId: target._id,
          count: 0,
          incentiveEarned: 0,
          productBreakdown: [],
          milestonesNotified: [],
        });
      }

      let earned = 0;
      let totalQty = 0;

      for (const item of products) {
        const qty = item.quantity;
        totalQty += qty;

        const rule = target.productRules?.find(
          (r) =>
            r.productId?.toString() === item.productId?.toString() ||
            r.productName === item.name,
        );

        if (!rule) continue;

        if (rule.perPacketCommission) {
          earned += qty * rule.perPacketCommission;
        }

        if (
          rule.bulkTarget &&
          rule.bulkIncentive &&
          !progress.bulkAchieved &&
          progress.count + totalQty >= rule.bulkTarget
        ) {
          earned += rule.bulkIncentive;
          progress.bulkAchieved = true;
        }

        const existing = progress.productBreakdown.find(
          (p) => p.productId?.toString() === item.productId?.toString(),
        );

        if (existing) {
          existing.quantity += qty;
        } else {
          progress.productBreakdown.push({
            productId: item.productId,
            quantity: qty,
          });
        }
      }

      if (
        target.globalTarget?.totalPackets &&
        !progress.targetAchieved &&
        progress.count + totalQty >= target.globalTarget.totalPackets
      ) {
        earned += target.globalTarget.incentive;
        progress.targetAchieved = true;

        await createNotification({
          title: "Target Achieved 🎉",
          message: `You completed today's target and earned ₹${progress.incentiveEarned + earned}`,
          recipientId: agentId,
          recipientModel: "Agent",
        });
      }

      progress.count += totalQty;
      progress.incentiveEarned += earned;

      if (earned > 0) {
        await createNotification({
          title: "Earning Update",
          message: `💰 You earned ₹${earned} from this order`,
          recipientId: agentId,
          recipientModel: "Agent",
        });
      }

      if (target.globalTarget?.totalPackets) {
        const percentage = Math.floor(
          (progress.count / target.globalTarget.totalPackets) * 100,
        );

        const milestones = [50, 80];

        for (const milestone of milestones) {
          if (
            percentage >= milestone &&
            !progress.milestonesNotified.includes(milestone)
          ) {
            await createNotification({
              title: "Target Progress",
              message: `🔥 You reached ${milestone}% of your target`,
              recipientId: agentId,
              recipientModel: "Agent",
            });

            progress.milestonesNotified.push(milestone);
          }
        }
      }

      await progress.save();
    }

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

//GET ALL ACTIVE ORDERS (For admin/employee)
export const getActiveOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      status: {
        $in: ["PLACED", "CONFIRMED", "ASSIGNED", "SHIPPED", "OUT_FOR_DELIVERY"],
      },
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("GET ACTIVE ORDERS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch active orders",
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

    order.statusHistory.push({
      status: "CONFIRMED",
      changedBy: {
        id: req.user.employeeId || req.user.id,
        role: req.user.role, // VERY IMPORTANT
      },
    });
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
// Cancel Order (ADMIN / EMPLOYEE)
export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;

    if (!reason || reason.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Cancellation reason is required",
      });
    }

    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.status === "DELIVERED") {
      return res.status(400).json({
        success: false,
        message: "Delivered order cannot be cancelled",
      });
    }

    if (order.status === "CANCELLED") {
      return res.status(400).json({
        success: false,
        message: "Order is already cancelled",
      });
    }

    // 🔥 Determine who cancelled
    let cancelledById;
    let cancelledByName;
    let cancelledByRole = req.user.role;

    if (req.user.role === "EMPLOYEE") {
      const employee = await Employee.findOne({
        employeeId: req.user.employeeId,
      });

      cancelledById = req.user.employeeId;
      cancelledByName = employee?.name || "Unknown Employee";
    } else if (req.user.role === "ADMIN") {
      const admin = await Admin.findById(req.user.id);

      cancelledById = req.user.id;
      cancelledByName = admin?.name || "Admin";
    }

    // 🔥 Update status
    order.status = "CANCELLED";

    order.cancellation = {
      reason: reason.trim(),
      cancelledAt: new Date(),
      cancelledBy: {
        id: cancelledById,
        name: cancelledByName,
        role: cancelledByRole,
      },
    };

    order.statusHistory.push({
      status: "CANCELLED",
      changedBy: {
        id: cancelledById,
        role: cancelledByRole,
      },
    });

    await order.save();

    return res.json({
      success: true,
      message: "Order cancelled successfully",
    });
  } catch (error) {
    console.error("CANCEL ORDER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to cancel order",
    });
  }
};
//Assign delivery partner (ADMIN / EMPLOYEE)
export const assignDeliveryPartner = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { partnerId } = req.body; // MongoDB _id

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
    // Check if already assigned to this partner
    if (order.delivery?.partnerId?.toString() === partnerId) {
      return res.status(400).json({
        success: false,
        message: "This partner is already assigned",
      });
    }

    // ✅ Assign delivery
    order.delivery = {
      partnerId: partner._id,
      assignedBy: req.user._id || req.user.id, // 🔥 FIXED (generic)
      assignedAt: new Date(),
    };

    order.status = "ASSIGNED";

    order.statusHistory.push({
      status: "ASSIGNED",
      changedBy: {
        id: req.user._id || req.user.id,
        role: req.user.role,
      },
    });

    // ✅ FIXED notification
    await createNotification({
      title: "New Order Assigned",
      message: `You have a new order (${order.orderId}) assigned`,
      recipientId: partner._id, // 🔥 FIXED
      recipientModel: "DeliveryPartner",
      meta: {
        orderId: order.orderId,
      },
    });

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

    order.statusHistory.push({
      status,
      changedBy: {
        id: req.user.id,
        role: req.user.role,
      },
    });

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

    order.statusHistory.push({
      status: "DELIVERED",
      changedBy: {
        id: req.user.id,
        role: req.user.role,
      },
    });

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

// Collect Payment (Future code mode --- Razorpay / Stripe)
export const collectPayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { amount, method, note } = req.body;

    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.agentId !== req.user.agentId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to collect payment for this order",
      });
    }

    if (order.dueAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "No due amount remaining",
      });
    }

    if (amount > order.dueAmount) {
      return res.status(400).json({
        success: false,
        message: "Amount exceeds due amount",
      });
    }

    await Payment.create({
      orderId: order.orderId,
      consumerId: order.consumerId,
      agentId: order.agentId,
      amount,
      method,
      note,
      collectedBy: {
        id: req.user.agentId,
        role: "AGENT",
      },
    });

    order.paidAmount += amount;
    order.dueAmount -= amount;

    if (order.dueAmount === 0) {
      order.paymentStatus = "COMPLETED";
    }

    await order.save();
    // Update invoice after payment
    await updateInvoiceAfterPayment({
      orderId: order.orderId,
      amount,
      method: method || "CASH",
    });

    res.json({
      success: true,
      message: "Payment recorded successfully",
      paidAmount: order.paidAmount,
      dueAmount: order.dueAmount,
    });
  } catch (error) {
    console.error("COLLECT PAYMENT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to collect payment",
    });
  }
};

// Payment history for an order (ADMIN / EMPLOYEE )
export const getOrderPayments = async (req, res) => {
  try {
    const { orderId } = req.params;

    const payments = await Payment.find({ orderId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch payments",
    });
  }
};

// Agent Due Orders (Agent can see all their orders with due amount > 0)
export const getAgentDueOrders = async (req, res) => {
  try {
    const agentId = req.user.agentId;

    const orders = await Order.find({
      agentId,
      dueAmount: { $gt: 0 },
      status: { $ne: "CANCELLED" },
    }).sort({ dueDate: 1 });

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch due orders",
    });
  }
};

// OverDue Orders (Admin / Employee can see all orders with due amount > 0 and past due date)
export const getCompletePaymentSummary = async (req, res) => {
  try {
    // 🔍 Filters from query params
    const { agentId, consumerId, paymentStatus, method, fromDate, toDate } =
      req.query;

    /* =============================
       BUILD ORDER FILTER
       ============================= */
    const orderFilter = {};

    if (agentId) orderFilter.agentId = agentId;
    if (consumerId) orderFilter.consumerId = consumerId;
    if (paymentStatus) orderFilter.paymentStatus = paymentStatus;

    // ❌ Exclude cancelled orders
    orderFilter.status = { $ne: "CANCELLED" };

    // 📅 Date filter (order created date)
    if (fromDate || toDate) {
      orderFilter.createdAt = {};
      if (fromDate) orderFilter.createdAt.$gte = new Date(fromDate);
      if (toDate) orderFilter.createdAt.$lte = new Date(toDate);
    }

    /* =============================
       FETCH ORDERS
       ============================= */
    const orders = await Order.find(orderFilter).sort({ createdAt: -1 }).lean(); // 🚀 faster & safe

    const orderIds = orders.map((o) => o.orderId);

    // 🔥 Fetch Agent Details
    const agentIds = [...new Set(orders.map((o) => o.agentId))];

    const agents = await Agent.find({
      agentId: { $in: agentIds },
    }).lean();

    // Create lookup map
    const agentMap = {};
    agents.forEach((a) => {
      agentMap[a.agentId] = a;
    });

    /* =============================
       FETCH PAYMENTS
       ============================= */
    const paymentFilter = {
      orderId: { $in: orderIds },
    };

    if (method) paymentFilter.method = method;

    const payments = await Payment.find(paymentFilter).lean();

    /* =============================
       GROUP PAYMENTS BY ORDER
       ============================= */
    const paymentMap = {};

    payments.forEach((p) => {
      if (!paymentMap[p.orderId]) {
        paymentMap[p.orderId] = [];
      }
      paymentMap[p.orderId].push(p);
    });

    /* =============================
       BUILD FINAL RESPONSE
       ============================= */
    const summary = orders.map((order) => {
      const orderPayments = paymentMap[order.orderId] || [];

      const totalPaid = orderPayments.reduce((sum, p) => sum + p.amount, 0);

      const agent = agentMap[order.agentId];

      return {
        orderId: order.orderId,
        consumerId: order.consumerId,
        agentId: order.agentId,

        // 👇 NEW FIELD
        agent: {
          agentId: order.agentId,
          name: agent?.name || null,
          phone: agent?.phone || null,
        },

        totalAmount: order.totalAmount,
        paidAmount: totalPaid,
        dueAmount: order.totalAmount - totalPaid,

        paymentStatus: order.paymentStatus,
        orderStatus: order.status,

        dueDate: order.dueDate,
        createdAt: order.createdAt,

        store: order.deliveryAddress?.storeName,
        phone: order.deliveryAddress?.phone,
        city: order.deliveryAddress?.city,
        state: order.deliveryAddress?.state,

        payments: orderPayments.map((p) => ({
          amount: p.amount,
          method: p.method,
          collectedAt: p.createdAt,
          collectedBy: p.collectedBy?.id,
        })),
      };
    });

    /* =============================
       RESPONSE
       ============================= */
    res.json({
      success: true,
      count: summary.length,
      data: summary,
    });
  } catch (error) {
    console.error("Payment Summary Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch payment summary",
    });
  }
};

// Agent Collection Performance (Admin / Employee with permission can see total collected amount by each agent in a date range)
export const getAgentCollectionPerformance = async (req, res) => {
  try {
    const performance = await Payment.aggregate([
      {
        $group: {
          _id: "$agentId",
          totalCollected: { $sum: "$amount" },
          transactions: { $sum: 1 },
        },
      },
    ]);

    res.json({
      success: true,
      data: performance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load performance",
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

// Create Razorpay Order
export const createRazorpayOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.dueAmount <= 0) {
      return res.status(400).json({ message: "No due amount left" });
    }

    const razorpayOrder = await razorpayInstance.orders.create({
      amount: order.dueAmount * 100,
      currency: "INR",
      receipt: order.orderId,
    });

    res.json({
      success: true,
      razorpayOrderId: razorpayOrder.id, // ✅ used in frontend
      amount: razorpayOrder.amount, // ✅ used in frontend
      key: process.env.RAZORPAY_KEY_ID, // ✅ REQUIRED for checkout
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Razorpay order failed" });
  }
};

// Verify Razorpay Payment
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
      amount,
    } = req.body;

    // ✅ Ensure number
    const numericAmount = Number(amount);

    // 🔐 Verify Signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET) // ✅ FIXED
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // 🔍 Idempotency check
    const existing = await Payment.findOne({
      razorpayPaymentId: razorpay_payment_id,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Payment already processed",
      });
    }

    // 🔍 Fetch order
    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ✅ Correct unit comparison (paise vs rupees)
    if (numericAmount > order.dueAmount * 100) {
      return res.status(400).json({
        message: "Amount exceeds due",
      });
    }

    // ✅ Save payment
    await Payment.create({
      orderId: order.orderId,
      consumerId: order.consumerId,
      agentId: order.agentId,
      amount: numericAmount / 100, // store in rupees
      method: "RAZORPAY",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      collectedBy: {
        id: order.agentId,
        role: "AGENT",
      },
    });

    // ✅ Update order
    const paidAmountInRupees = numericAmount / 100;

    order.paidAmount += paidAmountInRupees;
    order.dueAmount -= paidAmountInRupees;

    if (order.dueAmount === 0) {
      order.paymentStatus = "COMPLETED";
    }

    await order.save();

    // ✅ UPDATE INVOICE AFTER PAYMENT
    const invoice = await Invoice.findOne({ orderId });

    if (invoice) {
      const paid = numericAmount / 100;

      invoice.paidAmount += paid;
      invoice.dueAmount -= paid;

      invoice.payments.push({
        amount: paid,
        method: "RAZORPAY",
        paymentId: razorpay_payment_id,
      });

      invoice.status = invoice.dueAmount === 0 ? "PAID" : "PARTIAL";

      await invoice.save();

      // 🔥 OPTIONAL: regenerate PDF
      await regenerateInvoicePDF(invoice);
    }

    res.json({
      success: true,
      message: "Payment successful",
    });
  } catch (error) {
    console.error("RAZORPAY VERIFY ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};

// Initial Payment Razorpayment during placing order
export const createOrderPayment = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount < 1) {
      return res.status(400).json({
        success: false,
        message: "Minimum amount should be ₹1",
      });
    }

    const razorpayOrder = await razorpayInstance.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `order_${Date.now()}`,
    });

    return res.json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("CREATE ORDER PAYMENT ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create Razorpay order",
    });
  }
};

// Verify initial payment for order placement
export const verifyPaymentAndPlaceOrder = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      orderPayload, // 👈 full order body (same as placeOrder)
    } = req.body;

    const numericAmount = Number(amount);

    /* =============================
       🔐 VERIFY SIGNATURE
       ============================= */

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    /* =============================
       🔁 DUPLICATE CHECK
       ============================= */

    const existing = await Payment.findOne({
      razorpayPaymentId: razorpay_payment_id,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Payment already processed",
      });
    }

    /* =============================
       🧠 USE YOUR EXISTING LOGIC
       ============================= */

    req.body = {
      ...orderPayload,
      paidAmount: numericAmount / 100, // ✅ override safely
      paymentMode:
        numericAmount / 100 === orderPayload.totalAmount ? "ONLINE" : "MIXED",
    };

    // ⚡ Call your existing controller
    const response = await new Promise((resolve) => {
      placeOrder(req, {
        status: (code) => ({
          json: (data) => resolve({ code, data }),
        }),
      });
    });

    // ✅ CREATE INVOICE AFTER ORDER CREATED
    const order = await Order.findOne({ orderId: response.data.orderId });

    if (order) {
      await createInvoiceFromOrder(order); // 👈 helper function (clean code)
    }

    if (!response.data.success) {
      return res.status(400).json(response.data);
    }

    /* =============================
       💾 SAVE PAYMENT
       ============================= */

    await Payment.create({
      orderId: response.data.orderId,
      consumerId: orderPayload.consumerId,
      agentId: req.user?.agentId,
      amount: numericAmount / 100,
      method: "RAZORPAY",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      collectedBy: {
        id: req.user?.agentId,
        role: "AGENT",
      },
    });

    return res.json({
      success: true,
      message: "Order placed with payment",
      orderId: response.data.orderId,
    });
  } catch (error) {
    console.error("VERIFY + PLACE ORDER ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Order placement failed",
    });
  }
};
