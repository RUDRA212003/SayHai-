import { create } from "zustand";
import { axiosInstance, socketBaseUrl } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { useChatStore } from "./useChatStore";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  socket: null,
  onlineUsers: [],

  // ✅ CHECK AUTH
  checkAuth: async () => {
    try {
      // Removed /api prefix
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in authCheck:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // ✅ SIGNUP
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      // Removed /api prefix
      const res = await axiosInstance.post("/auth/signup", data);
      
      set({ authUser: res.data });
      
      toast.success("Account created successfully!");
      get().connectSocket();
      
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Signup failed");
      return false;
    } finally {
      set({ isSigningUp: false });
    }
  },

  // ✅ LOGIN
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      // Removed /api prefix
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });

      toast.success("Logged in successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // ✅ LOGOUT
  logout: async () => {
    try {
      // Removed /api prefix
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error("Error logging out");
      console.log("Logout error:", error);
    }
  },

  // ✅ UPDATE PROFILE
  updateProfile: async (data) => {
    try {
      // Removed /api prefix
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("Error in update profile:", error);
      toast.error(error?.response?.data?.message || "Update failed");
    }
  },

  // ✅ SOCKET CONNECT
  connectSocket: () => {
    const { authUser, socket } = get();
    if (!authUser || socket?.connected) return;

    const newSocket = io(socketBaseUrl, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    newSocket.connect();

    newSocket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });

      const selectedUser = useChatStore.getState().selectedUser;
      if (selectedUser && !userIds.includes(selectedUser._id)) {
        // Updated this path as well
        axiosInstance
          .get("/messages/contacts")
          .then((res) => {
            const found = Array.isArray(res.data) ? res.data.find((u) => u._id === selectedUser._id) : null;
            if (found) {
              useChatStore.setState({ selectedUser: found });
            }
          })
          .catch(() => {});
      }
    });

    newSocket.on("userTyping", ({ senderId }) => {
      const selected = useChatStore.getState().selectedUser;
      if (selected && selected._id === senderId) {
        useChatStore.setState({ isTyping: true });
      }
    });

    newSocket.on("userStoppedTyping", ({ senderId }) => {
      const selected = useChatStore.getState().selectedUser;
      if (selected && selected._id === senderId) {
        useChatStore.setState({ isTyping: false });
      }
    });

    set({ socket: newSocket });
  },

  // ✅ SOCKET DISCONNECT
  disconnectSocket: () => {
    const socket = get().socket;
    if (socket?.connected) socket.disconnect();
    set({ socket: null });
  },
}));