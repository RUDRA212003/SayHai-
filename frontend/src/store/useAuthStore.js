import { create } from "zustand";
import { axiosInstance, socketBaseUrl } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  needsProfileUpdate: false, // ✅ STEP 1 FLAG
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isVerifying: false,
  socket: null,
  onlineUsers: [],

  // ✅ CHECK AUTH
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/api/auth/check");
      const user = res.data;

      set({
        authUser: user,
        needsProfileUpdate: !user.profilePic || user.profilePic === "",
      });

      get().connectSocket();
    } catch (error) {
      set({ authUser: null, needsProfileUpdate: false });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // ✅ SIGNUP
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/api/auth/signup", data);
      toast.success(res.data.message || "Check your email to verify!");
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Signup failed");
      return false;
    } finally {
      set({ isSigningUp: false });
    }
  },

  // ✅ VERIFY EMAIL
  verifyEmail: async (token) => {
    set({ isVerifying: true });
    try {
      const res = await axiosInstance.get(`/api/auth/verify-email?token=${token}`);
      toast.success(res.data.message || "Verified! You can now login.");
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
      const user = res.data;

      set({
        authUser: user,
        needsProfileUpdate: !user.profilePic || user.profilePic === "",
      });

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
      set({ authUser: null, needsProfileUpdate: false });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error("Error logging out");
    }
  },

  // ✅ UPDATE PROFILE (IMPORTANT)
 // ✅ UPDATE PROFILE (PIC + NAME + PASSWORD)
updateProfile: async (data) => {
  try {
    const res = await axiosInstance.put("/api/auth/update-profile", data);

    // clear popup dismissal when profile pic is uploaded
    if (res.data.profilePic) {
      sessionStorage.removeItem("profilePicPromptDismissed");
    }

    set((state) => ({
      authUser: {
        ...state.authUser,
        ...res.data,
      },
      needsProfileUpdate: !res.data.profilePic,
    }));

    toast.success("Profile updated successfully!");
  } catch (error) {
    toast.error(error?.response?.data?.message || "Profile update failed");
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
    set({ socket: newSocket });

    newSocket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  // ✅ SOCKET DISCONNECT
  disconnectSocket: () => {
    const socket = get().socket;
    if (socket?.connected) socket.disconnect();
    set({ socket: null });
  },
}));
