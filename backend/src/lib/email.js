import * as sib from "@getbrevo/brevo"; // Ensure you ran: npm install @getbrevo/brevo
import { ENV } from "./env.js";

// 1. Initialize Brevo API Instance
const apiInstance = new sib.TransactionalEmailsApi();
const apiKey = apiInstance.authentications['apiKey'];
apiKey.apiKey = ENV.BREVO_API_KEY; // Ensure BREVO_API_KEY is in your env.js and Render Dashboard

export const sendVerificationEmail = async (email, token) => {
  // 2. Clean the URL to prevent "Double Slash" 404 errors
  const cleanClientUrl = ENV.CLIENT_URL.replace(/\/$/, ""); 
  const verificationLink = `${cleanClientUrl}/verify-email?token=${token}`;

  // 3. Setup the Brevo Email Object
  const sendSmtpEmail = new sib.SendSmtpEmail();

  sendSmtpEmail.subject = "Verify your SayHi Account";
  sendSmtpEmail.htmlContent = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eab308; border-radius: 10px; background-color: #09090b; color: #ffffff;">
      <h2 style="text-align: center; color: #eab308; text-transform: uppercase; letter-spacing: 2px;">SayHi // Security</h2>
      <p>You have initialized a new node registration. Please verify your identity to access the secure network.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationLink}" style="background-color: #eab308; color: #000000; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 5px; display: inline-block;">VERIFY PROFILE</a>
      </div>
      <p style="font-size: 12px; color: #71717a; text-align: center;">If you did not request this, please ignore this transmission.</p>
    </div>
  `;
  
  // Ensure "email" here matches your verified sender in Brevo Dashboard
  sendSmtpEmail.sender = { "name": "SayHi Support", "email": ENV.EMAIL_USER };
  sendSmtpEmail.to = [{ "email": email }];

  try {
    console.log("--- 🛡️ SENDING VIA BREVO API ---");
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("✅ Verification email sent successfully! ID:", data.messageId);
  } catch (error) {
    // This will catch if your API key is wrong or sender is unverified
    console.error("❌ Brevo API Error:", error.response?.body || error.message);
    throw new Error("Email service failed");
  }
};