import ImageSlot from "./ImageSlot";
import { BITTER } from "./icons";

function WorkTile({ height, span, label, wmSize = 11 }: { height: number; span?: "row" | "col"; label: string; wmSize?: number }) {
  return (
    <div
      style={{
        position: "relative",
        borderRadius: 14,
        overflow: "hidden",
        ...(span === "row" ? { gridRow: "span 2" } : {}),
        ...(span === "col" ? { gridColumn: "1 / -1" } : {}),
      }}
    >
      <ImageSlot src={null} height={height} placeholder={label} alt={`Работа студии: ${label}`} />
      <div className="wm">
        <span style={{ fontSize: wmSize }}>Гипс Стиль 31</span>
      </div>
    </div>
  );
}

export default function Works() {
  return (
    <section className="gx" style={{ paddingTop: 32, paddingBottom: 8, background: "#211C17", marginTop: 24 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".14em", color: "#D99A2B", textTransform: "uppercase", marginBottom: 5 }}>
        Портфолио
      </div>
      <h2 className="t-h2" style={{ fontFamily: BITTER, fontWeight: 800, color: "#FBF6EC", margin: "0 0 4px" }}>Наши работы</h2>
      <p style={{ fontSize: 12.5, color: "rgba(251,246,236,.6)", margin: "0 0 16px" }}>Реальные интерьеры с плиткой студии</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>
        <WorkTile height={235} span="row" label="Объект 1" wmSize={15} />
        <WorkTile height={113} label="Объект 2" />
        <WorkTile height={113} label="Объект 3" />
        <WorkTile height={113} label="Объект 4" />
        <WorkTile height={113} label="Объект 5" />
        <WorkTile height={120} span="col" label="Объект 6" wmSize={15} />
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
