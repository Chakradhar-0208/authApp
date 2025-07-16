import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.clearCookie("token", {
    path: "/",
    httpOnly: true,
    sameSite: "Lax",
    secure: false,
  });

  return res.status(201).json({ message: "User Logged out Successfully!!" });
});

export default router;
