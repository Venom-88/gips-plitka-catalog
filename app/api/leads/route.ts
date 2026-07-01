import { prisma } from "@/lib/prisma";
import { leadSchema } from "@/lib/server/validation";
import { encryptLeadFields, decryptLead } from "@/lib/server/leads";
import { notifyLead } from "@/lib/server/telegram";
import { ok, fail, zodFail, requireSession } from "@/lib/server/api";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

// POST /api/leads — публичная отправка заявки
export async function POST(req: Request) {
  const parsed = leadSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return zodFail(parsed.error);

  const d = parsed.data;
  // honeypot: бот заполнил скрытое поле — делаем вид, что приняли
  if (d.company) return ok({ ok: true });

  const enc = encryptLeadFields({ name: d.name, phone: d.phone, email: d.email || null, message: d.message || null });
  const lead = await prisma.lead.create({
    data: {
      ...enc,
      area: d.area ?? null,
      productSlug: d.productSlug ?? null,
      source: d.source ?? "form",
      consent: true,
    },
  });

  // Уведомление в Telegram — по открытым данным, до шифрования
  await notifyLead({
    name: d.name,
    phone: d.phone,
    email: d.email || null,
    message: d.message || null,
    source: d.source ?? "form",
    area: d.area ?? null,
  });

  return ok({ ok: true, id: lead.id }, 201);
}

// GET /api/leads — список заявок (админ), с расшифровкой
export async function GET() {
  const guard = await requireSession("VIEWER");
  if (guard instanceof NextResponse) return guard;

  const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  return ok({ data: leads.map(decryptLead) });
}
