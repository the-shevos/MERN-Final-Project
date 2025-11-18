import express from "express";
import { User } from "../model/User";
import {
  loginUser,
  forgotPassword,
  resetPassword,
} from "../controller/user-login-controller";

const router = express.Router();

router.post("/login", loginUser);

router.post("/forgot-password", forgotPassword);

router.get("/reset-password", (req, res) => {
  const token = req.query.token;
  if (!token) return res.status(400).send("Invalid or missing token");

  res.send(`
    <html>
      <body style="font-family:Arial;text-align:center;padding:40px;">
        <h2>Reset Your Password</h2>
        <form action="/api/v1/user/reset-password" method="POST">
          <input type="hidden" name="token" value="${token}" />
          <input type="password" name="newPassword" placeholder="New password" required />
          <br><br>
          <button type="submit">Reset Password</button>
        </form>
      </body>
    </html>
  `);
});

router.post(
  "/reset-password",
  express.urlencoded({ extended: true }),
  resetPassword
);

export default router;
