import Link from "next/link";
import ImageSlot from "./ImageSlot";
import { ArrowRight, BITTER } from "./icons";
import { STATUS_BG, formatPrice, priceUnitLabel, type ProductCardData } from "@/lib/types";

function Card({ p }: { p: ProductCardData }) {
  const colorCount = p.colors.length + p.extraColors;
  return (
    <Link
      href={`/product/${p.slug}`}
      className="lift"
      style={{
        flex: "none",
        width: 200,
        scrollSnapAlign: "start",
        background: "#FBF6EC",
        border: "1px solid rgba(33,28,23,.08)",
        borderRadius: 18,
        overflow: "hidden",
        display: "block",
      }}
    >
      <div style={{ position: "relative" }}>
        <ImageSlot src={p.imageUrl} height={150} placeholder={p.title} alt={p.title} objectPosition={p.imagePos} />
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
      <div style={{ padding: "13px 14px 15px" }}>
        <div style={{ fontFamily: BITTER, fontWeight: 700, fontSize: 15, color: "#211C17" }}>{p.title}</div>
        <div style={{ fontSize: 10.5, color: "#8C7E68", marginTop: 2 }}>
          {p.article ? `арт. ${p.article}` : ""}
          {p.article && colorCount > 0 ? " · " : ""}
          {colorCount > 0 ? `${colorCount} цветов` : ""}
        </div>
        {p.colors.length > 0 && (
          <div style={{ display: "flex", gap: 5, marginTop: 9 }}>
            {p.colors.slice(0, 4).map((c, i) => (
              <span key={i} style={{ width: 16, height: 16, borderRadius: "50%", background: c, boxShadow: "0 0 0 1px rgba(0,0,0,.1)" }} />
            ))}
            {p.extraColors > 0 && <span style={{ fontSize: 10, color: "#8C7E68", alignSelf: "center" }}>+{p.extraColors}</span>}
          </div>
        )}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: 13 }}>
          <div>
            <div style={{ fontSize: 10, color: "#8C7E68" }}>от</div>
            <div style={{ fontFamily: BITTER, fontWeight: 800, fontSize: 19, color: "#211C17" }}>
              {formatPrice(p.priceFrom)} ₽<span style={{ fontSize: 11, fontWeight: 500, color: "#8C7E68" }}>{priceUnitLabel(p.unit)}</span>
            </div>
          </div>
          <span
            aria-hidden="true"
            style={{ width: 40, height: 40, borderRadius: 12, background: "#D99A2B", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <ArrowRight size={18} stroke="#211C17" width={2.2} />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function Bestsellers({ products }: { products: ProductCardData[] }) {
  if (products.length === 0) return null;
  return (
    <section style={{ padding: "30px 0 8px", background: "#F1E9DB" }}>
      <div className="gx" style={{ marginBottom: 15 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".14em", color: "#B97E1E", textTransform: "uppercase", marginBottom: 5 }}>
          Выбор покупателей
        </div>
        <h2 className="t-h2" style={{ fontFamily: BITTER, fontWeight: 800, color: "#211C17", margin: 0 }}>Хиты и новинки</h2>
      </div>
      <div
        className="no-scrollbar gx"
        style={{ display: "flex", gap: 13, overflowX: "auto", paddingTop: 4, paddingBottom: 14, scrollSnapType: "x mandatory" }}
      >
        {products.map((p) => (
          <Card key={p.id} p={p} />
        ))}
      </div>
      <div className="gx">
        <Link
          href="/catalog"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 7,
            border: "1.5px solid rgba(33,28,23,.18)",
            color: "#211C17",
            fontWeight: 600,
            fontSize: 14,
            padding: 13,
            borderRadius: 13,
          }}
        >
          Весь каталог <ArrowRight size={15} stroke="#211C17" width={2} />
        </Link>
      </div>
    </section>
  );
}
