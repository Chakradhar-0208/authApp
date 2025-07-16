import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.clearCookie("token", {
    path: "/",
    httpOnly: true,
    sameSite: "None", 
    secure: true,     
  });

  return res.status(200).json({ message: "User logged out successfully!" });
});

export default router;
