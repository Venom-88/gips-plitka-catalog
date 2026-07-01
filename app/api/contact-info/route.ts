import { prisma } from "@/lib/prisma";
import { contactInfoSchema } from "@/lib/server/validation";
import { ok, zodFail, requireSession } from "@/lib/server/api";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

// GET — публичная контактная информация
export async function GET() {
  const info = await prisma.contactInfo.findFirst();
  return ok({ data: info });
}

// PUT — админ
export async function PUT(req: Request) {
  const guard = await requireSession("EDITOR");
  if (guard instanceof NextResponse) return guard;

  const parsed = contactInfoSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return zodFail(parsed.error);
  const d = parsed.data;

  const existing = await prisma.contactInfo.findFirst();
  const data = {
    phone: d.phone,
    email: d.email || null,
    address: d.address,
    workingHours: d.workingHours || "Ежедневно 9:00–20:00",
    telegram: d.telegram || null,
    whatsapp: d.whatsapp || null,
    vk: d.vk || null,
    instagram: d.instagram || null,
  };

  if (existing) await prisma.contactInfo.update({ where: { id: existing.id }, data });
  else await prisma.contactInfo.create({ data });

  return ok({ message: "Контакты обновлены" });
}
