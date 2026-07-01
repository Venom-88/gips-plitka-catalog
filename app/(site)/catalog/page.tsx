import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import CatalogBrowser from "@/components/CatalogBrowser";
import { BITTER } from "@/components/icons";
import { getAllProductCards, getCategoriesWithCounts } from "@/lib/catalog";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Каталог гипсовой плитки",
  description:
    "Полный каталог гипсовой плитки ручной работы: декоративный кирпич, камень и сланец, 3D-мозаика и соты, угловые элементы, расходники. Фильтр по категориям, поиск, подбор цвета.",
  alternates: { canonical: "/catalog" },
};

export default async function CatalogPage() {
  const [products, categories] = await Promise.all([getAllProductCards(), getCategoriesWithCounts()]);
  const catOptions = categories.map((c) => ({ slug: c.slug, title: c.title, count: c.productCount ?? 0 }));

  return (
    <section className="gx" style={{ paddingTop: 18, paddingBottom: 24, background: "#F1E9DB", minHeight: "60vh" }}>
      <Breadcrumbs items={[{ href: "/", label: "Главная" }, { label: "Каталог" }]} />
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".14em", color: "#B97E1E", textTransform: "uppercase", margin: "14px 0 5px" }}>
        Каталог
      </div>
      <h1 style={{ fontFamily: BITTER, fontWeight: 800, fontSize: 27, color: "#211C17", margin: "0 0 8px", lineHeight: 1.1 }}>
        Гипсовая плитка ручной работы
      </h1>
      <p style={{ fontSize: 13.5, lineHeight: 1.6, color: "#5C5040", margin: "0 0 20px" }}>
        Отливаем малыми партиями и тонируем вручную. Подбираем цвет под ваш интерьер бесплатно, режем нестандартные
        форматы под заказ. Выберите категорию или найдите позицию по названию и артикулу.
      </p>
      <CatalogBrowser products={products} categories={catOptions} />
    </section>
  );
}
