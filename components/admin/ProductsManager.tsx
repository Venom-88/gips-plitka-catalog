"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/admin/client";
import { A, Area, Btn, Card, Empty, Field, Pill, Select, Toggle } from "./ui";
import ImageField from "./ImageField";
import GalleryField from "./GalleryField";

type Category = { id: string; title: string; slug: string };
type Product = {
  id: string; slug: string; title: string; article: string | null; status: string | null;
  priceFrom: number; unit: string; colors: string[]; extraColors: number; size: string | null;
  coverage: number | null; weight: string | null; material: string | null; description: string | null;
  imageUrl: string | null; imagePos: string | null; gallery: string[]; inStock: boolean; isBestseller: boolean; sortOrder: number; categoryId: string | null;
};

const empty = {
  slug: "", title: "", article: "", status: "", priceFrom: "", unit: "м²", colorsText: "",
  extraColors: "0", size: "", coverage: "", weight: "", material: "", description: "",
  imageUrl: "", imagePos: "50% 50%", inStock: true, isBestseller: false, sortOrder: "0", categoryId: "",
};

export default function ProductsManager() {
  const [items, setItems] = useState<Product[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [form, setForm] = useState({ ...empty });
  const [gallery, setGallery] = useState<string[]>([]);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    setLoading(true);
    const [p, c] = await Promise.all([api.get<{ data: Product[] }>("/api/products"), api.get<{ data: Category[] }>("/api/categories")]);
    setItems(p.data);
    setCats(c.data);
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  const catOptions = useMemo(
    () => [{ value: "", label: "— без категории —" }, ...cats.map((c) => ({ value: c.id, label: c.title }))],
    [cats]
  );

  function startNew() {
    setForm({ ...empty });
    setGallery([]);
    setErr("");
    setEditing("new");
  }
  function startEdit(p: Product) {
    setForm({
      slug: p.slug, title: p.title, article: p.article ?? "", status: p.status ?? "",
      priceFrom: String(p.priceFrom), unit: p.unit, colorsText: p.colors.join(", "),
      extraColors: String(p.extraColors), size: p.size ?? "", coverage: p.coverage != null ? String(p.coverage) : "",
      weight: p.weight ?? "", material: p.material ?? "", description: p.description ?? "",
      imageUrl: p.imageUrl ?? "", imagePos: p.imagePos ?? "50% 50%", inStock: p.inStock, isBestseller: p.isBestseller,
      sortOrder: String(p.sortOrder), categoryId: p.categoryId ?? "",
    });
    setGallery(p.gallery ?? []);
    setErr("");
    setEditing(p.id);
  }

  function payload() {
    const colors = form.colorsText.split(",").map((s) => s.trim()).filter(Boolean);
    return {
      slug: form.slug.trim(),
      title: form.title.trim(),
      article: form.article.trim() || null,
      status: form.status.trim() || null,
      priceFrom: Number(form.priceFrom) || 0,
      unit: form.unit || "м²",
      colors,
      extraColors: Number(form.extraColors) || 0,
      size: form.size.trim() || null,
      coverage: form.coverage ? Number(form.coverage) : null,
      weight: form.weight.trim() || null,
      material: form.material.trim() || null,
      description: form.description.trim() || null,
      imageUrl: form.imageUrl.trim() || null,
      imagePos: form.imagePos || null,
      gallery,
      inStock: form.inStock,
      isBestseller: form.isBestseller,
      sortOrder: Number(form.sortOrder) || 0,
      categoryId: form.categoryId || null,
    };
  }

  async function save() {
    setBusy(true);
    setErr("");
    try {
      if (editing === "new") await api.post("/api/products", payload());
      else await api.put(`/api/products/${editing}`, payload());
      setEditing(null);
      await load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Ошибка сохранения");
    } finally {
      setBusy(false);
    }
  }
  async function remove(id: string) {
    if (!confirm("Удалить товар?")) return;
    await api.del(`/api/products/${id}`);
    setItems((xs) => xs.filter((x) => x.id !== id));
  }

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  if (loading) return <Empty>Загрузка…</Empty>;

  if (editing) {
    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h3 style={{ margin: 0, fontSize: 17, color: A.ink }}>{editing === "new" ? "Новый товар" : "Редактирование товара"}</h3>
          <Btn variant="ghost" size="sm" onClick={() => setEditing(null)}>← Назад</Btn>
        </div>
        <Card>
          <Field label="Slug (URL)" value={form.slug} onChange={set("slug")} placeholder="kirpich-loft" required hint="только строчные латинские, цифры, дефис" />
          <Field label="Название" value={form.title} onChange={set("title")} required />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label="Артикул" value={form.article} onChange={set("article")} />
            <Select label="Статус" value={form.status} onChange={set("status")} options={[
              { value: "", label: "— нет —" }, { value: "Хит", label: "Хит" }, { value: "Новинка", label: "Новинка" }, { value: "Под заказ", label: "Под заказ" },
            ]} />
          </div>
          <Select label="Категория" value={form.categoryId} onChange={set("categoryId")} options={catOptions} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label="Цена от" value={form.priceFrom} onChange={set("priceFrom")} type="number" required />
            <Select label="Единица" value={form.unit} onChange={set("unit")} options={[{ value: "м²", label: "м²" }, { value: "шт", label: "шт" }, { value: "кг", label: "кг" }]} />
          </div>
          <Field label="Цвета (hex через запятую)" value={form.colorsText} onChange={set("colorsText")} placeholder="#C9B79A, #9C7B5B, #6E5A48" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label="Ещё цветов (+N)" value={form.extraColors} onChange={set("extraColors")} type="number" />
            <Field label="Порядок" value={form.sortOrder} onChange={set("sortOrder")} type="number" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label="Размер" value={form.size} onChange={set("size")} placeholder="210×65×16 мм" />
            <Field label="Расход, м²/упак" value={form.coverage} onChange={set("coverage")} type="number" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label="Вес" value={form.weight} onChange={set("weight")} placeholder="~9 кг/м²" />
            <Field label="Материал" value={form.material} onChange={set("material")} placeholder="Экологичный гипс" />
          </div>
          <Area label="Описание" value={form.description} onChange={set("description")} rows={5} />
          <ImageField label="Главное фото" value={form.imageUrl} onChange={set("imageUrl")} pos={form.imagePos} onPosChange={set("imagePos")} aspect={4 / 3} />
          <GalleryField value={gallery} onChange={setGallery} />
          <div style={{ display: "flex", gap: 20, marginTop: 4 }}>
            <Toggle label="В наличии" checked={form.inStock} onChange={(v) => setForm((f) => ({ ...f, inStock: v }))} />
            <Toggle label="Хит / на главную" checked={form.isBestseller} onChange={(v) => setForm((f) => ({ ...f, isBestseller: v }))} />
          </div>
          {err && <div style={{ fontSize: 12.5, color: A.danger, marginBottom: 10 }}>{err}</div>}
          <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
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
        <div style={{ fontSize: 12.5, color: A.muted }}>Товаров: {items.length}</div>
        <Btn onClick={startNew}>+ Добавить товар</Btn>
      </div>
      {items.length === 0 ? (
        <Empty>Товаров пока нет.</Empty>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {items.map((p) => (
            <Card key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12 }}>
              <div style={{ flex: "none", width: 48, height: 48, borderRadius: 10, overflow: "hidden", background: "#E7DECE", border: `1px solid ${A.border}` }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {p.imageUrl && <img src={p.imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: A.ink }}>{p.title}</div>
                <div style={{ display: "flex", gap: 6, marginTop: 4, flexWrap: "wrap" }}>
                  <Pill>от {p.priceFrom} ₽/{p.unit}</Pill>
                  {p.status && <Pill color={A.danger} bg="rgba(181,85,47,.12)">{p.status}</Pill>}
                  {p.isBestseller && <Pill color={A.amberDark} bg="rgba(217,154,43,.16)">хит</Pill>}
                </div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <Btn variant="ghost" size="sm" onClick={() => startEdit(p)}>Изм.</Btn>
                <Btn variant="danger" size="sm" onClick={() => remove(p.id)}>×</Btn>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
