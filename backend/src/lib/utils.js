import jwt from "jsonwebtoken";
import { ENV } from "./env.js";

export const generateToken = (userId, res) => {
  const { JWT_SECRET, NODE_ENV } = ENV;
  
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  const token = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true, // Prevents XSS attacks
    // On Render, frontend and backend are usually on different subdomains/domains
    // "none" allows the browser to send the cookie across these different domains
    sameSite: "none", 
    // Secure must be true for sameSite: "none" to work. 
    // We use a check to allow local development if needed, but Render is always HTTPS.
    secure: NODE_ENV !== "development", 
  });

  return token;
};