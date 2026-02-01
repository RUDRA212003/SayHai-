import express from "express";
import { signup, login, logout, updateProfile, verifyEmail, checkAuth } from "../controllers/auth.controller.js"; // Added verifyEmail & checkAuth
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = express.Router();

// Applying Arcjet protection to all auth routes
router.use(arcjetProtection);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// NEW: Verification Route
// This matches the link: http://localhost:5173/verify-email?token=...
router.get("/verify-email", verifyEmail);

router.put("/update-profile", protectRoute, updateProfile);

// Using the checkAuth controller we verified in the last step
router.get("/check", protectRoute, checkAuth);

export default router;