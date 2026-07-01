"use client";

import { useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import { BITTER } from "./icons";
import type { ProductCardData } from "@/lib/types";

type CatOption = { slug: string; title: string; count: number };
type Sort = "pop" | "price-asc" | "price-desc";

export default function CatalogBrowser({
  products,
  categories,
  initialCategory = "all",
}: {
  products: ProductCardData[];
  categories: CatOption[];
  initialCategory?: string;
}) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState(initialCategory);
  const [sort, setSort] = useState<Sort>("pop");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products.filter((p) => {
      const okCat = cat === "all" || p.categorySlug === cat;
      const okQ =
        !q ||
        p.title.toLowerCase().includes(q) ||
        (p.article ?? "").toLowerCase().includes(q);
      return okCat && okQ;
    });
    if (sort === "price-asc") list = [...list].sort((a, b) => a.priceFrom - b.priceFrom);
    else if (sort === "price-desc") list = [...list].sort((a, b) => b.priceFrom - a.priceFrom);
    return list;
  }, [products, query, cat, sort]);

  return (
    <div>
      {/* Поиск */}
      <div style={{ position: "relative", marginBottom: 12 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ position: "absolute", left: 13, top: 13 }}>
          <circle cx="11" cy="11" r="7" stroke="#8C7E68" strokeWidth="1.7" />
          <path d="M20 20l-3.2-3.2" stroke="#8C7E68" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск: название или артикул"
          aria-label="Поиск по каталогу"
          style={{
            width: "100%",
            background: "#FBF6EC",
            border: "1px solid rgba(33,28,23,.12)",
            borderRadius: 12,
            padding: "12px 14px 12px 40px",
            fontSize: 14,
            fontFamily: "inherit",
            color: "#211C17",
            outline: "none",
          }}
          className="field"
        />
      </div>

      {/* Чипы категорий */}
      <div className="no-scrollbar" style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginBottom: 12 }}>
        <Chip active={cat === "all"} onClick={() => setCat("all")} label="Все" count={products.length} />
        {categories.map((c) => (
          <Chip key={c.slug} active={cat === c.slug} onClick={() => setCat(c.slug)} label={c.title} count={c.count} />
        ))}
      </div>

      {/* Сортировка + счётчик */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ fontSize: 12, color: "#8C7E68" }}>
          Найдено: <b style={{ color: "#211C17" }}>{filtered.length}</b>
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
          aria-label="Сортировка"
          style={{
            background: "#FBF6EC",
            border: "1px solid rgba(33,28,23,.12)",
            borderRadius: 10,
            padding: "8px 10px",
            fontSize: 12.5,
            fontFamily: "inherit",
            color: "#211C17",
            outline: "none",
          }}
        >
          <option value="pop">По популярности</option>
          <option value="price-asc">Сначала дешевле</option>
          <option value="price-desc">Сначала дороже</option>
        </select>
      </div>

      {/* Результаты */}
      {filtered.length > 0 ? (
        <div className="grid-products">
          {filtered.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "40px 16px", color: "#6F6253" }}>
          <div style={{ fontFamily: BITTER, fontWeight: 700, fontSize: 17, color: "#211C17", marginBottom: 6 }}>Ничего не найдено</div>
          <div style={{ fontSize: 13 }}>Попробуйте изменить запрос или сбросить фильтр категории.</div>
          <button
            onClick={() => {
              setQuery("");
              setCat("all");
            }}
            className="press-98"
            style={{ marginTop: 14, background: "#211C17", color: "#FBF6EC", border: "none", borderRadius: 12, padding: "11px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            Сбросить фильтры
          </button>
        </div>
      )}
    </div>
  );
}

function Chip({ active, onClick, label, count }: { active: boolean; onClick: () => void; label: string; count: number }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: "none",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "8px 13px",
        borderRadius: 100,
        border: active ? "1px solid #211C17" : "1px solid rgba(33,28,23,.14)",
        background: active ? "#211C17" : "#FBF6EC",
        color: active ? "#FBF6EC" : "#211C17",
        fontSize: 12.5,
        fontWeight: 600,
        cursor: "pointer",
        whiteSpace: "nowrap",
      }}
    >
      {label}
      <span style={{ fontSize: 10.5, opacity: 0.7 }}>{count}</span>
    </button>
  );
}
