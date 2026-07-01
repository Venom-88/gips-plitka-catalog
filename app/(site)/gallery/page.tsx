import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import ImageSlot from "@/components/ImageSlot";
import LeadForm from "@/components/LeadForm";
import { BITTER } from "@/components/icons";
import { getFeaturedWorks } from "@/lib/catalog";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Наши работы — портфолио интерьеров",
  description:
    "Реальные интерьеры с гипсовой плиткой студии «Гипс Стиль 31»: кухни, гостиные, кафе, прихожие. Портфолио выполненных работ ручной формовки.",
  alternates: { canonical: "/gallery" },
};

export default async function GalleryPage() {
  const works = await getFeaturedWorks();

  return (
    <>
      <section className="gx" style={{ paddingTop: 18, paddingBottom: 8, background: "#211C17" }}>
        <Breadcrumbs items={[{ href: "/", label: "Главная" }, { label: "Наши работы" }]} />
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".14em", color: "#D99A2B", textTransform: "uppercase", margin: "14px 0 5px" }}>
          Портфолио
        </div>
        <h1 style={{ fontFamily: BITTER, fontWeight: 800, fontSize: 26, color: "#FBF6EC", margin: "0 0 6px", lineHeight: 1.1 }}>Наши работы</h1>
        <p style={{ fontSize: 13, color: "rgba(251,246,236,.6)", margin: "0 0 18px", lineHeight: 1.5 }}>
          Реальные интерьеры с плиткой студии. Каждый объект — ручная формовка и подбор цвета под задачу клиента.
        </p>

        {works.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>
            {works.map((w, i) => {
              const big = w.featured || i === 0;
              return (
                <div
                  key={w.id}
                  style={{
                    position: "relative",
                    borderRadius: 14,
                    overflow: "hidden",
                    ...(big ? { gridColumn: "1 / -1" } : {}),
                  }}
                >
                  <ImageSlot src={w.imageUrl} height={big ? 200 : 130} placeholder={w.title} alt={`Работа студии: ${w.title}`} objectPosition={w.imagePos} />
                  <div className="wm">
                    <span style={{ fontSize: big ? 15 : 11 }}>Гипс Стиль 31</span>
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      bottom: 0,
                      padding: "18px 12px 10px",
                      background: "linear-gradient(180deg,transparent,rgba(33,28,23,.82))",
                    }}
                  >
                    <div style={{ fontFamily: BITTER, fontWeight: 700, fontSize: big ? 15 : 12.5, color: "#FBF6EC", lineHeight: 1.15 }}>{w.title}</div>
                    {w.tag && <div style={{ fontSize: 10.5, color: "rgba(251,246,236,.7)", marginTop: 2 }}>{w.tag}{w.year ? ` · ${w.year}` : ""}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p style={{ color: "rgba(251,246,236,.6)", fontSize: 13 }}>Портфолио скоро появится.</p>
        )}
      </section>

      <LeadForm source="form" />
    </>
  );
}
