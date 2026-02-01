import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import { app, server } from "./lib/socket.js";

const PORT = ENV.PORT || 3000;

app.use(express.json({ limit: "50mb" })); 
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// ✅ CORS configuration
if (ENV.NODE_ENV === "development") {
  app.use(cors({ origin: true, credentials: true }));
} else {
  // Ensure ENV.CLIENT_URL is your Vercel link on Render dashboard
  app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
}

app.use(cookieParser());

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// ✅ Health Check Route (replaces the old static file serving)
// This confirms the backend is live without looking for frontend files
app.get("/", (req, res) => {
  res.status(200).json({ message: "SayHi API is active and secure." });
});

server.listen(PORT, () => {
  console.log("Server running on port: " + PORT);
  connectDB();
});