import { prisma } from "@/lib/prisma";
import { productUpdateSchema } from "@/lib/server/validation";
import { sanitizeHtmlContent } from "@/lib/server/sanitize";
import { ok, fail, zodFail, requireSession } from "@/lib/server/api";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id }, include: { category: true } });
  if (!product) return fail("Товар не найден", 404);
  return ok(product);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireSession("EDITOR");
  if (guard instanceof NextResponse) return guard;

  const { id } = await params;
  const parsed = productUpdateSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return zodFail(parsed.error);

  const d = parsed.data;
  const data: Record<string, unknown> = { ...d };
  if (d.htmlContent !== undefined) data.htmlContent = d.htmlContent ? sanitizeHtmlContent(d.htmlContent) : null;

  await prisma.product.update({ where: { id }, data });
  return ok({ message: "Товар обновлён" });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireSession("EDITOR");
  if (guard instanceof NextResponse) return guard;

  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  return ok({ message: "Товар удалён" });
}
