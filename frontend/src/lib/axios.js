import axios from "axios";

// This pulls from your .env. If .env is missing, it defaults to your local backend port.
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";

export const axiosInstance = axios.create({
  baseURL: API_BASE, 
  withCredentials: true, // Required to send cookies (JWT) to the backend
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional helpers for Socket.io and other components
export const apiBaseUrl = API_BASE;
export const socketBaseUrl = API_BASE;