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

    // CHECK FOR EXISTING ACCOUNTS
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.isVerified) {
        // Permanent user exists
        return res.status(400).json({ message: "Email already exists" });
      } else {
        // User exists but is unverified; clear old record to allow fresh signup
        await User.deleteOne({ _id: existingUser._id });
        console.log(`♻️ Cleared unverified stale account for: ${email}`);
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const verificationToken = crypto.randomBytes(20).toString("hex");

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      verificationToken,
      isVerified: false,
    });

    await newUser.save();
    
    try {
      await sendVerificationEmail(newUser.email, verificationToken);
    } catch (error) {
      console.error("Failed to send verification email:", error);
    }

    res.status(201).json({
      message: "Registration successful. Please check your email to verify your profile.",
    });

  } catch (error) {
    console.log("Error in signup controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --- LOGIN LOGIC (WITH BLOCK & ACTIVITY CHECKS) ---
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // SECURITY CHECK: BLOCKED USERS
    if (user.isBlocked) {
      return res.status(403).json({ 
        message: "This account has been suspended for suspicious activity. Contact support." 
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isVerified) {
      return res.status(403).json({ 
        message: "Account not verified. Please check your email." 
      });
    }

    // TRACK ACTIVITY FOR ADMIN PANEL
    user.lastLogin = new Date();
    await user.save();

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      role: user.role, // Essential for Frontend Admin Access
    });
  } catch (error) {
    console.error("Error in login controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --- EMAIL VERIFICATION ---
export const verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired verification token" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully. You can now login." });
  } catch (error) {
    console.error("Error in verifyEmail:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// --- ADMIN PANEL CONTROLLERS ---

export const getAllUsers = async (req, res) => {
  try {
    // Fetch all users except the current admin
    const users = await User.find({ _id: { $ne: req.user._id } }).select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const toggleBlockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role === "admin") return res.status(400).json({ message: "Cannot block an admin" });

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.status(200).json({ 
      message: `User ${user.isBlocked ? "blocked" : "unblocked"} successfully`,
      isBlocked: user.isBlocked 
    });
  } catch (error) {
    console.error("Error in toggleBlockUser:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --- PROFILE & AUTH UTILS ---

export const logout = (_, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    maxAge: 0,
  });
  res.status(200).json({ message: "Logged out successfully" });
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    if (!profilePic) return res.status(400).json({ message: "Profile pic is required" });
    const userId = req.user._id;
    
    const uploadResponse = await cloudinary.uploader.upload(profilePic, {
        folder: "chatify_profiles",
    });
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );
    
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};