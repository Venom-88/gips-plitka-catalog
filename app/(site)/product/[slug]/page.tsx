import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import ImageSlot from "@/components/ImageSlot";
import ProductCard from "@/components/ProductCard";
import LeadForm from "@/components/LeadForm";
import { ArrowRight, BITTER } from "@/components/icons";
import { getProductBySlug, getRelatedProducts, getAllProductSlugs } from "@/lib/catalog";
import { STATUS_BG, formatPrice, priceUnitLabel } from "@/lib/types";

export const revalidate = 60;

export async function generateStaticParams() {
  const rows = await getAllProductSlugs();
  return rows.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return { title: "Товар не найден" };
  return {
    title: p.seoTitle ?? p.title,
    description: p.seoDescription ?? p.description ?? undefined,
    alternates: { canonical: `/product/${p.slug}` },
  };
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "10px 0", borderBottom: "1px solid rgba(33,28,23,.08)" }}>
      <span style={{ fontSize: 12.5, color: "#8C7E68" }}>{label}</span>
      <span style={{ fontSize: 12.5, color: "#211C17", fontWeight: 600, textAlign: "right" }}>{value}</span>
    </div>
  );
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) notFound();

  const related = await getRelatedProducts(p.categoryId, p.id);
  const colorCount = p.colors.length + p.extraColors;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.title,
    description: p.description ?? undefined,
    sku: p.article ?? undefined,
    category: p.category?.title,
    brand: { "@type": "Brand", name: "Гипс Стиль 31" },
    offers: {
      "@type": "Offer",
      price: p.priceFrom,
      priceCurrency: "RUB",
      availability: p.inStock ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
      url: `https://gips-style-31.ru/product/${p.slug}`,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="gx" style={{ paddingTop: 18, paddingBottom: 8, background: "#F1E9DB" }}>
        <Breadcrumbs
          items={[
            { href: "/", label: "Главная" },
            { href: "/catalog", label: "Каталог" },
            ...(p.category ? [{ href: `/catalog/${p.category.slug}`, label: p.category.title }] : []),
            { label: p.title },
          ]}
        />

        <div className="product-top">
        <div className="p-media">
        {/* Галерея */}
        <div className="p-hero-img" style={{ margin: "14px 0 8px" }}>
          <ImageSlot src={p.imageUrl} height="100%" priority placeholder={p.title} alt={p.title} style={{ height: "100%" }} objectPosition={p.imagePos} />
          {p.status && (
            <div
              style={{
                position: "absolute",
                top: 12,
                left: 12,
                background: STATUS_BG[p.status] ?? "#211C17",
                color: "#FBF6EC",
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: ".05em",
                padding: "5px 10px",
                borderRadius: 100,
                textTransform: "uppercase",
              }}
            >
              {p.status}
            </div>
          )}
        </div>
        {p.gallery.length > 0 && (
          <div className="no-scrollbar" style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 6 }}>
            {p.gallery.map((g, i) => (
              <ImageSlot key={i} src={g} width={72} height={72} radius={10} placeholder="" alt={`${p.title} — фото ${i + 2}`} style={{ flex: "none" }} />
            ))}
          </div>
        )}
        </div>

        <div>
        {/* Заголовок / цена */}
        <h1 style={{ fontFamily: BITTER, fontWeight: 800, fontSize: 25, color: "#211C17", margin: "10px 0 4px", lineHeight: 1.12 }}>{p.title}</h1>
        <div style={{ fontSize: 12, color: "#8C7E68", marginBottom: 12 }}>
          {p.article ? `арт. ${p.article}` : ""}
          {p.article && p.category ? " · " : ""}
          {p.category ? p.category.title : ""}
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 11, color: "#8C7E68" }}>от</div>
            <div style={{ fontFamily: BITTER, fontWeight: 800, fontSize: 30, color: "#211C17", lineHeight: 1 }}>
              {formatPrice(p.priceFrom)} ₽<span style={{ fontSize: 14, fontWeight: 500, color: "#8C7E68" }}>{priceUnitLabel(p.unit)}</span>
            </div>
          </div>
          <span
            style={{
              fontSize: 11.5,
              fontWeight: 600,
              color: p.inStock ? "#4A6B36" : "#B5552F",
              background: p.inStock ? "rgba(74,107,54,.12)" : "rgba(181,85,47,.12)",
              padding: "6px 12px",
              borderRadius: 100,
            }}
          >
            {p.inStock ? "● В наличии" : "● Под заказ"}
          </span>
        </div>

        {/* Цвета */}
        {p.colors.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11.5, color: "#6F6253", marginBottom: 7 }}>Цвета{colorCount ? ` · ${colorCount}` : ""}</div>
            <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
              {p.colors.map((c, i) => (
                <span key={i} title={c} style={{ width: 26, height: 26, borderRadius: "50%", background: c, boxShadow: "0 0 0 1px rgba(0,0,0,.12)" }} />
              ))}
              {p.extraColors > 0 && (
                <span style={{ fontSize: 12, color: "#8C7E68", alignSelf: "center" }}>+{p.extraColors}</span>
              )}
            </div>
          </div>
        )}

        {/* CTA */}
        <a
          href="#order"
          className="press-98 lift"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            background: "#D99A2B",
            color: "#211C17",
            fontWeight: 700,
            fontSize: 15,
            padding: 15,
            borderRadius: 14,
            boxShadow: "0 8px 20px -6px rgba(217,154,43,.7)",
            marginBottom: 18,
          }}
        >
          Заказать и рассчитать метраж
          <ArrowRight size={17} stroke="#211C17" width={2.2} />
        </a>

        {/* Описание */}
        {p.description && (
          <>
            <h2 style={{ fontFamily: BITTER, fontWeight: 700, fontSize: 17, color: "#211C17", margin: "0 0 8px" }}>Описание</h2>
            <p style={{ fontSize: 13.5, lineHeight: 1.6, color: "#5C5040", margin: "0 0 16px" }}>{p.description}</p>
          </>
        )}

        {/* Характеристики */}
        <h2 style={{ fontFamily: BITTER, fontWeight: 700, fontSize: 17, color: "#211C17", margin: "0 0 4px" }}>Характеристики</h2>
        <div style={{ marginBottom: 16 }}>
          {p.size && <Spec label="Размер элемента" value={p.size} />}
          {p.coverage != null && <Spec label="Расход в упаковке" value={`${p.coverage} м²`} />}
          {p.weight && <Spec label="Вес" value={p.weight} />}
          {p.material && <Spec label="Материал" value={p.material} />}
          <Spec label="Цена" value={`от ${formatPrice(p.priceFrom)} ₽${priceUnitLabel(p.unit)}`} />
        </div>

        {/* Богатый контент из админки */}
        {p.htmlContent && (
          <div
            style={{ fontSize: 13.5, lineHeight: 1.6, color: "#5C5040", marginBottom: 8 }}
            dangerouslySetInnerHTML={{ __html: p.htmlContent }}
          />
        )}
        </div>
        </div>
      </section>

      {/* Похожие */}
      {related.length > 0 && (
        <section className="gx" style={{ paddingTop: 12, paddingBottom: 8, background: "#F1E9DB" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14 }}>
            <h2 style={{ fontFamily: BITTER, fontWeight: 800, fontSize: 20, color: "#211C17", margin: 0 }}>Похожие товары</h2>
            {p.category && (
              <Link href={`/catalog/${p.category.slug}`} className="link-amber" style={{ fontSize: 12.5, color: "#B97E1E", fontWeight: 600 }}>
                Вся категория →
              </Link>
            )}
          </div>
          <div className="grid-products">
            {related.slice(0, 4).map((r) => (
              <ProductCard key={r.id} p={r} />
            ))}
          </div>
        </section>
      )}

      {/* Форма заказа */}
      <div id="order" style={{ scrollMarginTop: 64 }}>
        <LeadForm source="product" productSlug={p.slug} />
      </div>
    </>
  );
}
