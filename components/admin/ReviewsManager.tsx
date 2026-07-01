"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/admin/client";
import { A, Area, Btn, Card, Empty, Field, Pill, Select, Toggle } from "./ui";
import ImageField from "./ImageField";

type Review = { id: string; name: string; source: string; rating: number; text: string; avatarUrl: string | null; published: boolean; sortOrder: number };

const empty = { name: "", source: "VK", rating: "5", text: "", avatarUrl: "", published: true, sortOrder: "0" };

export default function ReviewsManager() {
  const [items, setItems] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [form, setForm] = useState({ ...empty });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    setLoading(true);
    const r = await api.get<{ data: Review[] }>("/api/reviews");
    setItems(r.data);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));
  function startNew() { setForm({ ...empty }); setErr(""); setEditing("new"); }
  function startEdit(r: Review) {
    setForm({ name: r.name, source: r.source, rating: String(r.rating), text: r.text, avatarUrl: r.avatarUrl ?? "", published: r.published, sortOrder: String(r.sortOrder) });
    setErr(""); setEditing(r.id);
  }
  function payload() {
    return { name: form.name.trim(), source: form.source.trim(), rating: Number(form.rating) || 5, text: form.text.trim(), avatarUrl: form.avatarUrl.trim() || null, published: form.published, sortOrder: Number(form.sortOrder) || 0 };
  }
  async function save() {
    setBusy(true); setErr("");
    try {
      if (editing === "new") await api.post("/api/reviews", payload());
      else await api.put(`/api/reviews/${editing}`, payload());
      setEditing(null); await load();
    } catch (e) { setErr(e instanceof Error ? e.message : "Ошибка"); } finally { setBusy(false); }
  }
  async function remove(id: string) {
    if (!confirm("Удалить отзыв?")) return;
    await api.del(`/api/reviews/${id}`); setItems((xs) => xs.filter((x) => x.id !== id));
  }

  if (loading) return <Empty>Загрузка…</Empty>;

  if (editing) {
    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h3 style={{ margin: 0, fontSize: 17, color: A.ink }}>{editing === "new" ? "Новый отзыв" : "Отзыв"}</h3>
          <Btn variant="ghost" size="sm" onClick={() => setEditing(null)}>← Назад</Btn>
        </div>
        <Card>
          <Field label="Имя" value={form.name} onChange={set("name")} required />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Select label="Источник" value={form.source} onChange={set("source")} options={[{ value: "VK", label: "VK" }, { value: "Авито", label: "Авито" }, { value: "Google", label: "Google" }, { value: "Яндекс", label: "Яндекс" }]} />
            <Select label="Оценка" value={form.rating} onChange={set("rating")} options={[5, 4, 3, 2, 1].map((n) => ({ value: String(n), label: "★".repeat(n) }))} />
          </div>
          <Area label="Текст отзыва" value={form.text} onChange={set("text")} rows={4} />
          <ImageField label="Аватар" value={form.avatarUrl} onChange={set("avatarUrl")} />
          <Field label="Порядок" value={form.sortOrder} onChange={set("sortOrder")} type="number" />
          <Toggle label="Опубликован" checked={form.published} onChange={(v) => setForm((f) => ({ ...f, published: v }))} />
          {err && <div style={{ fontSize: 12.5, color: A.danger, marginBottom: 10 }}>{err}</div>}
          <div style={{ display: "flex", gap: 10 }}>
            <Btn onClick={save} disabled={busy}>{busy ? "Сохраняем…" : "Сохранить"}</Btn>
            <Btn variant="ghost" onClick={() => setEditing(null)}>Отмена</Btn>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ fontSize: 12.5, color: A.muted }}>Отзывов: {items.length}</div>
        <Btn onClick={startNew}>+ Добавить</Btn>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((r) => (
          <Card key={r.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: A.ink }}>
                {r.name} <span style={{ color: A.amber }}>{"★".repeat(r.rating)}</span>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <Pill>{r.source}</Pill>
                {!r.published && <Pill color={A.danger} bg="rgba(181,85,47,.12)">скрыт</Pill>}
              </div>
            </div>
            <div style={{ fontSize: 12.5, color: "#5C5040", lineHeight: 1.5, margin: "8px 0 10px" }}>{r.text}</div>
            <div style={{ display: "flex", gap: 6 }}>
              <Btn variant="ghost" size="sm" onClick={() => startEdit(r)}>Изм.</Btn>
              <Btn variant="danger" size="sm" onClick={() => remove(r.id)}>Удалить</Btn>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
