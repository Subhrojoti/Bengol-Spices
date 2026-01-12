import crypto from "crypto";
import Agent from "../models/Agent.js";
import { sendAgentApprovalMail } from "../utils/email.js";

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
