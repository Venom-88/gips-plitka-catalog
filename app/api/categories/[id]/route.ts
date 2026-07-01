import { prisma } from "@/lib/prisma";
import { categoryUpdateSchema } from "@/lib/server/validation";
import { ok, fail, zodFail, requireSession } from "@/lib/server/api";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = await prisma.category.findUnique({ where: { id }, include: { products: true } });
  if (!category) return fail("Категория не найдена", 404);
  return ok(category);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireSession("EDITOR");
  if (guard instanceof NextResponse) return guard;

  const { id } = await params;
  const parsed = categoryUpdateSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return zodFail(parsed.error);

  await prisma.category.update({ where: { id }, data: parsed.data });
  return ok({ message: "Категория обновлена" });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireSession("EDITOR");
  if (guard instanceof NextResponse) return guard;

  const { id } = await params;
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) return fail("Категория не найдена", 404);
  if (category.protected) return fail("Эту категорию нельзя удалить", 400);

  await prisma.category.delete({ where: { id } });
  return ok({ message: "Категория удалена" });
}
