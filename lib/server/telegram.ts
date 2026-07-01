// Уведомление о заявке в Telegram (порт из донора, адаптирован под Гипс Стиль).
import { prisma } from "@/lib/prisma";
import { decrypt } from "./encryption";

type LeadNotify = {
  name: string;
  phone: string;
  email?: string | null;
  message?: string | null;
  source?: string | null;
  area?: number | null;
};

const SOURCE_LABEL: Record<string, string> = {
  form: "Форма расчёта",
  b2b: "B2B / партнёры",
  calc: "Калькулятор",
  product: "Карточка товара",
};

export async function notifyLead(data: LeadNotify): Promise<void> {
  try {
    // Токены берём из настроек (зашифрованы) или из env как fallback.
    const settings = await prisma.siteSettings.findFirst();
    const botToken = settings?.telegramBotToken ? decrypt(settings.telegramBotToken) : process.env.TELEGRAM_BOT_TOKEN;
    const chatId = settings?.telegramChatId ? decrypt(settings.telegramChatId) : process.env.TELEGRAM_CHAT_ID;
    if (!botToken || !chatId) return; // не настроено — тихо выходим

    const text = [
      "🔔 <b>Новая заявка — Гипс Стиль 31</b>",
      "",
      `👤 <b>Имя:</b> ${data.name}`,
      `📱 <b>Телефон:</b> ${data.phone}`,
      data.email ? `📧 <b>Email:</b> ${data.email}` : "",
      data.area ? `📐 <b>Площадь:</b> ${data.area} м²` : "",
      `💼 <b>Источник:</b> ${SOURCE_LABEL[data.source ?? "form"] ?? data.source}`,
      data.message ? `💬 <b>Комментарий:</b>\n${data.message}` : "",
      "",
      `🕐 ${new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" })}`,
    ]
      .filter(Boolean)
      .join("\n");

    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
    });
    if (!res.ok) console.error("Telegram API error:", await res.text());
  } catch (e) {
    // Не роняем заявку из-за Telegram
    console.error("notifyLead error:", e);
  }
}
