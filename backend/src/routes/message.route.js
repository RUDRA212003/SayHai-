import express from "express";
import {
  getAllContacts,
  getChatPartners,
  getMessagesByUserId,
  sendMessage,
  deleteMessage,
  markMessagesAsSeen, // NEW: Imported controller
} from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protectRoute);

router.get("/contacts", getAllContacts);
router.get("/chats", getChatPartners);
router.post("/send/:id", sendMessage);
router.delete("/:id", deleteMessage);

// NEW: Endpoint to clear unread counts for a specific sender
router.post("/mark-seen/:id", markMessagesAsSeen); 

router.get("/:id", getMessagesByUserId);

export default router;