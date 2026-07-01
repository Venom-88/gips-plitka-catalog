import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import About from "@/components/About";
import Process from "@/components/Process";
import Advantages from "@/components/Advantages";
import B2B from "@/components/B2B";
import { getSiteImages } from "@/lib/catalog";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "О студии",
  description:
    "«Гипс Стиль 31» — небольшая студия гипсовой плитки ручной работы в Губкине. Малые партии, ручная тонировка, подбор цвета под интерьер и нестандартные размеры под заказ.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const images = await getSiteImages();
  return (
    <>
      <div className="gx" style={{ paddingTop: 18, background: "#F1E9DB" }}>
        <Breadcrumbs items={[{ href: "/", label: "Главная" }, { label: "О студии" }]} />
      </div>
      <About imageUrl={images.aboutImageUrl} imagePos={images.aboutImagePos} />
      <Advantages />
      <Process />
      <B2B />
    </>
  );
}
