import { User } from "../models/userModel.js";

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User Already Exist",
      });
    }
    const newUser = await User.create({ username, email, password });
    return res.status(201).json({
      success: true,
      message: "User Created Successfully",
      data: newUser,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};
