import crypto from "crypto";
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { ENV } from "../lib/env.js";
import cloudinary from "../lib/cloudinary.js";
import { sendVerificationEmail } from "../lib/email.js";

// --- SIGNUP LOGIC (WITH UNVERIFIED RETRY) ---
export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({ message: "Email already exists" });
      } else {
        await User.deleteOne({ _id: existingUser._id });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(20).toString("hex");

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      verificationToken,
      isVerified: false,
    });

    await newUser.save();
    await sendVerificationEmail(newUser.email, verificationToken);

    res.status(201).json({
      message: "Registration successful. Please check your email to verify your profile.",
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --- LOGIN LOGIC ---
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (user.isBlocked) {
      return res.status(403).json({
        message: "This account has been suspended. Contact support.",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Account not verified. Please check your email.",
      });
    }

    user.lastLogin = new Date();
    await user.save();

    // ✅ SET JWT COOKIE HERE (via utils.js)
    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      role: user.role,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --- EMAIL VERIFICATION ---
export const verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Verify email error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// --- ADMIN ---
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role === "admin") {
      return res.status(400).json({ message: "Cannot block admin" });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.status(200).json({
      message: `User ${user.isBlocked ? "blocked" : "unblocked"} successfully`,
      isBlocked: user.isBlocked,
    });
  } catch (error) {
    console.error("Toggle block error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --- LOGOUT (FIXED) ---
export const logout = (_, res) => {
  const isProduction = ENV.NODE_ENV === "production";

  res.cookie("jwt", "", {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    maxAge: 0,
  });

  res.status(200).json({ message: "Logged out successfully" });
};

// --- PROFILE ---
// --- PROFILE UPDATE (PIC + NAME + PASSWORD) ---
export const updateProfile = async (req, res) => {
  try {
    const { profilePic, fullName, currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // --- UPDATE FULL NAME ---
    if (fullName && fullName.trim().length < 2) {
      return res.status(400).json({ message: "Name is too short" });
    }

    // --- UPDATE PASSWORD ---
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          message: "Current password is required to change password",
        });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          message: "New password must be at least 6 characters",
        });
      }

      user.password = await bcrypt.hash(newPassword, 10);
    }

    // --- UPDATE PROFILE PICTURE ---
    if (profilePic) {
      const uploadResponse = await cloudinary.uploader.upload(profilePic, {
        folder: "chatify_profiles",
      });
      user.profilePic = uploadResponse.secure_url;
    }

    // --- UPDATE NAME ---
    if (fullName) {
      user.fullName = fullName;
    }

    await user.save();

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      role: user.role,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// --- CHECK AUTH ---
export const checkAuth = (req, res) => {
  res.status(200).json(req.user);
};
