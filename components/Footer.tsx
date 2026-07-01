import { BITTER, MaxMark, MAX_BG, VKMark, VK_BG } from "./icons";

const CAT_LINKS = [
  { href: "/catalog/decor-brick", label: "Декоративный кирпич" },
  { href: "/catalog/stone", label: "Камень / сланец" },
  { href: "/catalog/mosaic-3d", label: "3D-мозаика, соты" },
  { href: "/catalog/corners", label: "Угловые элементы" },
  { href: "/catalog/supplies", label: "Расходники" },
  { href: "/b2b", label: "Дизайнерам" },
];

const PAY = ["МИР", "СБП", "VISA", "Mastercard"];

export default function Footer() {
  return (
    <footer className="gx" style={{ background: "#1A1612", paddingTop: 28, paddingBottom: 22, color: "rgba(251,246,236,.7)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div style={{ position: "relative", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="36" height="36" viewBox="0 0 24 24">
            <path d="M12 1.5 21.2 6.8v10.4L12 22.5 2.8 17.2V6.8Z" fill="#D99A2B" />
          </svg>
          <span style={{ position: "absolute", fontFamily: BITTER, fontWeight: 800, fontSize: 12, color: "#211C17" }}>31</span>
        </div>
        <div>
          <div style={{ fontFamily: BITTER, fontWeight: 800, fontSize: 14, color: "#FBF6EC" }}>ГИПС СТИЛЬ 31</div>
          <div style={{ fontSize: 10.5, color: "rgba(251,246,236,.5)", marginTop: 2 }}>Гипсовая плитка ручной работы</div>
        </div>
      </div>

      <div className="grid-footer" style={{ marginBottom: 18, fontSize: 12, maxWidth: 560 }}>
        {CAT_LINKS.map((l) => (
          <a key={l.href} href={l.href} className="link-amber" style={{ color: "rgba(251,246,236,.7)" }}>
            {l.label}
          </a>
        ))}
      </div>

      <div style={{ borderTop: "1px solid rgba(251,246,236,.1)", paddingTop: 16, marginBottom: 16 }}>
        <a href="tel:+7" style={{ display: "block", fontFamily: BITTER, fontWeight: 700, fontSize: 20, color: "#FBF6EC", marginBottom: 4 }}>
          +7 (XXX) XXX-XX-XX
        </a>
        <div style={{ fontSize: 12, color: "rgba(251,246,236,.55)", marginBottom: 12 }}>г. Губкин · ежедневно 9:00–20:00</div>
        <div style={{ display: "flex", gap: 9 }}>
          <a href="#" aria-label="ВКонтакте" className="lift" style={{ width: 40, height: 40, borderRadius: 11, background: VK_BG, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <VKMark size={20} />
          </a>
          <a href="#" aria-label="MAX" className="lift" style={{ width: 40, height: 40, borderRadius: 11, background: MAX_BG, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <MaxMark size={20} />
          </a>
        </div>
      </div>

      <div style={{ display: "flex", gap: 7, marginBottom: 16 }}>
        {PAY.map((p) => (
          <span key={p} style={{ background: "rgba(251,246,236,.1)", borderRadius: 6, padding: "5px 9px", fontSize: 10, fontWeight: 700, color: "rgba(251,246,236,.7)" }}>
            {p}
          </span>
        ))}
      </div>

      <div style={{ fontSize: 10, color: "rgba(251,246,236,.4)", lineHeight: 1.6, borderTop: "1px solid rgba(251,246,236,.1)", paddingTop: 14 }}>
        ИП / Самозанятый · ИНН 0000000000
        <br />
        <a href="/privacy" style={{ color: "rgba(251,246,236,.5)" }}>Политика конфиденциальности</a> ·{" "}
        <a href="/consent" style={{ color: "rgba(251,246,236,.5)" }}>Согласие на обработку ПД</a> ·{" "}
        <a href="/offer" style={{ color: "rgba(251,246,236,.5)" }}>Оферта</a>
        <br />© 2026 Гипс Стиль 31. Все права защищены.
      </div>
    </footer>
  );
}
