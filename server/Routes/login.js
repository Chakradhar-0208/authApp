import express from "express";
import bcrypt from "bcrypt";
import User from "../models/models.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    const isUser = await User.findOne({ email });
    if (!isUser) {
      return res.status(404).json({ message: "Email not found in database." });
    }

    const isMatch = await bcrypt.compare(password, isUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password." });
    }

    const token = jwt.sign({ id: isUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ message: `Welcome Back, ${isUser.name}!` });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

export default router;
