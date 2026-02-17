import Order from "../models/Order.js";
import Store from "../models/store.js";
import Product from "../models/Product.js";
import DeliveryPartner from "../models/DeliveryPartner.js";
import crypto from "crypto";
import Agent from "../models/Agent.js";
import {
  sendAgentApprovalMail,
  sendAgentRejectionMail,
} from "../utils/email.js";
import Employee from "../models/Employee.js";

export const approveAgent = async (req, res) => {
  try {
    const { agentId } = req.params;

    const agent = await Agent.findOne({ agentId });

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found",
      });
    }

    if (agent.status === "APPROVED") {
      return res.status(400).json({
        success: false,
        message: "Agent already approved",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");

    agent.status = "APPROVED";
    agent.passwordResetToken = token;
    agent.passwordResetExpires = Date.now() + 15 * 60 * 1000;

    await agent.save();

    await sendAgentApprovalMail({
      email: agent.email,
      agentId: agent.agentId,
      token,
    });

    res.json({
      success: true,
      message: "Agent approved & email sent",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};

// GET ALL AGENTS (ADMIN)
export const getAllAgents = async (req, res) => {
  try {
    const agents = await Agent.find()
      .select("-password -passwordResetToken -passwordResetExpires")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: agents.length,
      agents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch agents",
    });
  }
};

// REJECT AGENT (ADMIN)
export const rejectAgent = async (req, res) => {
  try {
    const { agentId } = req.params;

    const agent = await Agent.findOne({ agentId });

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found",
      });
    }

    if (agent.status === "REJECTED") {
      return res.status(400).json({
        success: false,
        message: "Agent already rejected",
      });
    }

    agent.status = "REJECTED";
    agent.passwordResetToken = undefined;
    agent.passwordResetExpires = undefined;

    await agent.save();

    // 📧 SEND REJECTION EMAIL
    await sendAgentRejectionMail({
      email: agent.email,
      agentId: agent.agentId,
    });

    return res.json({
      success: true,
      message: "Agent rejected and email sent",
    });
  } catch (error) {
    console.error("REJECT AGENT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to reject agent",
    });
  }
};

// To Give Permission to a specific Employee
export const updateProductPermission = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { canManageProducts } = req.body;

    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    employee.canManageProducts = canManageProducts;
    await employee.save();

    return res.json({
      success: true,
      message: "Product permission updated successfully",
      canManageProducts: employee.canManageProducts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};

//Dashboard Summary API
export const getDashboardSummary = async (req, res) => {
  try {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // 🔹 COUNTS
    const [
      totalOrders,
      totalAgents,
      totalEmployees,
      totalStores,
      totalProducts,
      totalDeliveryPartners,
      deliveredOrders,
      pendingOrders,
      monthlyRevenueData,
      totalRevenueData,
    ] = await Promise.all([
      Order.countDocuments(),
      Agent.countDocuments(),
      Employee.countDocuments(),
      Store.countDocuments({ isVerified: true }),
      Product.countDocuments(),
      DeliveryPartner.countDocuments(),

      Order.countDocuments({ status: "DELIVERED" }),
      Order.countDocuments({
        status: { $in: ["PLACED", "CONFIRMED", "SHIPPED", "OUT_FOR_DELIVERY"] },
      }),

      // Monthly revenue
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: firstDayOfMonth },
            status: "DELIVERED",
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$totalAmount" },
          },
        },
      ]),

      // Total revenue
      Order.aggregate([
        {
          $match: {
            status: "DELIVERED",
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$totalAmount" },
          },
        },
      ]),
    ]);

    const monthlyRevenue =
      monthlyRevenueData.length > 0 ? monthlyRevenueData[0].total : 0;

    const totalRevenue =
      totalRevenueData.length > 0 ? totalRevenueData[0].total : 0;

    return res.json({
      success: true,
      summary: {
        counts: {
          orders: totalOrders,
          agents: totalAgents,
          employees: totalEmployees,
          stores: totalStores,
          products: totalProducts,
          deliveryPartners: totalDeliveryPartners,
        },
        orderStats: {
          delivered: deliveredOrders,
          pending: pendingOrders,
        },
        revenue: {
          monthly: monthlyRevenue,
          total: totalRevenue,
        },
      },
    });
  } catch (error) {
    console.error("DASHBOARD SUMMARY ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard summary",
    });
  }
};
