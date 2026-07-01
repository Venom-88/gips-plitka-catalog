import { prisma } from "@/lib/prisma";
import { comparePassword, signToken, AUTH_COOKIE, authCookieOptions } from "@/lib/server/auth";
import { loginSchema } from "@/lib/server/validation";
import { ok, fail, zodFail } from "@/lib/server/api";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const parsed = loginSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return zodFail(parsed.error);

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return fail("Неверный email или пароль", 401);

  const valid = await comparePassword(password, user.password);
  if (!valid) return fail("Неверный email или пароль", 401);

  const token = signToken({ userId: user.id, role: user.role });
  const res = ok({
    user: { id: user.id, email: user.email, name: user.name, role: user.role, permissions: user.permissions },
  });
  res.cookies.set(AUTH_COOKIE, token, authCookieOptions);
  return res;
}
