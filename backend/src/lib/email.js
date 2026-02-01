import * as sib from "@getbrevo/brevo";
import { ENV } from "./env.js";

// Initialize Brevo API
const apiInstance = new sib.TransactionalEmailsApi();
const apiKey = apiInstance.authentications['apiKey'];
apiKey.apiKey = process.env.BREVO_API_KEY;

export const sendVerificationEmail = async (email, token) => {
  const verificationLink = `${ENV.CLIENT_URL}/verify-email?token=${token}`;

  const sendSmtpEmail = new sib.SendSmtpEmail();

  sendSmtpEmail.subject = "Verify your SayHi Account";
  sendSmtpEmail.htmlContent = `
    <div style="font-family: sans-serif; background-color: #09090b; color: #ffffff; padding: 20px; border-radius: 10px;">
      <h2 style="color: #eab308;">SayHi // Security</h2>
      <p>Please verify your account to join the network:</p>
      <a href="${verificationLink}" style="background-color: #eab308; color: #000; padding: 10px 20px; text-decoration: none; font-weight: bold; border-radius: 5px; display: inline-block;">VERIFY PROFILE</a>
    </div>
  `;
  sendSmtpEmail.sender = { "name": "SayHi Support", "email": ENV.EMAIL_USER };
  sendSmtpEmail.to = [{ "email": email }];

  try {
    console.log("--- 🛡️ BREVO API START ---");
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("✅ Success! Brevo Message ID:", data.messageId);
  } catch (error) {
    console.error("❌ Brevo API Failed:", error.response?.body || error.message);
    throw new Error("Email service failed");
  }
};