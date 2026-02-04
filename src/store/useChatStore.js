import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  adminUsers: [],
  unreadCounts: {},
  activeTab: "chats",
  selectedUser: null,
  repliedMessage: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,
  isTyping: false,

  // --- ADMIN ACTIONS ---
  
  getAllUsers: async () => {
    set({ isMessagesLoading: true });
    try {
      // ✅ Removed /api prefix
      const res = await axiosInstance.get("/auth/admin/users");
      set({ adminUsers: Array.isArray(res.data) ? res.data : [] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load users");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  toggleBlockUser: async (userId) => {
    try {
      // ✅ Removed /api prefix
      const res = await axiosInstance.put(`/auth/admin/users/${userId}/block`);
      
      set((state) => ({
        adminUsers: state.adminUsers.map((user) =>
          user._id === userId ? { ...user, isBlocked: res.data.isBlocked } : user
        ),
      }));
      
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Action failed");
    }
  },

  // --- EXISTING ACTIONS ---

  toggleSound: () => {
    const newState = !get().isSoundEnabled;
    localStorage.setItem("isSoundEnabled", newState);
    set({ isSoundEnabled: newState });
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
      // ✅ Removed /api prefix
      await axiosInstance.post(`/messages/mark-seen/${selectedUser._id}`);
    } catch (error) {
      console.error("Error marking messages as seen:", error);
    }
  },

  handleReaction: async (messageId, emoji) => {
    try {
      // ✅ Removed /api prefix
      const res = await axiosInstance.post(`/messages/react/${messageId}`, { emoji });
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
      // ✅ Removed /api prefix
      const res = await axiosInstance.get("/messages/contacts");
      const contactsData = Array.isArray(res.data) ? res.data : [];
      set({ allContacts: contactsData });
    } catch (error) {
      set({ allContacts: [] });
      toast.error(error.response?.data?.message || "Failed to load contacts");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMyChatPartners: async () => {
    set({ isUsersLoading: true });
    try {
      // ✅ Removed /api prefix
      const res = await axiosInstance.get("/messages/chats");
      const chatData = Array.isArray(res.data) ? res.data : [];
      const initialCounts = {};
      chatData.forEach((user) => {
        initialCounts[user._id] = user.unreadCount || 0;
      });
      set({ chats: chatData, unreadCounts: initialCounts });
    } catch (error) {
      set({ chats: [], unreadCounts: {} });
      toast.error(error.response?.data?.message || "Failed to load chats");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessagesByUserId: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      // ✅ Removed /api prefix
      const res = await axiosInstance.get(`/messages/${userId}`);
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
      reactions: [],
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };

    set({ messages: [...messages, optimisticMessage] });

    try {
      // ✅ Removed /api prefix
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: messages.concat(res.data), repliedMessage: null });
      if (!chats.some((chat) => chat._id === selectedUser._id)) {
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
        // ✅ Removed /api prefix
        axiosInstance.post(`/messages/mark-seen/${selectedUser._id}`);
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

    socket.on("messageReactionUpdate", ({ messageId, reactions }) => {
      set((state) => ({
        messages: state.messages.map((m) =>
          m._id === messageId ? { ...m, reactions } : m
        ),
      }));
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("newMessage");
    socket.off("messageReactionUpdate");
    socket.off("userTyping");
    socket.off("userStoppedTyping");
  },

  deleteMessage: async (messageId) => {
    const { messages } = get();
    try {
      // ✅ Removed /api prefix
      await axiosInstance.delete(`/messages/${messageId}`);
      set({ messages: messages.filter((msg) => msg._id !== messageId) });
      toast.success("Message deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete message");
    }
  },

  replyToMessage: (message) => set({ repliedMessage: message }),
  clearRepliedMessage: () => set({ repliedMessage: null }),
}));