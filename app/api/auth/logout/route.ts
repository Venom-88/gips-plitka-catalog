import { AUTH_COOKIE } from "@/lib/server/auth";
import { ok } from "@/lib/server/api";

export const runtime = "nodejs";

export async function POST() {
  const res = ok({ message: "Выход выполнен" });
  res.cookies.set(AUTH_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
