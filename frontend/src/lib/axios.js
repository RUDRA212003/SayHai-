import axios from "axios";

// IMPORTANT: set `VITE_API_URL` to your backend origin (no trailing `/api`).
// Example in Vercel/Render environment variables: `VITE_API_URL=https://your-backend.com`
const API_BASE = import.meta.env.VITE_API_URL || "";

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
