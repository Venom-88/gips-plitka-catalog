import ImageSlot from "./ImageSlot";
import { BITTER } from "./icons";

type WorkItem = { id: string; title: string; imageUrl: string | null; imagePos: string | null };

const SLOTS: { height: number; span?: "row" | "col"; wmSize: number }[] = [
  { height: 235, span: "row", wmSize: 15 },
  { height: 113, wmSize: 11 },
  { height: 113, wmSize: 11 },
  { height: 113, wmSize: 11 },
  { height: 113, wmSize: 11 },
  { height: 120, span: "col", wmSize: 15 },
];

function WorkTile({ slot, work, i }: { slot: (typeof SLOTS)[number]; work?: WorkItem; i: number }) {
  return (
    <div
      style={{
        position: "relative",
        borderRadius: 14,
        overflow: "hidden",
        ...(slot.span === "row" ? { gridRow: "span 2" } : {}),
        ...(slot.span === "col" ? { gridColumn: "1 / -1" } : {}),
      }}
    >
      <ImageSlot
        src={work?.imageUrl ?? null}
        objectPosition={work?.imagePos}
        height={slot.height}
        placeholder={work?.title ?? `Объект ${i + 1}`}
        alt={`Работа студии: ${work?.title ?? `объект ${i + 1}`}`}
      />
      <div className="wm">
        <span style={{ fontSize: slot.wmSize }}>Гипс Стиль 31</span>
      </div>
    </div>
  );
}

export default function Works({ works = [] }: { works?: WorkItem[] }) {
  return (
    <section className="gx" style={{ paddingTop: 32, paddingBottom: 8, background: "#211C17", marginTop: 24 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".14em", color: "#D99A2B", textTransform: "uppercase", marginBottom: 5 }}>
        Портфолио
      </div>
      <h2 className="t-h2" style={{ fontFamily: BITTER, fontWeight: 800, color: "#FBF6EC", margin: "0 0 4px" }}>Наши работы</h2>
      <p style={{ fontSize: 12.5, color: "rgba(251,246,236,.6)", margin: "0 0 16px" }}>Реальные интерьеры с плиткой студии</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>
        {SLOTS.map((slot, i) => (
          <WorkTile key={i} slot={slot} work={works[i]} i={i} />
        ))}
      </div>
      <a
        href="/gallery"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 7,
          marginTop: 14,
          border: "1.5px solid rgba(251,246,236,.22)",
          color: "#FBF6EC",
          fontWeight: 600,
          fontSize: 14,
          padding: 13,
          borderRadius: 13,
        }}
      >
        Открыть галерею работ
      </a>
    </section>
  );
}
