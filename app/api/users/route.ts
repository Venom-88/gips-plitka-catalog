import { prisma } from "@/lib/prisma";
import { userSchema } from "@/lib/server/validation";
import { hashPassword } from "@/lib/server/auth";
import { ok, fail, zodFail, requireSession } from "@/lib/server/api";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const guard = await requireSession("ADMIN");
  if (guard instanceof NextResponse) return guard;

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, email: true, role: true, permissions: true, createdAt: true },
  });
  return ok({ data: users });
}

export async function POST(req: Request) {
  const guard = await requireSession("ADMIN");
  if (guard instanceof NextResponse) return guard;

  const parsed = userSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return zodFail(parsed.error);
  const d = parsed.data;

  const exists = await prisma.user.findUnique({ where: { email: d.email } });
  if (exists) return fail("Пользователь с таким email уже существует", 409);

  const user = await prisma.user.create({
    data: {
      name: d.name,
      email: d.email,
      password: await hashPassword(d.password),
      role: d.role ?? "VIEWER",
      permissions: d.permissions ?? [],
    },
    select: { id: true, email: true, name: true, role: true },
  });
  return ok(user, 201);
}
