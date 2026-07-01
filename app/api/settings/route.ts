import { prisma } from "@/lib/prisma";
import { settingsSchema } from "@/lib/server/validation";
import { encrypt } from "@/lib/server/encryption";
import { ok, zodFail, requireSession } from "@/lib/server/api";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

// GET — админ. Токены не отдаём открытым текстом, только флаг «настроено».
export async function GET() {
  const guard = await requireSession("VIEWER");
  if (guard instanceof NextResponse) return guard;

  const s = await prisma.siteSettings.findFirst();
  return ok({
    siteName: s?.siteName ?? "Гипс Стиль 31",
    siteDescription: s?.siteDescription ?? "",
    telegramConfigured: Boolean(s?.telegramBotToken && s?.telegramChatId),
    heroImageUrl: s?.heroImageUrl ?? "",
    heroImagePos: s?.heroImagePos ?? "50% 50%",
    aboutImageUrl: s?.aboutImageUrl ?? "",
    aboutImagePos: s?.aboutImagePos ?? "50% 50%",
  });
}

// PUT — админ. Токены шифруются; пустая строка — оставить как есть.
export async function PUT(req: Request) {
  const guard = await requireSession("ADMIN");
  if (guard instanceof NextResponse) return guard;

  const parsed = settingsSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return zodFail(parsed.error);
  const d = parsed.data;

  const existing = await prisma.siteSettings.findFirst();
  const data = {
    siteName: d.siteName,
    siteDescription: d.siteDescription,
    telegramBotToken: d.telegramBotToken ? encrypt(d.telegramBotToken) : undefined,
    telegramChatId: d.telegramChatId ? encrypt(d.telegramChatId) : undefined,
    heroImageUrl: d.heroImageUrl === undefined ? undefined : d.heroImageUrl || null,
    heroImagePos: d.heroImagePos ?? undefined,
    aboutImageUrl: d.aboutImageUrl === undefined ? undefined : d.aboutImageUrl || null,
    aboutImagePos: d.aboutImagePos ?? undefined,
  };

  if (existing) await prisma.siteSettings.update({ where: { id: existing.id }, data });
  else await prisma.siteSettings.create({ data });

  return ok({ message: "Настройки сохранены" });
}
