import express from "express";
import bcrypt from "bcrypt";
import User from "../models/models.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: `User Already Exists` });
    }

    const hashPass = bcrypt.hashSync(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashPass,
    });
    await newUser.save();
    res.status(201).json({ message: `User SignedUp successfully` });
  } catch (err) {
    console.error(`Signup Error: ${err}`);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
