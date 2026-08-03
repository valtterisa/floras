import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "crypto";

const ALGO = "aes-256-gcm";
const IV_LENGTH = 12;
const KEY_LENGTH = 32;
const SALT = "floras-byok-v1";

function getKey(): Buffer {
  const secret = process.env.BYOK_ENCRYPTION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("BYOK_ENCRYPTION_SECRET is missing or too short");
  }
  return scryptSync(secret, SALT, KEY_LENGTH);
}

export function encryptApiKey(plaintext: string): string {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGO, getKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("base64url");
}

export function decryptApiKey(ciphertext: string): string {
  const buf = Buffer.from(ciphertext, "base64url");
  if (buf.length < IV_LENGTH + 16 + 1) {
    throw new Error("Invalid ciphertext");
  }
  const iv = buf.subarray(0, IV_LENGTH);
  const tag = buf.subarray(IV_LENGTH, IV_LENGTH + 16);
  const data = buf.subarray(IV_LENGTH + 16);
  const decipher = createDecipheriv(ALGO, getKey(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(data), decipher.final()]).toString(
    "utf8"
  );
}

export function apiKeyLast4(key: string): string {
  const trimmed = key.trim();
  return trimmed.slice(-4);
}

export function looksLikeAnthropicKey(key: string): boolean {
  const trimmed = key.trim();
  return (
    trimmed.startsWith("sk-ant-") &&
    trimmed.length >= 20 &&
    trimmed.length <= 256
  );
}
