import express from "express";
import { User } from "../model/User";
import { createUser } from "../controller/user-register-controller";
const router = express.Router();

router.post("/register", createUser);

router.get("/verify-email", async (req, res) => {
  try {
    const token = req.query.token;
    if (!token) return res.status(400).send("Verification token missing");

    const user = await User.findOne({ verifyToken: token });
    if (!user) return res.status(400).send("Invalid or expired token");

    user.isEmailVerified = true;
    user.verifyToken = undefined;
    await user.save();

    res.send("Email verified successfully! You can now log in.");
  } catch (err: any) {
    res.status(500).send("Server error: " + err.message);
  }
});

router.get("/check-username", async (req, res) => {
  try {
    const userName = req.query.userName as string;
    if (!userName) return res.status(400).json({ available: false });

    const existingUser = await User.findOne({ userName });
    res.json({ available: !existingUser });
  } catch (err: any) {
    res.status(500).json({ available: false });
  }
});

router.get("/check-email", async (req, res) => {
  try {
    const userEmail = req.query.userEmail as string;
    if (!userEmail) return res.status(400).json({ available: false });

    const existingUser = await User.findOne({ userEmail });
    res.json({ available: !existingUser });
  } catch (err: any) {
    res.status(500).json({ available: false });
  }
});

export default router;
