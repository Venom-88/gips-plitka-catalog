"use client";

import { useState } from "react";
import Link from "next/link";
import { BITTER, MaxMark, MAX_BG, Phone, VKMark, VK_BG } from "./icons";

const NAV = [
  { href: "/catalog", label: "Каталог" },
  { href: "/gallery", label: "Наши работы" },
  { href: "/about", label: "О студии" },
  { href: "/contacts", label: "Контакты" },
];

export default function MobileNav({ phone, vk, max }: { phone?: string | null; vk?: string | null; max?: string | null }) {
  const [open, setOpen] = useState(false);
  const tel = `tel:${(phone || "").replace(/[^\d+]/g, "") || "+7"}`;

  return (
    <>
      {/* Шит меню */}
      {open && (
        <div className="mobile-only" style={{ position: "fixed", inset: 0, zIndex: 60, display: "block" }}>
          <button
            aria-label="Закрыть меню"
            onClick={() => setOpen(false)}
            style={{ position: "absolute", inset: 0, background: "rgba(33,28,23,.5)", border: "none", cursor: "pointer" }}
          />
          <nav
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              background: "#F1E9DB",
              borderRadius: "22px 22px 0 0",
              padding: "10px 16px calc(90px + env(safe-area-inset-bottom))",
              boxShadow: "0 -20px 50px -20px rgba(33,28,23,.5)",
            }}
          >
            <div style={{ width: 40, height: 4, borderRadius: 100, background: "rgba(33,28,23,.2)", margin: "4px auto 10px" }} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontFamily: BITTER, fontWeight: 800, fontSize: 16, color: "#211C17" }}>Меню</span>
              <button onClick={() => setOpen(false)} aria-label="Закрыть" style={{ width: 32, height: 32, borderRadius: 9, border: "1px solid rgba(33,28,23,.14)", background: "#FBF6EC", cursor: "pointer", fontSize: 16, color: "#211C17" }}>
                ✕
              </button>
            </div>
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="press-98"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 8px",
                  fontFamily: BITTER,
                  fontWeight: 700,
                  fontSize: 17,
                  color: "#211C17",
                  borderBottom: "1px solid rgba(33,28,23,.07)",
                }}
              >
                {n.label}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M9 6l6 6-6 6" stroke="#B97E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Нижняя панель (мобайл) */}
      <div
        className="mobile-only"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: "rgba(241,233,219,.96)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderTop: "1px solid rgba(33,28,23,.12)",
          padding: "9px 14px calc(12px + env(safe-area-inset-bottom))",
          display: "flex",
          gap: 8,
          alignItems: "center",
        }}
      >
        <a
          href={tel}
          className="press-98"
          style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#211C17", color: "#FBF6EC", fontWeight: 700, fontSize: 14, height: 48, borderRadius: 13 }}
        >
          <Phone size={17} fill="#D99A2B" />
          Позвонить
        </a>
        {vk && (
          <a href={vk} target="_blank" rel="noopener" aria-label="ВКонтакте" className="press-94" style={{ flex: "none", width: 48, height: 48, borderRadius: 13, background: VK_BG, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <VKMark size={22} />
          </a>
        )}
        {max && (
          <a href={max} target="_blank" rel="noopener" aria-label="MAX" className="press-94" style={{ flex: "none", width: 48, height: 48, borderRadius: 13, background: MAX_BG, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <MaxMark size={22} />
          </a>
        )}
        {/* Кнопка меню — справа (удобно для правого пальца) */}
        <button
          onClick={() => setOpen(true)}
          aria-label="Открыть меню"
          className="press-94"
          style={{
            flex: "none",
            width: 56,
            height: 48,
            borderRadius: 13,
            background: "#FBF6EC",
            border: "1px solid rgba(33,28,23,.14)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 3,
            cursor: "pointer",
          }}
        >
          <span style={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "center" }}>
            <span style={{ width: 18, height: 2, background: "#211C17", borderRadius: 2 }} />
            <span style={{ width: 18, height: 2, background: "#211C17", borderRadius: 2 }} />
            <span style={{ width: 11, height: 2, background: "#D99A2B", borderRadius: 2, alignSelf: "flex-start" }} />
          </span>
          <span style={{ fontSize: 9.5, fontWeight: 700, color: "#211C17", marginTop: 1 }}>Меню</span>
        </button>
      </div>
    </>
  );
}
