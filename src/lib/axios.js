import axios from "axios";

// Fallback to localhost:3000 if the environment variable isn't loaded
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const axiosInstance = axios.create({
  // Adding /api here means you don't have to repeat it in your store actions
  baseURL: `${API_BASE}/api`, 
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiBaseUrl = API_BASE;
export const socketBaseUrl = API_BASE;