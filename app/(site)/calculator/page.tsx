import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import Calculator from "@/components/Calculator";
import { BITTER } from "@/components/icons";
import { getCalculatorProducts } from "@/lib/catalog";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Калькулятор гипсовой плитки",
  description:
    "Рассчитайте количество гипсовой плитки, упаковок и стоимость по площади или размерам стен: запас на подрез, угловые элементы, клей, затирка и лак. Предварительная смета онлайн.",
  alternates: { canonical: "/calculator" },
};

export default async function CalculatorPage() {
  const products = await getCalculatorProducts();

  return (
    <section className="gx" style={{ paddingTop: 18, paddingBottom: 28, background: "#F1E9DB", minHeight: "60vh" }}>
      <Breadcrumbs items={[{ href: "/", label: "Главная" }, { label: "Калькулятор" }]} />
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".14em", color: "#B97E1E", textTransform: "uppercase", margin: "14px 0 5px" }}>
        Бесплатно
      </div>
      <h1 className="t-h1" style={{ fontFamily: BITTER, fontWeight: 800, color: "#211C17", margin: "0 0 8px" }}>
        Калькулятор плитки
      </h1>
      <p style={{ fontSize: 14, lineHeight: 1.6, color: "#5C5040", margin: "0 0 22px", maxWidth: 640 }}>
        Посчитайте площадь по размерам стен, добавьте запас на подрез, выберите товар и доборы — и получите
        ориентировочную смету. Оставьте контакты, и мы пришлём точный расчёт с подбором цвета.
      </p>

      {products.length > 0 ? (
        <Calculator products={products} />
      ) : (
        <p style={{ color: "#6F6253", fontSize: 14 }}>Каталог пока пуст — калькулятор станет доступен после добавления товаров.</p>
      )}
    </section>
  );
}
