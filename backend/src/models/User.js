import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
    // --- VERIFICATION FIELDS ---
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      default: null,
    },
    // --- ADMIN & SECURITY FIELDS ---
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user", // Default to regular user
    },
    isBlocked: {
      type: Boolean,
      default: false, // User is active by default
    },
    lastLogin: {
      type: Date,
      default: Date.now, // To track activity in your admin panel
    },
    // -----------------------------------
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;