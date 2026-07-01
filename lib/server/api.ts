import { NextResponse } from "next/server";
import type { ZodError } from "zod";
import { getSession, hasRole, type Session } from "./auth";

export function ok<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function fail(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function zodFail(error: ZodError) {
  const msg = error.issues.map((i) => i.message).join("; ");
  return NextResponse.json({ error: msg || "Некорректные данные" }, { status: 400 });
}

/**
 * Гард авторизации для route handlers.
 * Возвращает сессию либо готовый ответ 401/403 — который handler должен вернуть.
 * Пример: const s = await requireSession("EDITOR"); if (s instanceof NextResponse) return s;
 */
export async function requireSession(
  min: "VIEWER" | "EDITOR" | "ADMIN" = "EDITOR"
): Promise<Session | NextResponse> {
  const session = await getSession();
  if (!session) return fail("Требуется авторизация", 401);
  if (!hasRole(session, min)) return fail("Недостаточно прав", 403);
  return session;
}
