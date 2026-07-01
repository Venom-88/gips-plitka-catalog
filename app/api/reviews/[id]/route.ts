import { prisma } from "@/lib/prisma";
import { reviewUpdateSchema } from "@/lib/server/validation";
import { ok, zodFail, requireSession } from "@/lib/server/api";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireSession("EDITOR");
  if (guard instanceof NextResponse) return guard;

  const { id } = await params;
  const parsed = reviewUpdateSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return zodFail(parsed.error);

  await prisma.review.update({ where: { id }, data: parsed.data });
  return ok({ message: "Отзыв обновлён" });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireSession("EDITOR");
  if (guard instanceof NextResponse) return guard;

  const { id } = await params;
  await prisma.review.delete({ where: { id } });
  return ok({ message: "Отзыв удалён" });
}
