import crypto from "crypto"; // Native Node.js module for secret tokens
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { ENV } from "../lib/env.js";
import cloudinary from "../lib/cloudinary.js";
import { sendVerificationEmail } from "../lib/email.js"; // Import your new helper

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

    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 1. GENERATE SECURE TOKEN
    const verificationToken = crypto.randomBytes(20).toString("hex");

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      verificationToken, // Save the token
      isVerified: false, // Ensure they start unverified
    });

    if (newUser) {
      await newUser.save();
      
      // 2. SEND VERIFICATION EMAIL (Instead of logging them in)
      try {
        await sendVerificationEmail(newUser.email, verificationToken);
      } catch (error) {
        console.error("Failed to send verification email:", error);
      }

      // 3. DO NOT CALL generateToken(newUser._id, res) HERE
      // We want them to verify first.
      res.status(201).json({
        message: "Registration successful. Please check your email to verify your profile.",
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

    // 4. BLOCK UNVERIFIED USERS
    if (!user.isVerified) {
      return res.status(403).json({ 
        message: "Account not verified. Please check your email for the verification link." 
      });
    }

    // 5. LOGIN ONLY IF VERIFIED
    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error("Error in login controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 6. NEW: THE VERIFICATION CONTROLLER
export const verifyEmail = async (req, res) => {
  const { token } = req.query; // Takes token from the URL ?token=...

  try {
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired verification token" });
    }

    user.isVerified = true;
    user.verificationToken = undefined; // Remove token once used
    await user.save();

    res.status(200).json({ message: "Email verified successfully. You can now login." });
  } catch (error) {
    console.error("Error in verifyEmail:", error);
    res.status(500).json({ message: "Server error" });
  }
};

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
    const updatedUser = await User.findByIdAndUpdate(userId,{ profilePic: uploadResponse.secure_url },{ new: true });
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