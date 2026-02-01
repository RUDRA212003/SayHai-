import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import { encryptMessage, decryptMessage } from "../lib/encryption.js";

export const getAllContacts = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getAllContacts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMessagesByUserId = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: userToChatId } = req.params;

    // Mark unread messages from this sender as seen immediately
    await Message.updateMany(
      { senderId: userToChatId, receiverId: myId, isSeen: false },
      { $set: { isSeen: true } }
    );

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    }).populate({ path: "replyTo", select: "text image createdAt senderId" });

    const decryptedMessages = messages.map((msg) => {
      const msgObj = msg.toObject();
      if (msgObj.text) {
        msgObj.text = decryptMessage(msgObj.text);
      }
      if (msgObj.replyTo && msgObj.replyTo.text) {
        try {
          msgObj.replyTo.text = decryptMessage(msgObj.replyTo.text);
        } catch (e) {}
      }
      return msgObj;
    });

    res.status(200).json(decryptedMessages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image, replyTo } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (!text && !image) {
      return res.status(400).json({ message: "Text or image is required." });
    }
    if (senderId.equals(receiverId)) {
      return res.status(400).json({ message: "Cannot send messages to yourself." });
    }

    let imageUrl;
    if (image) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(image, {
          resource_type: "auto",
          folder: "chatify_messages",
        });
        imageUrl = uploadResponse.secure_url;
      } catch (uploadError) {
        return res.status(400).json({ message: "Failed to upload image." });
      }
    }

    const encryptedText = text ? encryptMessage(text) : null;

    const newMessage = new Message({
      senderId,
      receiverId,
      text: encryptedText,
      image: imageUrl,
      replyTo: replyTo || null,
      isSeen: false,
    });

    await newMessage.save();

    const messageToEmit = newMessage.toObject();
    if (messageToEmit.text) {
      messageToEmit.text = decryptMessage(messageToEmit.text);
    }

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", messageToEmit);
    }

    res.status(201).json(messageToEmit);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getChatPartners = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const messages = await Message.find({
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
    });

    const chatPartnerIds = [
      ...new Set(
        messages.map((msg) =>
          msg.senderId.toString() === loggedInUserId.toString()
            ? msg.receiverId.toString()
            : msg.senderId.toString()
        )
      ),
    ];

    const chatPartners = await User.find({ _id: { $in: chatPartnerIds } }).select("-password");

    const chatPartnersWithCounts = await Promise.all(
      chatPartners.map(async (partner) => {
        const unreadCount = await Message.countDocuments({
          senderId: partner._id,
          receiverId: loggedInUserId,
          isSeen: false,
        });

        return { ...partner.toObject(), unreadCount };
      })
    );

    res.status(200).json(chatPartnersWithCounts);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const markMessagesAsSeen = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    await Message.updateMany(
      { senderId: userToChatId, receiverId: myId, isSeen: false },
      { $set: { isSeen: true } }
    );

    res.status(200).json({ success: true, message: "Messages marked as seen" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// NEW: React to a message
export const reactToMessage = async (req, res) => {
  try {
    const { id: messageId } = req.params;
    const { emoji } = req.body;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ message: "Message not found" });

    const existingReactionIndex = message.reactions.findIndex(
      (r) => r.userId.toString() === userId.toString()
    );

    if (existingReactionIndex > -1) {
      // Toggle logic: If same emoji, remove it. If different, update it.
      if (message.reactions[existingReactionIndex].emoji === emoji) {
        message.reactions.splice(existingReactionIndex, 1);
      } else {
        message.reactions[existingReactionIndex].emoji = emoji;
      }
    } else {
      message.reactions.push({ userId, emoji });
    }

    await message.save();

    // Broadcast the update via Socket
    const receiverId = message.senderId.equals(userId) ? message.receiverId : message.senderId;
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("messageReactionUpdate", {
        messageId,
        reactions: message.reactions,
      });
    }

    res.status(200).json(message.reactions);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const messageId = req.params.id;
    const userId = req.user._id;
    const message = await Message.findById(messageId);

    if (!message) return res.status(404).json({ message: "Message not found" });
    if (message.senderId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Message.findByIdAndDelete(messageId);
    res.status(200).json({ success: true, message: "Message deleted" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};