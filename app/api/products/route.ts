import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/server/validation";
import { sanitizeHtmlContent } from "@/lib/server/sanitize";
import { ok, zodFail, requireSession } from "@/lib/server/api";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

// GET /api/products — список (с фильтрами ?category= &bestseller=1 &q=)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const bestseller = searchParams.get("bestseller");
  const q = searchParams.get("q");

  const products = await prisma.product.findMany({
    where: {
      ...(category ? { category: { slug: category } } : {}),
      ...(bestseller === "1" ? { isBestseller: true } : {}),
      ...(q
        ? { OR: [{ title: { contains: q, mode: "insensitive" } }, { article: { contains: q, mode: "insensitive" } }] }
        : {}),
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    include: { category: { select: { slug: true, title: true } } },
  });
  return ok({ data: products });
}

// POST /api/products — создать (админ)
export async function POST(req: Request) {
  const guard = await requireSession("EDITOR");
  if (guard instanceof NextResponse) return guard;

  const parsed = productSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return zodFail(parsed.error);

  const d = parsed.data;
  const product = await prisma.product.create({
    data: {
      ...d,
      imageUrl: d.imageUrl || null,
      htmlContent: d.htmlContent ? sanitizeHtmlContent(d.htmlContent) : null,
    },
  });
  return ok({ id: product.id, slug: product.slug }, 201);
}
