import Link from "next/link";
import ImageSlot from "./ImageSlot";
import { ArrowRight, BITTER } from "./icons";
import { STATUS_BG, formatPrice, priceUnitLabel, type ProductCardData } from "@/lib/types";

/** Карточка товара для сеток. Ведёт на страницу товара. */
export default function ProductCard({ p }: { p: ProductCardData }) {
  const colorCount = p.colors.length + p.extraColors;
  return (
    <Link
      href={`/product/${p.slug}`}
      className="lift"
      style={{
        display: "flex",
        flexDirection: "column",
        background: "#FBF6EC",
        border: "1px solid rgba(33,28,23,.08)",
        borderRadius: 18,
        overflow: "hidden",
      }}
    >
      <div style={{ position: "relative" }}>
        <ImageSlot src={p.imageUrl} height={140} placeholder={p.title} alt={p.title} objectPosition={p.imagePos} />
        {p.status && (
          <div
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              background: STATUS_BG[p.status] ?? "#211C17",
              color: "#FBF6EC",
              fontSize: 9.5,
              fontWeight: 800,
              letterSpacing: ".05em",
              padding: "4px 8px",
              borderRadius: 100,
              textTransform: "uppercase",
            }}
          >
            {p.status}
          </div>
        )}
      </div>
      <div style={{ padding: "12px 13px 14px", display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ fontFamily: BITTER, fontWeight: 700, fontSize: 15, color: "#211C17", lineHeight: 1.15 }}>{p.title}</div>
        <div style={{ fontSize: 10.5, color: "#8C7E68", marginTop: 3 }}>
          {p.article ? `арт. ${p.article}` : ""}
          {p.article && colorCount > 0 ? " · " : ""}
          {colorCount > 0 ? `${colorCount} цветов` : ""}
        </div>
        {p.colors.length > 0 && (
          <div style={{ display: "flex", gap: 5, marginTop: 9 }}>
            {p.colors.slice(0, 4).map((c, i) => (
              <span key={i} style={{ width: 15, height: 15, borderRadius: "50%", background: c, boxShadow: "0 0 0 1px rgba(0,0,0,.1)" }} />
            ))}
            {p.extraColors > 0 && <span style={{ fontSize: 10, color: "#8C7E68", alignSelf: "center" }}>+{p.extraColors}</span>}
          </div>
        )}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: "auto", paddingTop: 12 }}>
          <div>
            <div style={{ fontSize: 10, color: "#8C7E68" }}>от</div>
            <div style={{ fontFamily: BITTER, fontWeight: 800, fontSize: 18, color: "#211C17" }}>
              {formatPrice(p.priceFrom)} ₽
              <span style={{ fontSize: 11, fontWeight: 500, color: "#8C7E68" }}>{priceUnitLabel(p.unit)}</span>
            </div>
          </div>
          <span
            aria-hidden="true"
            style={{
              width: 34,
              height: 34,
              borderRadius: 11,
              background: "#D99A2B",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ArrowRight size={15} stroke="#211C17" width={2.2} />
          </span>
        </div>
      </div>
    </Link>
  );
}
