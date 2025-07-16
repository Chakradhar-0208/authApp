import express from "express";
import bcrypt from "bcrypt";
import User from "../models/models.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({ message: "User signed up successfully" });
  } catch (err) {
    console.error("Signup Error:", err);
    return res.status(500).json({ message: "Server error during signup" });
  }
});

export default router;
