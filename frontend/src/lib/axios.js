import axios from "axios";

// IMPORTANT:
// VITE_API_URL must be ONLY the backend origin (NO /api)
// Example:
// VITE_API_URL=https://sayhai-backend.onrender.com
const API_BASE = import.meta.env.VITE_API_URL;

export const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional helpers
export const apiBaseUrl = API_BASE;
export const socketBaseUrl = API_BASE;
