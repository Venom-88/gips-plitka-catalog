import { prisma } from "@/lib/prisma";
import { ok, fail, requireSession } from "@/lib/server/api";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const STATUSES = ["NEW", "IN_PROGRESS", "COMPLETED", "ARCHIVED"];

// PATCH /api/leads/:id — сменить статус
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireSession("EDITOR");
  if (guard instanceof NextResponse) return guard;

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const status = body?.status;
  if (!STATUSES.includes(status)) return fail("Недопустимый статус", 400);

  await prisma.lead.update({ where: { id }, data: { status } });
  return ok({ message: "Статус обновлён" });
}

// DELETE /api/leads/:id
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireSession("EDITOR");
  if (guard instanceof NextResponse) return guard;

  const { id } = await params;
  await prisma.lead.delete({ where: { id } });
  return ok({ message: "Заявка удалена" });
}
