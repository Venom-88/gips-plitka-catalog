import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-change-in-production";
const JWT_EXPIRES_IN = "7d";
export const AUTH_COOKIE = "token";

export type Session = { userId: string; role: string };

export function signToken(payload: Session): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): Session | null {
  try {
    return jwt.verify(token, JWT_SECRET) as Session;
  } catch {
    return null;
  }
}

export function hashPassword(pw: string): Promise<string> {
  return bcrypt.hash(pw, 10);
}

export function comparePassword(pw: string, hash: string): Promise<boolean> {
  return bcrypt.compare(pw, hash);
}

/** Текущая сессия из httpOnly cookie (для route handlers и server components). */
export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  const token = store.get(AUTH_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

/** Роли по возрастанию прав. */
const RANK: Record<string, number> = { VIEWER: 1, EDITOR: 2, ADMIN: 3 };

export function hasRole(session: Session | null, min: "VIEWER" | "EDITOR" | "ADMIN"): boolean {
  if (!session) return false;
  return (RANK[session.role] ?? 0) >= RANK[min];
}

export const authCookieOptions = {
  httpOnly: true as const,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 7 * 24 * 60 * 60, // 7 дней (сек)
};
