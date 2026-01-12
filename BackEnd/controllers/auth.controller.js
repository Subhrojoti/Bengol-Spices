import bcrypt from "bcryptjs";
import Agent from "../models/Agent.js";

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
