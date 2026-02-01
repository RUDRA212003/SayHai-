import { create } from "zustand";
import { axiosInstance, socketBaseUrl } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isVerifying: false, // New state for verification loading
  socket: null,
  onlineUsers: [],

  // ✅ CHECK AUTH
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/api/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in authCheck:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // ✅ SIGNUP (Updated for Verification Flow)
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/api/auth/signup", data);
      
      // We don't set authUser here anymore because they aren't verified yet
      toast.success(res.data.message || "Check your email to verify your account!");
      
      return true; // Return success to the component
    } catch (error) {
      toast.error(error?.response?.data?.message || "Signup failed");
      return false;
    } finally {
      set({ isSigningUp: false });
    }
  },

  // ✅ VERIFY EMAIL (New Action)
  verifyEmail: async (token) => {
    set({ isVerifying: true });
    try {
      const res = await axiosInstance.get(`/api/auth/verify-email?token=${token}`);
      toast.success(res.data.message || "Email verified! You can now login.");
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Verification failed");
      return false;
    } finally {
      set({ isVerifying: false });
    }
  },

  // ✅ LOGIN
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/api/auth/login", data);
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
      await axiosInstance.post("/api/auth/logout");
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
      const res = await axiosInstance.put("/api/auth/update-profile", data);
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