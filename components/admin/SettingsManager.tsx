"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/admin/client";
import { A, Area, Btn, Card, Field } from "./ui";

export default function SettingsManager() {
  const [site, setSite] = useState({ siteName: "", siteDescription: "", telegramBotToken: "", telegramChatId: "", telegramConfigured: false });
  const [contact, setContact] = useState({ phone: "", email: "", address: "", workingHours: "", vk: "", max: "" });
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const s = await api.get("/api/settings");
        setSite((v) => ({ ...v, siteName: s.siteName ?? "", siteDescription: s.siteDescription ?? "", telegramConfigured: s.telegramConfigured }));
        const c = await api.get<{ data: any }>("/api/contact-info");
        if (c.data) setContact({
          phone: c.data.phone ?? "", email: c.data.email ?? "", address: c.data.address ?? "", workingHours: c.data.workingHours ?? "",
          vk: c.data.vk ?? "", max: c.data.max ?? "",
        });
      } catch (e) { setErr(e instanceof Error ? e.message : "Ошибка загрузки"); }
    })();
  }, []);

  const sset = (k: keyof typeof site) => (v: string) => setSite((f) => ({ ...f, [k]: v }));
  const cset = (k: keyof typeof contact) => (v: string) => setContact((f) => ({ ...f, [k]: v }));

  async function saveSite() {
    setMsg(""); setErr("");
    try {
      await api.put("/api/settings", {
        siteName: site.siteName, siteDescription: site.siteDescription,
        telegramBotToken: site.telegramBotToken || undefined, telegramChatId: site.telegramChatId || undefined,
      });
      setSite((v) => ({ ...v, telegramBotToken: "", telegramChatId: "", telegramConfigured: v.telegramConfigured || (!!site.telegramBotToken && !!site.telegramChatId) }));
      setMsg("Настройки сайта сохранены");
    } catch (e) { setErr(e instanceof Error ? e.message : "Ошибка"); }
  }
  async function saveContact() {
    setMsg(""); setErr("");
    try {
      await api.put("/api/contact-info", contact);
      setMsg("Контакты сохранены");
    } catch (e) { setErr(e instanceof Error ? e.message : "Ошибка"); }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {msg && <div style={{ fontSize: 13, color: A.eco, background: "rgba(74,107,54,.1)", padding: "8px 12px", borderRadius: 10 }}>{msg}</div>}
      {err && <div style={{ fontSize: 13, color: A.danger }}>{err}</div>}

      <Card>
        <h3 style={{ margin: "0 0 12px", fontSize: 16, color: A.ink }}>Сайт и уведомления</h3>
        <Field label="Название сайта" value={site.siteName} onChange={sset("siteName")} />
        <Area label="Описание сайта" value={site.siteDescription} onChange={sset("siteDescription")} rows={2} />
        <div style={{ fontSize: 12.5, color: site.telegramConfigured ? A.eco : A.muted, marginBottom: 8 }}>
          Telegram-уведомления о заявках: {site.telegramConfigured ? "настроены ✓" : "не настроены"}
        </div>
        <Field label="Telegram Bot Token" value={site.telegramBotToken} onChange={sset("telegramBotToken")} placeholder="оставьте пустым, чтобы не менять" hint="хранится в зашифрованном виде" />
        <Field label="Telegram Chat ID" value={site.telegramChatId} onChange={sset("telegramChatId")} placeholder="оставьте пустым, чтобы не менять" />
        <Btn onClick={saveSite}>Сохранить настройки</Btn>
      </Card>

      <Card>
        <h3 style={{ margin: "0 0 12px", fontSize: 16, color: A.ink }}>Контактная информация</h3>
        <Field label="Телефон" value={contact.phone} onChange={cset("phone")} required />
        <Field label="Адрес" value={contact.address} onChange={cset("address")} required />
        <Field label="Режим работы" value={contact.workingHours} onChange={cset("workingHours")} placeholder="Ежедневно 9:00–20:00" />
        <Field label="Email" value={contact.email} onChange={cset("email")} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Field label="VK" value={contact.vk} onChange={cset("vk")} placeholder="имя_группы или ссылка" hint="напр. gips31 или https://vk.com/gips31" />
          <Field label="MAX (ссылка)" value={contact.max} onChange={cset("max")} placeholder="https://max.ru/..." hint="ссылка на профиль/канал MAX" />
        </div>
        <Btn onClick={saveContact}>Сохранить контакты</Btn>
      </Card>
    </div>
  );
}
