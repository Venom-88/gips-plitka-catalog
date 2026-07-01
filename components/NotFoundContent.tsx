import Link from "next/link";
import { ArrowRight, BITTER, HexOutline } from "./icons";

export default function NotFoundContent() {
  return (
    <section style={{ padding: "60px 22px 80px", background: "#F1E9DB", minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", right: -30, top: 20, opacity: 0.12 }}>
        <HexOutline size={180} stroke="#211C17" width={1} nested />
      </div>
      <div style={{ position: "relative" }}>
        <div style={{ fontFamily: BITTER, fontWeight: 800, fontSize: 84, color: "#D99A2B", lineHeight: 1, letterSpacing: "-.02em" }}>404</div>
        <h1 style={{ fontFamily: BITTER, fontWeight: 800, fontSize: 24, color: "#211C17", margin: "10px 0 8px" }}>Страница не найдена</h1>
        <p style={{ fontSize: 14, lineHeight: 1.6, color: "#5C5040", margin: "0 0 24px", maxWidth: 320 }}>
          Возможно, страница переехала или её никогда не было. Вернитесь на главную или загляните в каталог плитки.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 280, margin: "0 auto" }}>
          <Link href="/" className="press-98 lift" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#D99A2B", color: "#211C17", fontWeight: 700, fontSize: 15, padding: 14, borderRadius: 14, boxShadow: "0 8px 20px -6px rgba(217,154,43,.7)" }}>
            На главную <ArrowRight size={17} stroke="#211C17" width={2.2} />
          </Link>
          <Link href="/catalog" className="press-98" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "transparent", border: "1.5px solid rgba(33,28,23,.2)", color: "#211C17", fontWeight: 600, fontSize: 15, padding: 14, borderRadius: 14 }}>
            В каталог
          </Link>
        </div>
      </div>
    </section>
  );
}
