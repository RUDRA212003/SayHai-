import crypto from "crypto";
import { ENV } from "./env.js";

const ENCRYPTION_KEY = ENV.ENCRYPTION_KEY || "your-default-secret-key-change-this-in-env";
const ALGORITHM = "aes-256-gcm";

// Ensure key is 32 bytes for aes-256
const getEncryptionKey = () => {
  let key = ENCRYPTION_KEY;
  if (key.length < 32) {
    key = key.padEnd(32, "0");
  } else if (key.length > 32) {
    key = key.slice(0, 32);
  }
  return Buffer.from(key);
};

export const encryptMessage = (text) => {
  if (!text) return null;

  try {
    const iv = crypto.randomBytes(16);
    const key = getEncryptionKey();
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    const authTag = cipher.getAuthTag();

    // Return iv:encrypted:authTag combined
    return `${iv.toString("hex")}:${encrypted}:${authTag.toString("hex")}`;
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error("Failed to encrypt message");
  }
};

export const decryptMessage = (encryptedData) => {
  if (!encryptedData) return null;

  try {
    // Check if data is in encrypted format (contains colons)
    if (!encryptedData.includes(":")) {
      // It's plain text, return as is
      return encryptedData;
    }

    const parts = encryptedData.split(":");
    if (parts.length !== 3) {
      // Invalid format, return as plain text
      return encryptedData;
    }

    const iv = Buffer.from(parts[0], "hex");
    const encrypted = parts[1];
    const authTag = Buffer.from(parts[2], "hex");
    const key = getEncryptionKey();

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    console.error("Decryption error:", error);
    // If decryption fails, return the original data as plain text
    // This handles old unencrypted messages
    return encryptedData;
  }
};
