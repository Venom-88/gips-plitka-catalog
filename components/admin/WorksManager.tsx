"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/admin/client";
import { A, Area, Btn, Card, Empty, Field, Pill, Toggle } from "./ui";
import ImageField from "./ImageField";

type Work = {
  id: string; slug: string; title: string; description: string | null; tag: string | null;
  imageUrl: string | null; imagePos: string | null; year: number | null; featured: boolean; sortOrder: number;
};

const empty = { slug: "", title: "", tag: "", description: "", imageUrl: "", imagePos: "50% 50%", year: "", featured: false, sortOrder: "0" };

export default function WorksManager() {
  const [items, setItems] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [form, setForm] = useState({ ...empty });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    setLoading(true);
    const r = await api.get<{ data: Work[] }>("/api/works");
    setItems(r.data);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));
  function startNew() { setForm({ ...empty }); setErr(""); setEditing("new"); }
  function startEdit(w: Work) {
    setForm({ slug: w.slug, title: w.title, tag: w.tag ?? "", description: w.description ?? "", imageUrl: w.imageUrl ?? "", imagePos: w.imagePos ?? "50% 50%", year: w.year != null ? String(w.year) : "", featured: w.featured, sortOrder: String(w.sortOrder) });
    setErr(""); setEditing(w.id);
  }
  function payload() {
    return {
      slug: form.slug.trim(), title: form.title.trim(), tag: form.tag.trim() || null,
      description: form.description.trim() || null, imageUrl: form.imageUrl.trim() || null, imagePos: form.imagePos || null,
      year: form.year ? Number(form.year) : null, featured: form.featured, sortOrder: Number(form.sortOrder) || 0,
    };
  }
  async function save() {
    setBusy(true); setErr("");
    try {
      if (editing === "new") await api.post("/api/works", payload());
      else await api.put(`/api/works/${editing}`, payload());
      setEditing(null); await load();
    } catch (e) { setErr(e instanceof Error ? e.message : "Ошибка"); } finally { setBusy(false); }
  }
  async function remove(id: string) {
    if (!confirm("Удалить работу?")) return;
    await api.del(`/api/works/${id}`); setItems((xs) => xs.filter((x) => x.id !== id));
  }

  if (loading) return <Empty>Загрузка…</Empty>;

  if (editing) {
    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h3 style={{ margin: 0, fontSize: 17, color: A.ink }}>{editing === "new" ? "Новая работа" : "Работа"}</h3>
          <Btn variant="ghost" size="sm" onClick={() => setEditing(null)}>← Назад</Btn>
        </div>
        <Card>
          <Field label="Slug (URL)" value={form.slug} onChange={set("slug")} placeholder="loft-kitchen" required />
          <Field label="Название" value={form.title} onChange={set("title")} required />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label="Тег" value={form.tag} onChange={set("tag")} placeholder="Кухня" />
            <Field label="Год" value={form.year} onChange={set("year")} type="number" />
          </div>
          <Field label="Порядок" value={form.sortOrder} onChange={set("sortOrder")} type="number" />
          <Area label="Описание" value={form.description} onChange={set("description")} rows={3} />
          <ImageField label="Фото работы" value={form.imageUrl} onChange={set("imageUrl")} pos={form.imagePos} onPosChange={set("imagePos")} aspect={4 / 3} />
          <Toggle label="Крупная (в начале галереи)" checked={form.featured} onChange={(v) => setForm((f) => ({ ...f, featured: v }))} />
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
        <div style={{ fontSize: 12.5, color: A.muted }}>Работ: {items.length}</div>
        <Btn onClick={startNew}>+ Добавить</Btn>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((w) => (
          <Card key={w.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12 }}>
            <div style={{ flex: "none", width: 48, height: 48, borderRadius: 10, overflow: "hidden", background: "#E7DECE", border: `1px solid ${A.border}` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {w.imageUrl && <img src={w.imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: A.ink }}>{w.title}</div>
              <div style={{ display: "flex", gap: 6, marginTop: 4, flexWrap: "wrap" }}>
                {w.tag && <Pill>{w.tag}</Pill>}
                {w.year && <Pill>{w.year}</Pill>}
                {w.featured && <Pill color={A.amberDark} bg="rgba(217,154,43,.16)">крупная</Pill>}
              </div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <Btn variant="ghost" size="sm" onClick={() => startEdit(w)}>Изм.</Btn>
              <Btn variant="danger" size="sm" onClick={() => remove(w.id)}>×</Btn>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
