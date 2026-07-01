import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/server/validation";
import { ok, zodFail, requireSession } from "@/lib/server/api";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });
  return ok({ data: categories });
}

export async function POST(req: Request) {
  const guard = await requireSession("EDITOR");
  if (guard instanceof NextResponse) return guard;

  const parsed = categorySchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return zodFail(parsed.error);

  const d = parsed.data;
  const category = await prisma.category.create({ data: { ...d, imageUrl: d.imageUrl || null } });
  return ok({ id: category.id, slug: category.slug }, 201);
}
