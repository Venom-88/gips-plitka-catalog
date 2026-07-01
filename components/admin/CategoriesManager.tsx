"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/admin/client";
import { A, Area, Btn, Card, Empty, Field, Pill } from "./ui";
import ImageField from "./ImageField";

type Category = {
  id: string; slug: string; title: string; subtitle: string | null; description: string | null;
  priceFrom: number | null; badge: string | null; imageUrl: string | null; sortOrder: number;
  seoTitle: string | null; seoDescription: string | null; protected: boolean;
  imagePos: string | null;
  _count?: { products: number };
};

const empty = { slug: "", title: "", subtitle: "", description: "", priceFrom: "", badge: "", imageUrl: "", imagePos: "50% 50%", sortOrder: "0", seoTitle: "", seoDescription: "" };

export default function CategoriesManager() {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [form, setForm] = useState({ ...empty });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    setLoading(true);
    const r = await api.get<{ data: Category[] }>("/api/categories");
    setItems(r.data);
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  function startNew() { setForm({ ...empty }); setErr(""); setEditing("new"); }
  function startEdit(c: Category) {
    setForm({
      slug: c.slug, title: c.title, subtitle: c.subtitle ?? "", description: c.description ?? "",
      priceFrom: c.priceFrom != null ? String(c.priceFrom) : "", badge: c.badge ?? "", imageUrl: c.imageUrl ?? "", imagePos: c.imagePos ?? "50% 50%",
      sortOrder: String(c.sortOrder), seoTitle: c.seoTitle ?? "", seoDescription: c.seoDescription ?? "",
    });
    setErr(""); setEditing(c.id);
  }
  function payload() {
    return {
      slug: form.slug.trim(), title: form.title.trim(), subtitle: form.subtitle.trim() || null,
      description: form.description.trim() || null, priceFrom: form.priceFrom ? Number(form.priceFrom) : null,
      badge: form.badge.trim() || null, imageUrl: form.imageUrl.trim() || null, imagePos: form.imagePos || null, sortOrder: Number(form.sortOrder) || 0,
      seoTitle: form.seoTitle.trim() || null, seoDescription: form.seoDescription.trim() || null,
    };
  }
  async function save() {
    setBusy(true); setErr("");
    try {
      if (editing === "new") await api.post("/api/categories", payload());
      else await api.put(`/api/categories/${editing}`, payload());
      setEditing(null); await load();
    } catch (e) { setErr(e instanceof Error ? e.message : "Ошибка"); } finally { setBusy(false); }
  }
  async function remove(c: Category) {
    if (c.protected) return alert("Эту категорию нельзя удалить.");
    if (!confirm("Удалить категорию?")) return;
    try { await api.del(`/api/categories/${c.id}`); setItems((xs) => xs.filter((x) => x.id !== c.id)); }
    catch (e) { alert(e instanceof Error ? e.message : "Ошибка"); }
  }

  if (loading) return <Empty>Загрузка…</Empty>;

  if (editing) {
    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h3 style={{ margin: 0, fontSize: 17, color: A.ink }}>{editing === "new" ? "Новая категория" : "Категория"}</h3>
          <Btn variant="ghost" size="sm" onClick={() => setEditing(null)}>← Назад</Btn>
        </div>
        <Card>
          <Field label="Slug (URL)" value={form.slug} onChange={set("slug")} placeholder="decor-brick" required />
          <Field label="Название" value={form.title} onChange={set("title")} required />
          <Field label="Подзаголовок" value={form.subtitle} onChange={set("subtitle")} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label="Цена от" value={form.priceFrom} onChange={set("priceFrom")} type="number" />
            <Field label="Бейдж" value={form.badge} onChange={set("badge")} placeholder="Хит" />
          </div>
          <Field label="Порядок" value={form.sortOrder} onChange={set("sortOrder")} type="number" />
          <Area label="Описание (SEO-текст)" value={form.description} onChange={set("description")} rows={5} />
          <ImageField label="Обложка" value={form.imageUrl} onChange={set("imageUrl")} pos={form.imagePos} onPosChange={set("imagePos")} aspect={3 / 1} />
          <Field label="SEO title" value={form.seoTitle} onChange={set("seoTitle")} />
          <Area label="SEO description" value={form.seoDescription} onChange={set("seoDescription")} rows={2} />
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
        <div style={{ fontSize: 12.5, color: A.muted }}>Категорий: {items.length}</div>
        <Btn onClick={startNew}>+ Добавить</Btn>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((c) => (
          <Card key={c.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: A.ink }}>{c.title}</div>
              <div style={{ display: "flex", gap: 6, marginTop: 4, flexWrap: "wrap" }}>
                <Pill>/{c.slug}</Pill>
                <Pill>{c._count?.products ?? 0} товаров</Pill>
                {c.protected && <Pill color={A.muted}>защищена</Pill>}
              </div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <Btn variant="ghost" size="sm" onClick={() => startEdit(c)}>Изм.</Btn>
              <Btn variant="danger" size="sm" onClick={() => remove(c)}>×</Btn>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
