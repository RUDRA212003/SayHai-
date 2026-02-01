import nodemailer from "nodemailer";
import { ENV } from "./env.js";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465, // ✅ Switching to the SSL port
  secure: true, // ✅ Must be true for port 465
  auth: {
    user: ENV.EMAIL_USER,
    pass: ENV.EMAIL_PASS,
  },
  // ✅ Keeping these to catch issues quickly rather than hanging
  connectionTimeout: 15000, 
  greetingTimeout: 15000,
  socketTimeout: 15000,
  logger: true,
  debug: true,
});

export const sendVerificationEmail = async (email, token) => {
  console.log("--- 🛡️ DEBUG: EMAIL START (SSL/465) ---");
  console.log("Target Email:", email);

  try {
    console.log("Verifying SSL connection to Gmail via Port 465...");
    await transporter.verify();
    console.log("✅ SMTP Connection Verified!");
  } catch (err) {
    console.error("❌ Port 465 Failed:", err.message);
    console.log("--- 🛡️ DEBUG: EMAIL END ---");
    return;
  }

  const verificationLink = `${ENV.CLIENT_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: `"SayHi Support" <${ENV.EMAIL_USER}>`,
    to: email,
    subject: "Verify your SayHi Account",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eab308; border-radius: 10px; background-color: #09090b; color: #ffffff;">
        <h2 style="text-align: center; color: #eab308; text-transform: uppercase; letter-spacing: 2px;">SayHi // Security</h2>
        <p>You have initialized a new node registration. Please verify your identity.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationLink}" style="background-color: #eab308; color: #000000; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 5px; display: inline-block;">VERIFY PROFILE</a>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Success! Message ID:", info.messageId);
  } catch (error) {
    console.error("❌ SendMail Error:", error.message);
  }
  console.log("--- 🛡️ DEBUG: EMAIL END ---");
};