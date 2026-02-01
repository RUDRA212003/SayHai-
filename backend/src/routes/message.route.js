import express from "express";
import {
  getAllContacts,
  getChatPartners,
  getMessagesByUserId,
  sendMessage,
  deleteMessage,
  markMessagesAsSeen,
  reactToMessage, // 1. Added the import for reactions
} from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protectRoute);

router.get("/contacts", getAllContacts);
router.get("/chats", getChatPartners);
router.post("/send/:id", sendMessage);
router.delete("/:id", deleteMessage);

// Endpoint to clear unread counts
router.post("/mark-seen/:id", markMessagesAsSeen); 

// 2. ADDED: Reaction route matching your store's API call
router.post("/react/:id", reactToMessage); 

router.get("/:id", getMessagesByUserId);

export default router;