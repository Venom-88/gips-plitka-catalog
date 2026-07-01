import { prisma } from "@/lib/prisma";
import { workUpdateSchema } from "@/lib/server/validation";
import { ok, fail, zodFail, requireSession } from "@/lib/server/api";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireSession("EDITOR");
  if (guard instanceof NextResponse) return guard;

  const { id } = await params;
  const parsed = workUpdateSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return zodFail(parsed.error);

  await prisma.work.update({ where: { id }, data: parsed.data });
  return ok({ message: "Работа обновлена" });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireSession("EDITOR");
  if (guard instanceof NextResponse) return guard;

  const { id } = await params;
  await prisma.work.delete({ where: { id } });
  return ok({ message: "Работа удалена" });
}
