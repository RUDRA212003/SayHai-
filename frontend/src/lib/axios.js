import axios from "axios";

// Use VITE_API_URL as the canonical API base URL. Set this in your Vercel/Render
// environment variables (e.g. https://your-backend.com/api). For local dev, set
// VITE_API_URL in a local .env (e.g. VITE_API_URL=http://localhost:3000/api).
const API_BASE = import.meta.env.VITE_API_URL || "";

export const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// Export helpers for other modules (e.g. socket connection)
export const apiBaseUrl = API_BASE; // may be empty string in environments where not set
export const socketBaseUrl = API_BASE.replace(/\/api\/?$/i, "");
