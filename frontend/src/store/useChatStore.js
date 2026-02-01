import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  unreadCounts: {}, 
  activeTab: "chats",
  selectedUser: null,
  repliedMessage: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,

  toggleSound: () => {
    localStorage.setItem("isSoundEnabled", !get().isSoundEnabled);
    set({ isSoundEnabled: !get().isSoundEnabled });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  
  // UPDATED: Now clears count locally AND notifies backend
  setSelectedUser: async (selectedUser) => {
    if (!selectedUser) {
      set({ selectedUser: null });
      return;
    }

    // Local update for immediate UI response
    set({ 
      selectedUser,
      unreadCounts: {
        ...get().unreadCounts,
        [selectedUser._id]: 0,
      }
    });

    // Backend update to persist "seen" status
    try {
      await axiosInstance.post(`/api/messages/mark-seen/${selectedUser._id}`);
    } catch (error) {
      console.error("Error marking messages as seen:", error);
    }
  },

  getAllContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/api/messages/contacts");
      set({ allContacts: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // UPDATED: Now extracts unread counts from the new backend response
  getMyChatPartners: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/api/messages/chats");
      const chatData = res.data;

      // Extract unread counts into a map
      const initialCounts = {};
      chatData.forEach(user => {
        initialCounts[user._id] = user.unreadCount || 0;
      });

      set({ 
        chats: chatData,
        unreadCounts: initialCounts 
      });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessagesByUserId: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/api/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages, chats } = get();
    const { authUser } = useAuthStore.getState();
    const tempId = `temp-${Date.now()}`;

    const optimisticMessage = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image,
      replyTo: messageData.replyTo || null,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };

    set({ messages: [...messages, optimisticMessage] });

    try {
      const res = await axiosInstance.post(`/api/messages/send/${selectedUser._id}`, messageData);
      set({ messages: messages.concat(res.data), repliedMessage: null });
      
      const chatExists = chats.some(chat => chat._id === selectedUser._id);
      if (!chatExists) {
        set({ chats: [selectedUser, ...chats] });
      }
    } catch (error) {
      set({ messages: messages });
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      const { selectedUser, isSoundEnabled, chats, messages, unreadCounts } = get();
      
      const isFromSelectedUser = selectedUser && newMessage.senderId === selectedUser._id;

      if (isFromSelectedUser) {
        set({ messages: [...messages, newMessage] });
        // Since chat is open, immediately mark as seen on backend
        axiosInstance.post(`/api/messages/mark-seen/${selectedUser._id}`);
      } else {
        set({
          unreadCounts: {
            ...unreadCounts,
            [newMessage.senderId]: (unreadCounts[newMessage.senderId] || 0) + 1,
          },
        });
      }

      const senderInChats = chats.some(chat => chat._id === newMessage.senderId);
      if (!senderInChats) {
        get().getMyChatPartners(); 
      }

      if (isSoundEnabled) {
        const notificationSound = new Audio("/sounds/notification.mp3");
        notificationSound.currentTime = 0;
        notificationSound.play().catch((e) => console.log("Audio play failed:", e));
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) socket.off("newMessage");
  },

  deleteMessage: async (messageId) => {
    const { messages } = get();
    try {
      await axiosInstance.delete(`/api/messages/${messageId}`);
      set({ messages: messages.filter((msg) => msg._id !== messageId) });
      toast.success("Message deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete message");
    }
  },

  replyToMessage: (message) => set({ repliedMessage: message }),
  clearRepliedMessage: () => set({ repliedMessage: null }),
}));