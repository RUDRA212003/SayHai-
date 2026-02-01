import nodemailer from "nodemailer";
import { ENV } from "./env.js";

// Setup the delivery truck (transporter)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: ENV.EMAIL_USER,
    pass: ENV.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (email, token) => {
  // This link will point to your frontend "Verification" page
  const verificationLink = `${ENV.CLIENT_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: `"SayHi Support" <${ENV.EMAIL_USER}>`,
    to: email,
    subject: "Verify your SayHi Account",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eab308; border-radius: 10px; background-color: #09090b; color: #ffffff;">
        <h2 style="text-align: center; color: #eab308; text-transform: uppercase; letter-spacing: 2px;">SayHi // Security</h2>
        <p>You have initialized a new node registration. Please verify your identity to access the secure network.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationLink}" style="background-color: #eab308; color: #000000; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 5px; display: inline-block;">VERIFY PROFILE</a>
        </div>
        <p style="font-size: 12px; color: #71717a; text-align: center;">If you did not request this, please ignore this transmission.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email service failed");
  }
};