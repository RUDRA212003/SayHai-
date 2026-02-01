import { Server } from "socket.io";
import http from "http";
import express from "express";
import { ENV } from "./env.js";
import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.js";
import User from "../models/User.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [ENV.CLIENT_URL],
    credentials: true,
  },
});

io.use(socketAuthMiddleware);

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

const userSocketMap = {}; 

io.on("connection", (socket) => {
  console.log("A user connected", socket.user.fullName);

  const userId = socket.userId;
  userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // --- TYPING INDICATOR LOGIC ---
  
  // Listen for 'typing' event from sender
  socket.on("typing", ({ receiverId }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      // Send 'userTyping' only to the intended receiver
      io.to(receiverSocketId).emit("userTyping", { senderId: userId });
    }
  });

  // Listen for 'stopTyping' event from sender
  socket.on("stopTyping", ({ receiverId }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      // Send 'userStoppedTyping' only to the intended receiver
      io.to(receiverSocketId).emit("userStoppedTyping", { senderId: userId });
    }
  });

  // --- END TYPING INDICATOR LOGIC ---

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.user.fullName);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    
    // Update the user's lastSeen timestamp
    try {
      User.findByIdAndUpdate(
        userId,
        { lastSeen: new Date() },
        { new: true }
      ).catch((err) => {
        console.error("Error updating lastSeen:", err);
      });
    } catch (error) {
      console.error("Error in disconnect handler:", error);
    }
  });
});

export { io, app, server };