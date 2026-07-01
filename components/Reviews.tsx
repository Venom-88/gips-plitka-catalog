import ImageSlot from "./ImageSlot";
import { BITTER } from "./icons";
import type { ReviewData } from "@/lib/types";

const SOURCE_STYLE: Record<string, { bg: string; color: string }> = {
  VK: { bg: "#E8EEF6", color: "#2B5C9E" },
  Авито: { bg: "#EAF3E6", color: "#4A6B36" },
};

export default function Reviews({ reviews }: { reviews: ReviewData[] }) {
  if (reviews.length === 0) return null;
  return (
    <section style={{ padding: "14px 0 8px", background: "#F1E9DB" }}>
      <div className="gx" style={{ marginBottom: 14 }}>
        <h2 className="t-h2" style={{ fontFamily: BITTER, fontWeight: 800, color: "#211C17", margin: 0 }}>Отзывы клиентов</h2>
      </div>
      <div
        className="no-scrollbar gx"
        style={{ display: "flex", gap: 13, overflowX: "auto", paddingTop: 2, paddingBottom: 14, scrollSnapType: "x mandatory" }}
      >
        {reviews.map((r) => {
          const chip = SOURCE_STYLE[r.source] ?? { bg: "#EEE7DA", color: "#6F6253" };
          return (
            <div
              key={r.id}
              style={{
                flex: "none",
                width: 262,
                scrollSnapAlign: "start",
                background: "#FBF6EC",
                border: "1px solid rgba(33,28,23,.08)",
                borderRadius: 18,
                padding: 16,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 11 }}>
                <ImageSlot src={r.avatarUrl} width={44} height={44} shape="circle" placeholder="Фото" alt={r.name} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13.5, color: "#211C17" }}>{r.name}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 3,
                        background: chip.bg,
                        color: chip.color,
                        fontSize: 9.5,
                        fontWeight: 700,
                        padding: "2px 7px",
                        borderRadius: 100,
                      }}
                    >
                      {r.source}
                    </span>
                    <span style={{ color: "#D99A2B", fontSize: 12, letterSpacing: 1 }} aria-label={`Оценка ${r.rating} из 5`}>
                      {"★".repeat(r.rating)}
                    </span>
                  </div>
                </div>
              </div>
              <p style={{ fontSize: 12.5, lineHeight: 1.55, color: "#5C5040", margin: 0 }}>{r.text}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
