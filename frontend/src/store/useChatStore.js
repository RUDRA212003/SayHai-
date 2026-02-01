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
  isTyping: false, // Added for typing indicator logic

  toggleSound: () => {
    localStorage.setItem("isSoundEnabled", !get().isSoundEnabled);
    set({ isSoundEnabled: !get().isSoundEnabled });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),

  setSelectedUser: async (selectedUser) => {
    if (!selectedUser) {
      set({ selectedUser: null, isTyping: false });
      return;
    }

    set({
      selectedUser,
      isTyping: false,
      unreadCounts: {
        ...get().unreadCounts,
        [selectedUser._id]: 0,
      },
    });

    try {
      await axiosInstance.post(`/api/messages/mark-seen/${selectedUser._id}`);
    } catch (error) {
      console.error("Error marking messages as seen:", error);
    }
  },

  // NEW: Handle sending/toggling reactions
  handleReaction: async (messageId, emoji) => {
    try {
      const res = await axiosInstance.post(`/api/messages/react/${messageId}`, { emoji });
      
      // Update the specific message in the local state with new reactions array
      set((state) => ({
        messages: state.messages.map((m) =>
          m._id === messageId ? { ...m, reactions: res.data } : m
        ),
      }));
    } catch (error) {
      console.error("Reaction error:", error);
      toast.error("Failed to update reaction");
    }
  },

  getAllContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/api/messages/contacts");
      set({ allContacts: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load contacts");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMyChatPartners: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/api/messages/chats");
      const chatData = res.data;

      const initialCounts = {};
      chatData.forEach((user) => {
        initialCounts[user._id] = user.unreadCount || 0;
      });

      set({
        chats: chatData,
        unreadCounts: initialCounts,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load chats");
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
      reactions: [], // Initialize with empty reactions
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };

    set({ messages: [...messages, optimisticMessage] });

    try {
      const res = await axiosInstance.post(`/api/messages/send/${selectedUser._id}`, messageData);
      set({ messages: messages.concat(res.data), repliedMessage: null });

      const chatExists = chats.some((chat) => chat._id === selectedUser._id);
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

    // Listen for new messages
    socket.on("newMessage", (newMessage) => {
      const { selectedUser, isSoundEnabled, chats, messages, unreadCounts } = get();
      const isFromSelectedUser = selectedUser && newMessage.senderId === selectedUser._id;

      if (isFromSelectedUser) {
        set({ messages: [...messages, newMessage] });
        axiosInstance.post(`/api/messages/mark-seen/${selectedUser._id}`);
      } else {
        set({
          unreadCounts: {
            ...unreadCounts,
            [newMessage.senderId]: (unreadCounts[newMessage.senderId] || 0) + 1,
          },
        });
      }

      if (!chats.some((chat) => chat._id === newMessage.senderId)) {
        get().getMyChatPartners();
      }

      if (isSoundEnabled) {
        const notificationSound = new Audio("/sounds/notification.mp3");
        notificationSound.play().catch((e) => console.log("Audio failed:", e));
      }
    });

    // NEW: Listen for real-time reactions
    socket.on("messageReactionUpdate", ({ messageId, reactions }) => {
      set((state) => ({
        messages: state.messages.map((m) =>
          m._id === messageId ? { ...m, reactions } : m
        ),
      }));
    });

    // Listen for typing indicator
    socket.on("userTyping", ({ senderId }) => {
      if (get().selectedUser?._id === senderId) set({ isTyping: true });
    });

    socket.on("userStoppedTyping", ({ senderId }) => {
      if (get().selectedUser?._id === senderId) set({ isTyping: false });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("newMessage");
    socket.off("messageReactionUpdate"); // Clean up reaction listener
    socket.off("userTyping");
    socket.off("userStoppedTyping");
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