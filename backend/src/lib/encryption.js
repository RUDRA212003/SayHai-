import crypto from "crypto";
import { ENV } from "./env.js";

const ENCRYPTION_KEY =
  ENV.ENCRYPTION_KEY || "your-default-secret-key-change-this-in-env";

const ALGORITHM = "aes-256-gcm";

// Ensure key is exactly 32 bytes for AES-256
const getEncryptionKey = () => {
  let key = ENCRYPTION_KEY;

  if (key.length < 32) {
    key = key.padEnd(32, "0");
  } else if (key.length > 32) {
    key = key.slice(0, 32);
  }

  return Buffer.from(key);
};

// -------------------- ENCRYPT --------------------
export const encryptMessage = (text) => {
  if (!text) return null;

  try {
    const iv = crypto.randomBytes(16);
    const key = getEncryptionKey();

    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    const authTag = cipher.getAuthTag();

    // FORMAT: iv:encrypted:authTag
    return `${iv.toString("hex")}:${encrypted}:${authTag.toString("hex")}`;
  } catch {
    // Fail-safe: never crash chat
    return text;
  }
};

// -------------------- DECRYPT --------------------
export const decryptMessage = (payload) => {
  try {
    if (!payload || typeof payload !== "string") return payload;

    const parts = payload.split(":");

    // Legacy or plain text message
    if (parts.length !== 3) return payload;

    // MUST match encrypt order
    const [ivHex, encrypted, authTagHex] = parts;

    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");
    const key = getEncryptionKey();

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch {
    // Old/broken messages → return as-is, no logs, no crash
    return payload;
  }
};
