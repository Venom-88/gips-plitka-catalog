import CryptoJS from "crypto-js";

// AES-256 шифрование персональных данных (crypto-js). Порт из донора.
// Прозрачная расшифровка: зашифрованные строки crypto-js начинаются с "U2FsdGVk".
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "default-key-change-me-in-prod";

export function encrypt(text: string | null | undefined): string {
  if (!text) return "";
  return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
}

export function decrypt(encryptedText: string | null | undefined): string {
  if (!encryptedText) return "";
  // Не похоже на шифртекст crypto-js — возвращаем как есть (совместимость со старыми данными)
  if (!encryptedText.startsWith("U2FsdGVk")) return encryptedText;
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedText, ENCRYPTION_KEY);
    const result = bytes.toString(CryptoJS.enc.Utf8);
    return result || "[зашифровано]";
  } catch {
    return "[зашифровано]";
  }
}

export function validateEncryptionKey(): boolean {
  if (!ENCRYPTION_KEY || ENCRYPTION_KEY === "default-key-change-me-in-prod") {
    console.warn("⚠️ ENCRYPTION_KEY не задан — используется небезопасный дефолт. Задайте его в .env / Vercel.");
    return false;
  }
  return ENCRYPTION_KEY.length >= 16;
}
