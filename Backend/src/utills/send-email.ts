import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export async function sendVerificationEmail(
  toEmail: string,
  token: string
): Promise<void> {
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_PASS;
  const port = process.env.PORT || "3000";

  if (!gmailUser || !gmailPass) {
    console.error("GMAIL_USER or GMAIL_PASS is not defined in .env");
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: gmailUser,
      pass: gmailPass,
    },
  });

  const verifyLink = `http://localhost:${port}/api/v1/user/verify-email?token=${token}`;

  const mailOptions = {
    from: `"My App" <${gmailUser}>`,
    to: toEmail,
    subject: "Welcome to My App! Verify Your Email",
    html: `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 40px; background-color: #f9f9f9;">
        <img src="https://yourdomain.com/logo.png" alt="My App Logo" style="width: 120px; margin-bottom: 25px;" />
        <h1 style="color: #6A1B9A; font-size: 34px; margin-bottom: 20px;">
          Welcome to My App!
        </h1>
        <p style="font-size: 18px; color: #333; line-height: 1.6; margin: 0 auto 30px auto; max-width: 550px;">
          We're thrilled to have you as part of our community! My App is designed to make your life easier and more organized. 
          Please verify your email address below to start exploring all the amazing features and benefits we offer. Your journey with us starts now!
        </p>
        <a href="${verifyLink}" 
           style="
             display: inline-block;
             padding: 15px 35px;
             margin: 20px 0;
             font-size: 18px;
             font-weight: bold;
             color: #fff;
             background-color: #8E24AA;
             text-decoration: none;
             border-radius: 10px;
             box-shadow: 0 5px 10px rgba(0,0,0,0.15);
             transition: background-color 0.3s ease;
           "
           target="_blank">
          Click To Verify
        </a>
        <p style="font-size: 14px; color: #555; margin-top: 25px; max-width: 500px; margin-left: auto; margin-right: auto;">
          If you did not create an account, please ignore this email.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent to:", toEmail);
  } catch (error: any) {
    console.error("Error sending email:", error);
  }
}
