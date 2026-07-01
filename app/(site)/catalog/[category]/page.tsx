import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductCard from "@/components/ProductCard";
import ImageSlot from "@/components/ImageSlot";
import { BITTER } from "@/components/icons";
import { getCategoryBySlug, getAllCategorySlugs, toCard } from "@/lib/catalog";

export const revalidate = 60;

export async function generateStaticParams() {
  const cats = await getAllCategorySlugs();
  return cats.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const cat = await getCategoryBySlug(category);
  if (!cat) return { title: "Категория не найдена" };
  return {
    title: cat.seoTitle ?? cat.title,
    description: cat.seoDescription ?? cat.description ?? undefined,
    alternates: { canonical: `/catalog/${cat.slug}` },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const cat = await getCategoryBySlug(category);
  if (!cat) notFound();

  const products = cat.products.map(toCard);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: "https://gips-style-31.ru/" },
      { "@type": "ListItem", position: 2, name: "Каталог", item: "https://gips-style-31.ru/catalog" },
      { "@type": "ListItem", position: 3, name: cat.title, item: `https://gips-style-31.ru/catalog/${cat.slug}` },
    ],
  };

  return (
    <section className="gx" style={{ paddingTop: 18, paddingBottom: 24, background: "#F1E9DB", minHeight: "60vh" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs
        items={[{ href: "/", label: "Главная" }, { href: "/catalog", label: "Каталог" }, { label: cat.title }]}
      />

      {/* Обложка категории */}
      <div style={{ position: "relative", borderRadius: 18, overflow: "hidden", height: 150, margin: "14px 0 16px" }}>
        <ImageSlot src={cat.imageUrl} height={150} placeholder={cat.title} alt={cat.title} objectPosition={cat.imagePos} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,rgba(33,28,23,.78) 0%,rgba(33,28,23,.2) 60%,transparent 100%)" }} />
        <div style={{ position: "absolute", left: 16, bottom: 14, right: 14 }}>
          <h1 style={{ fontFamily: BITTER, fontWeight: 800, fontSize: 24, color: "#FBF6EC", margin: 0, lineHeight: 1.1 }}>{cat.title}</h1>
          {cat.subtitle && <div style={{ fontSize: 12.5, color: "rgba(251,246,236,.82)", marginTop: 3 }}>{cat.subtitle}</div>}
        </div>
      </div>

      {cat.description && (
        <p style={{ fontSize: 13.5, lineHeight: 1.6, color: "#5C5040", margin: "0 0 20px" }}>{cat.description}</p>
      )}

      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ fontFamily: BITTER, fontWeight: 700, fontSize: 16, color: "#211C17" }}>
          Товары <span style={{ color: "#8C7E68", fontSize: 13 }}>({products.length})</span>
        </div>
        <Link href="/catalog" className="link-amber" style={{ fontSize: 12.5, color: "#B97E1E", fontWeight: 600 }}>
          Весь каталог →
        </Link>
      </div>

      {products.length > 0 ? (
        <div className="grid-products">
          {products.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      ) : (
        <p style={{ color: "#6F6253", fontSize: 13 }}>В этой категории пока нет товаров.</p>
      )}
    </section>
  );
}
