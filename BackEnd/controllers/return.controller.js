import Return from "../models/Return.js";
import Order from "../models/Order.js";
import Counter from "../models/Counter.js";

export const initiateReturn = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;

    if (!reason || reason.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Return reason is required",
      });
    }

    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // 🔒 Only agent who placed order
    if (order.agentId !== req.user.agentId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized for this order",
      });
    }

    // 🔒 Only after delivered
    if (order.status !== "DELIVERED") {
      return res.status(400).json({
        success: false,
        message: "Return can only be initiated after delivery",
      });
    }

    // ❌ Prevent duplicate return
    const existingReturn = await Return.findOne({ orderId });
    if (existingReturn) {
      return res.status(400).json({
        success: false,
        message: "Return already initiated for this order",
      });
    }

    // 🔥 Generate Return ID using counter
    const year = new Date().getFullYear();

    const counter = await Counter.findOneAndUpdate(
      { _id: `return-${year}` }, // ✅ use _id instead of name
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );

    const serial = String(counter.seq).padStart(4, "0");
    const returnId = `RET${year}-${serial}`;

    console.log(req.user);
    const newReturn = await Return.create({
      returnId,
      orderId,
      consumerId: order.consumerId,
      agentId: order.agentId,
      reason: reason.trim(),
      initiatedBy: {
        id: req.user.agentId,
        name: req.user.name || "Agent",
        role: "AGENT",
      },
      status: "INITIATED",
      statusHistory: [
        {
          status: "INITIATED",
          changedBy: {
            id: req.user.agentId,
            name: req.user.name || "Agent",
            role: "AGENT",
          },
          note: "Return initiated by agent",
        },
      ],
    });

    return res.status(201).json({
      success: true,
      message: "Return initiated successfully",
      returnId: newReturn.returnId,
    });
  } catch (error) {
    console.error("INITIATE RETURN ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to initiate return",
    });
  }
};
