import * as sib from "@getbrevo/brevo";
import { ENV } from "./env.js";

const apiInstance = new sib.TransactionalEmailsApi();
const apiKey = apiInstance.authentications['apiKey'];
apiKey.apiKey = ENV.BREVO_API_KEY;

export const sendVerificationEmail = async (email, token) => {
  const cleanClientUrl = ENV.CLIENT_URL.replace(/\/$/, ""); 
  const verificationLink = `${cleanClientUrl}/verify-email?token=${token}`;
  const websiteLink = "https://say-hai.vercel.app";

  const sendSmtpEmail = new sib.SendSmtpEmail();

  sendSmtpEmail.subject = "Action Required: Verify Your SayHi Node";
  sendSmtpEmail.htmlContent = `
    <div style="background-color: #020617; padding: 40px 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <div style="max-width: 500px; margin: 0 auto; background-color: #09090b; border: 1px solid #27272a; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);">
        
        <div style="background-color: #eab308; padding: 20px; text-align: center;">
          <h1 style="margin: 0; color: #000000; font-size: 24px; font-weight: 900; text-transform: uppercase; letter-spacing: 4px;">SayHi</h1>
        </div>

        <div style="padding: 40px 30px; color: #f4f4f5;">
          <h2 style="color: #eab308; margin-bottom: 20px; font-size: 18px; text-transform: uppercase;">Identity Verification Required</h2>
          <p style="line-height: 1.6; color: #a1a1aa; font-size: 14px;">
            A new connection request was initialized for your account. To maintain the integrity of our secure network, please verify your profile node below.
          </p>
          
          <div style="text-align: center; margin: 40px 0;">
            <a href="${verificationLink}" style="background-color: #eab308; color: #000000; padding: 16px 32px; text-decoration: none; font-weight: 800; font-size: 14px; border-radius: 12px; display: inline-block; text-transform: uppercase; letter-spacing: 1px;">
              Verify Connection
            </a>
          </div>

          <p style="font-size: 13px; color: #71717a; line-height: 1.6;">
            This link is time-sensitive. If the button above does not work, copy and paste this URL into your browser: 
            <br />
            <span style="color: #eab308; font-family: monospace; word-break: break-all;">${verificationLink}</span>
          </p>
        </div>

        <div style="background-color: #18181b; padding: 20px; text-align: center; border-top: 1px solid #27272a;">
          <p style="margin: 0 0 10px 0; font-size: 12px; color: #a1a1aa;">
            Want to explore the network? 
            <a href="${websiteLink}" style="color: #eab308; text-decoration: none; font-weight: bold;">Visit our Website →</a>
          </p>
          <p style="margin: 0; font-size: 10px; color: #52525b; text-transform: uppercase; letter-spacing: 1px;">
            &copy; 2026 SayHi // Secure Communication Protocol
          </p>
        </div>

      </div>
    </div>
  `;
  
  sendSmtpEmail.sender = { "name": "SayHi Security", "email": ENV.EMAIL_USER };
  sendSmtpEmail.to = [{ "email": email }];

  try {
    console.log("--- 🛡️ INITIATING SECURE EMAIL TRANSMISSION ---");
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("✅ Transmission Successful. Message ID:", data.messageId);
  } catch (error) {
    console.error("❌ Transmission Failure:", error.response?.body || error.message);
    throw new Error("Critical: Email system offline.");
  }
};