import { ArrowRight, BITTER, HexOutline } from "./icons";

export default function B2B() {
  return (
    <section className="gx" style={{ paddingTop: 8, paddingBottom: 22, background: "#F1E9DB" }}>
      <div style={{ position: "relative", background: "#2E2720", borderRadius: 22, padding: "24px 20px", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -26, bottom: -26, opacity: 0.5 }}>
          <HexOutline size={130} stroke="#D99A2B" width={0.7} nested />
        </div>
        <div style={{ position: "relative" }}>
          <div
            style={{
              display: "inline-block",
              background: "rgba(217,154,43,.16)",
              color: "#ECB23F",
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: ".08em",
              padding: "5px 11px",
              borderRadius: 100,
              textTransform: "uppercase",
              marginBottom: 13,
            }}
          >
            B2B · партнёрам
          </div>
          <h2 className="t-h2" style={{ fontFamily: BITTER, fontWeight: 800, color: "#FBF6EC", margin: "0 0 9px" }}>
            Дизайнерам и декораторам
          </h2>
          <p style={{ fontSize: 13, lineHeight: 1.55, color: "rgba(251,246,236,.72)", margin: "0 0 16px" }}>
            Специальные цены, образцы фактур, индивидуальный подбор колера под проект и приоритетные сроки. Работаем с
            дизайнерами интерьера и отделочными бригадами.
          </p>
          <a
            href="#form"
            className="press-98 lift"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#D99A2B",
              color: "#211C17",
              fontWeight: 700,
              fontSize: 14,
              padding: "13px 20px",
              borderRadius: 13,
            }}
          >
            Стать партнёром <ArrowRight size={15} stroke="#211C17" width={2.2} />
          </a>
        </div>
      </div>
    </section>
  );
}
