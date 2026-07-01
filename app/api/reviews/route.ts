import { prisma } from "@/lib/prisma";
import { reviewSchema } from "@/lib/server/validation";
import { ok, zodFail, requireSession } from "@/lib/server/api";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const guard = await requireSession("VIEWER");
  if (guard instanceof NextResponse) return guard;
  const reviews = await prisma.review.findMany({ orderBy: { sortOrder: "asc" } });
  return ok({ data: reviews });
}

export async function POST(req: Request) {
  const guard = await requireSession("EDITOR");
  if (guard instanceof NextResponse) return guard;

  const parsed = reviewSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return zodFail(parsed.error);

  const review = await prisma.review.create({ data: { ...parsed.data, avatarUrl: parsed.data.avatarUrl || null } });
  return ok({ id: review.id }, 201);
}
