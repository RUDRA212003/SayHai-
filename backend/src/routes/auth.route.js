import express from "express";
import {
  signup,
  login,
  logout,
  updateProfile,
  verifyEmail,
  checkAuth,
  getAllUsers,
  toggleBlockUser,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = express.Router();

router.use(arcjetProtection);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/verify-email", verifyEmail);

router.put("/update-profile", protectRoute, updateProfile);
router.get("/check", protectRoute, checkAuth);

// Admin
router.get("/admin/users", protectRoute, isAdmin, getAllUsers);
router.put("/admin/users/:id/block", protectRoute, isAdmin, toggleBlockUser);

export default router;
