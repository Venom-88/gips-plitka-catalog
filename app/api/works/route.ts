import { prisma } from "@/lib/prisma";
import { workSchema } from "@/lib/server/validation";
import { ok, zodFail, requireSession } from "@/lib/server/api";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const featured = searchParams.get("featured");
  const works = await prisma.work.findMany({
    where: featured === "1" ? { featured: true } : {},
    orderBy: { sortOrder: "asc" },
  });
  return ok({ data: works });
}

export async function POST(req: Request) {
  const guard = await requireSession("EDITOR");
  if (guard instanceof NextResponse) return guard;

  const parsed = workSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return zodFail(parsed.error);

  const d = parsed.data;
  const work = await prisma.work.create({ data: { ...d, imageUrl: d.imageUrl || null } });
  return ok({ id: work.id, slug: work.slug }, 201);
}
