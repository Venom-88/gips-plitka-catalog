import { prisma } from "@/lib/prisma";
import { userUpdateSchema } from "@/lib/server/validation";
import { hashPassword } from "@/lib/server/auth";
import { ok, fail, zodFail, requireSession } from "@/lib/server/api";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireSession("ADMIN");
  if (guard instanceof NextResponse) return guard;

  const { id } = await params;
  const parsed = userUpdateSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return zodFail(parsed.error);
  const d = parsed.data;

  const data: Record<string, unknown> = {
    name: d.name,
    email: d.email,
    role: d.role,
    permissions: d.permissions,
  };
  if (d.password) data.password = await hashPassword(d.password);

  await prisma.user.update({ where: { id }, data });
  return ok({ message: "Пользователь обновлён" });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireSession("ADMIN");
  if (guard instanceof NextResponse) return guard;

  const { id } = await params;
  // не даём удалить последнего администратора
  const admins = await prisma.user.count({ where: { role: "ADMIN" } });
  const target = await prisma.user.findUnique({ where: { id } });
  if (target?.role === "ADMIN" && admins <= 1) return fail("Нельзя удалить последнего администратора", 400);

  await prisma.user.delete({ where: { id } });
  return ok({ message: "Пользователь удалён" });
}
