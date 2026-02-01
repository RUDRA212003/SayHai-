import nodemailer from "nodemailer";
import { ENV } from "./env.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: ENV.EMAIL_USER,
    pass: ENV.EMAIL_PASS,
  },
  // ✅ These two lines will print the raw conversation with Google to your logs
  logger: true, 
  debug: true,  
});

export const sendVerificationEmail = async (email, token) => {
  console.log("--- 🛡️ DEBUG: EMAIL START ---");
  console.log("Target Email:", email);
  console.log("Configured User:", ENV.EMAIL_USER);
  console.log("Pass Provided:", ENV.EMAIL_PASS ? "YES (Check length: " + ENV.EMAIL_PASS.length + ")" : "NO");
  console.log("Base URL:", ENV.CLIENT_URL);

  // 1. Test the connection to Google first
  try {
    console.log("Verifying connection to Gmail SMTP...");
    await transporter.verify();
    console.log("✅ SMTP Connection Verified!");
  } catch (err) {
    console.error("❌ SMTP Verification Failed:", err.message);
    // If it fails here, your App Password or EMAIL_USER is likely wrong in Render
    return;
  }

  const verificationLink = `${ENV.CLIENT_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: `"SayHi Support" <${ENV.EMAIL_USER}>`,
    to: email,
    subject: "Verify your SayHi Account",
    html: `<p>Verify here: <a href="${verificationLink}">${verificationLink}</a></p>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Success! Message ID:", info.messageId);
  } catch (error) {
    console.error("❌ SendMail Error Name:", error.name);
    console.error("❌ SendMail Error Message:", error.message);
    // This will print the full technical error for us to analyze
    console.error("❌ Full Error Trace:", JSON.stringify(error, null, 2));
  }
  console.log("--- 🛡️ DEBUG: EMAIL END ---");
};