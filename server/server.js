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

dotenv.config();

const app = express();
const MONGO_URI = process.env.MONGO_URI;
const port = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:5173",
  "https://authenticator-app-cp.vercel.app",
  "https://authenticationappfrontend.onrender.com",
  "https://auth-app-git-ios-token-support-chakradhar-0208s-projects.vercel.app", // ✅ new one
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "authApp",
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.use("/signup", signupRoutes);
app.use("/login", loginRoutes);
app.use("/logout", logoutRoute);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Gotcha!!!" });
});

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

app.listen(port, () => {
  console.log(`🚀 Server listening on port ${port}`);
});
