import nodemailer from "nodemailer";
import { ENV } from "./env.js";

// ✅ Explicit configuration for Production stability
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Must be false for port 587
  auth: {
    user: ENV.EMAIL_USER,
    pass: ENV.EMAIL_PASS,
  },
  // ✅ Prevent "hanging" in production
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000,
  socketTimeout: 10000,
  logger: true, 
  debug: true,  
});

export const sendVerificationEmail = async (email, token) => {
  console.log("--- 🛡️ DEBUG: EMAIL START ---");
  console.log("Target Email:", email);
  console.log("Configured User:", ENV.EMAIL_USER);
  console.log("Pass Provided:", ENV.EMAIL_PASS ? `YES (${ENV.EMAIL_PASS.length} chars)` : "NO");
  console.log("Base URL:", ENV.CLIENT_URL);

  try {
    console.log("Verifying connection to Gmail SMTP via Port 587...");
    await transporter.verify();
    console.log("✅ SMTP Connection Verified!");
  } catch (err) {
    console.error("❌ SMTP Verification Failed:", err.message);
    console.log("--- 🛡️ DEBUG: EMAIL END ---");
    return; // Exit if connection fails
  }

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
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Success! Message ID:", info.messageId);
    console.log("Server Response:", info.response);
  } catch (error) {
    console.error("❌ SendMail Error:", error.message);
    console.error("❌ Full Error Trace:", JSON.stringify(error, null, 2));
  }
  console.log("--- 🛡️ DEBUG: EMAIL END ---");
};