import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Agent from "../models/Agent.js";

// Generate link for the Password

export const setPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const agent = await Agent.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!agent) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    agent.password = await bcrypt.hash(password, 10);
    agent.passwordResetToken = undefined;
    agent.passwordResetExpires = undefined;

    await agent.save();
    res.json({
      success: true,
      message: "Password set successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

// Agent Login JWT Authorization

export const agentLogin = async (req, res) => {
  try {
    const { agentId, password } = req.body;

    if (!agentId || !password) {
      return res.status(400).json({
        success: false,
        message: "Agent ID and password are required",
      });
    }

    const agent = await Agent.findOne({ agentId });

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found",
      });
    }

    if (agent.status !== "APPROVED") {
      return res.status(403).json({
        success: false,
        message: "Agent not approved yet",
      });
    }

    const isMatch = await bcrypt.compare(password, agent.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: agent._id,
        role: agent.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({
      success: true,
      token,
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

// LOGOUT (Agent / Admin)
export const logout = async (req, res) => {
  try {
    return res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};
