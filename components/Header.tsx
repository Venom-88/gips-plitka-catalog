import Link from "next/link";
import { BITTER, LogoHex, Phone, ArrowRight } from "./icons";

const NAV = [
  { href: "/catalog", label: "Каталог" },
  { href: "/gallery", label: "Наши работы" },
  { href: "/about", label: "О студии" },
  { href: "/contacts", label: "Контакты" },
];

function Logo() {
  return (
    <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10 }} aria-label="Гипс Стиль 31 — на главную">
      <LogoHex size={38} digitSize={13} />
      <div style={{ lineHeight: 1 }}>
        <div style={{ fontFamily: BITTER, fontWeight: 800, fontSize: 15, letterSpacing: ".01em", color: "#211C17" }}>
          ГИПС СТИЛЬ <span style={{ color: "#B97E1E" }}>31</span>
        </div>
        <div style={{ fontSize: 10.5, color: "#6F6253", fontWeight: 500, marginTop: 3, letterSpacing: ".04em" }}>
          Гипсовая плитка · г. Губкин
        </div>
      </div>
    </Link>
  );
}

export default function Header() {
  return (
    <header
      className="gx"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        background: "rgba(241,233,219,.92)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(33,28,23,.10)",
      }}
    >
      {/* Мобильная шапка: лого + звонок (меню — в нижней панели) */}
      <div className="mobile-only" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 0" }}>
        <Logo />
        <a
          href="tel:+7"
          className="press-94 lift"
          aria-label="Позвонить"
          style={{ width: 40, height: 40, borderRadius: 11, background: "#211C17", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <Phone size={18} fill="#D99A2B" />
        </a>
      </div>

      {/* Десктопная шапка: лого + навигация + звонок + CTA */}
      <div className="desktop-only" style={{ alignItems: "center", justifyContent: "space-between", gap: 24, padding: "14px 0" }}>
        <Logo />
        <nav style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="nav-link" style={{ fontSize: 15, fontWeight: 600, color: "#211C17", transition: "color .15s" }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <a href="tel:+7" style={{ display: "flex", alignItems: "center", gap: 8, color: "#211C17", fontWeight: 700, fontSize: 15 }}>
            <span style={{ width: 34, height: 34, borderRadius: 10, background: "#211C17", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Phone size={16} fill="#D99A2B" />
            </span>
            +7 (XXX) XXX-XX-XX
          </a>
          <Link
            href="/contacts"
            className="lift"
            style={{ display: "flex", alignItems: "center", gap: 7, background: "#D99A2B", color: "#211C17", fontWeight: 700, fontSize: 14, padding: "11px 18px", borderRadius: 12, boxShadow: "0 8px 20px -8px rgba(217,154,43,.7)" }}
          >
            Оставить заявку <ArrowRight size={15} stroke="#211C17" width={2.2} />
          </Link>
        </div>
      </div>
    </header>
  );
}
