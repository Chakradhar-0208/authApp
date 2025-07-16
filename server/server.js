import express from "express";
import mongoose from "mongoose";
import signupRoutes from "./Routes/signup.js";
import loginRoutes from "./Routes/login.js";
import logoutRoute from "./Routes/logout.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import verifyToken from "./middleware/auth.js";
import User from "./models/models.js";
import jwt from "jsonwebtoken";
import multer from "multer";
import fs from 'fs'

dotenv.config();

const app = express();
const mongoURI = process.env.MONGO_URI;
const port = process.env.PORT || 3000;
mongoose
  .connect(mongoURI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use('/uploads', express.static('uploads'))
app.use(cookieParser());
app.use("/signup", signupRoutes);
app.use("/login", loginRoutes); 
app.use("/logout", logoutRoute);

app.get("/", (req, res) => {
  res.status(201).json({ message: "Gotcha!!!" });
});


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

app.post('/upload',upload.single('file'),(req,res)=>{
  if(!req.file) return res.status(400).send('No file uploaded.')
  res.json({fileName:req.file.filename,path: `/uploads/${req.file.filename}`,})
})


app.get("/getUserData", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(201).json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error fetching user data" });
  }
});

app.get("/check-login", (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ message: "User Logged in false" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res
      .status(201)
      .json({ message: "User Logged in true", userId: decoded });
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: "User Logged in false" });
  }
});

app.listen(port, "0.0.0.0", (err) => {
  console.log(`Server running at http://localhost:${port}`);
});
