import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import signupRoutes from "./Routes/signup.js";
import loginRoutes from "./Routes/login.js";
import logoutRoute from "./Routes/logout.js";
import verifyToken from "./middleware/auth.js";
import User from "./models/models.js";
import jwt from "jsonwebtoken";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 8080;

const allowedOrigins = [
  "http://localhost:5173",
  "https://authenticator-app-cp.vercel.app",
  "https://authenticationappfrontend.onrender.com"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// API Routes
app.use("/signup", signupRoutes);
app.use("/login", loginRoutes);
app.use("/logout", logoutRoute);

app.get("/getUserData", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error fetching user data" });
  }
});

app.get("/check-login", (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "User Logged in false" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({ message: "User Logged in true", userId: decoded });
  } catch (err) {
    return res.status(401).json({ message: "User Logged in false" });
  }
});

app.get("/api-status", (req, res) => {
  res.status(200).json({ message: "API is running" });
});

// Serve static frontend
app.use(express.static(path.join(__dirname, "dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Connect DB and Start Server
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: "authApp"
})
.then(() => {
  console.log("✅ MongoDB connected");
  app.listen(PORT, () => {
    console.log(`🚀 Server listening on port ${PORT}`);
  });
})
.catch((err) => {
  console.error("❌ MongoDB connection error:", err);
});
