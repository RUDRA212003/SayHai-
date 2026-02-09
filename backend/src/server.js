import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import { app, server } from "./lib/socket.js";

const PORT = ENV.PORT || 5001;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// ✅ CORS — MUST be explicit for cookies
app.use(
  cors({
    origin:
      ENV.NODE_ENV === "development"
        ? "http://localhost:5173"
        : ENV.CLIENT_URL,
    credentials: true,
  })
);

app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "SayHi API is active and secure." });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
