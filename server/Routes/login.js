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
      return res.json({ message: `Email not found in database.` });
    }
    const isMatch = await bcrypt.compare(password, isUser.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Password" });
    }

    const token = jwt.sign({ id: isUser._id }, process.env.JWT_SECRET);

    res.cookie("token", token, {
      path: "/",
      httpOnly: false,
      sameSite: "Lax",
      secure: false,
      // maxAge: 30 * 1000,
    });

    res.status(201).json({ message: `Welcome Back, ${isUser.name}!` });
  } catch (err) {
    console.log(`Login error: ${err}`);
    res.status(500).json({ message: `Server error during Login` });
  }
});

export default router;
// export
