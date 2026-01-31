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

    // populate replyTo so frontend can show replied message preview
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    }).populate({ path: "replyTo", select: "text image createdAt senderId" });

    // Decrypt messages before sending to client
    const decryptedMessages = messages.map((msg) => {
      const msgObj = msg.toObject();
      if (msgObj.text) {
        msgObj.text = decryptMessage(msgObj.text);
      }
      // If the message is a reply to another message, try to decrypt the replied message text as well
      if (msgObj.replyTo && msgObj.replyTo.text) {
        try {
          msgObj.replyTo.text = decryptMessage(msgObj.replyTo.text);
        } catch (e) {
          // leave as is if decryption fails
        }
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
    const receiverExists = await User.exists({ _id: receiverId });
    if (!receiverExists) {
      return res.status(404).json({ message: "Receiver not found." });
    }

    let imageUrl;
    if (image) {
      try {
        // upload base64 image to cloudinary
        const uploadResponse = await cloudinary.uploader.upload(image, {
          resource_type: "auto",
          folder: "chatify_messages",
        });
        imageUrl = uploadResponse.secure_url;
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(400).json({ message: "Failed to upload image. Please try again." });
      }
    }

    // Encrypt text before saving
    const encryptedText = text ? encryptMessage(text) : null;

    const newMessage = new Message({
      senderId,
      receiverId,
      text: encryptedText,
      image: imageUrl,
      replyTo: replyTo || null,
    });

    await newMessage.save();

    // Decrypt text before emitting via socket
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
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getChatPartners = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    // find all the messages where the logged-in user is either sender or receiver
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

    res.status(200).json(chatPartners);
  } catch (error) {
    console.error("Error in getChatPartners: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const messageId = req.params.id;
    const userId = req.user._id;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Check if the user is the sender of the message
    if (message.senderId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You can only delete your own messages" });
    }

    await Message.findByIdAndDelete(messageId);

    res.status(200).json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error in deleteMessage: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
