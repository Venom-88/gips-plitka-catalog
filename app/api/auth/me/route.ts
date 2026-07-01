import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/server/auth";
import { ok, fail } from "@/lib/server/api";

export const runtime = "nodejs";

export async function GET() {
  const session = await getSession();
  if (!session) return fail("Не авторизован", 401);

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, email: true, role: true, permissions: true, createdAt: true },
  });
  if (!user) return fail("Пользователь не найден", 404);
  return ok({ user });
}
