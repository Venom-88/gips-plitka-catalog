"use client";

import { useMemo, useState } from "react";
import { ArrowRight, BITTER, HexOutline } from "./icons";

// Параметры расчёта (в проде берутся из карточки товара: расход/упаковку и цена).
const AREA_PER_PACK = 1.1; // м² в упаковке
const PRICE_PER_PACK = 1680; // ₽ за упаковку

function formatPrice(n: number) {
  return n.toLocaleString("ru-RU");
}

/** Маска телефона +7 (___) ___-__-__ */
function maskPhone(raw: string) {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("8")) d = "7" + d.slice(1);
  if (!d.startsWith("7")) d = "7" + d;
  d = d.slice(0, 11);
  const p = d.slice(1);
  let out = "+7";
  if (p.length > 0) out += " (" + p.slice(0, 3);
  if (p.length >= 3) out += ") " + p.slice(3, 6);
  if (p.length >= 6) out += "-" + p.slice(6, 8);
  if (p.length >= 8) out += "-" + p.slice(8, 10);
  return out;
}

const inputStyle = {
  background: "#2E2720",
  border: "1px solid rgba(251,246,236,.12)",
  borderRadius: 12,
  padding: "14px 15px",
  color: "#FBF6EC",
  fontSize: 14,
  fontFamily: "inherit",
  outline: "none",
} as const;

export default function LeadForm({
  source = "form",
  productSlug,
}: {
  source?: "form" | "b2b" | "calc" | "product";
  productSlug?: string;
} = {}) {
  const [area, setArea] = useState(12);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  const calc = useMemo(() => {
    const a = Math.max(0, Number(area) || 0);
    const packages = Math.ceil(a / AREA_PER_PACK);
    const cost = packages * PRICE_PER_PACK;
    return { packages, cost };
  }, [area]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!consent || status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, message, area, source, productSlug, consent, company }),
      });
      if (!res.ok) throw new Error("bad response");
      setStatus("done");
      setName("");
      setPhone("");
      setMessage("");
      setConsent(false);
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="form" className="gx" style={{ paddingTop: 32, paddingBottom: 36, background: "#211C17", position: "relative", overflow: "hidden", scrollMarginTop: 64 }}>
      <div style={{ position: "absolute", left: -30, top: -30, opacity: 0.4 }}>
        <HexOutline size={120} stroke="#D99A2B" width={0.7} />
      </div>
      <div style={{ position: "relative" }}>
        <div className="form-grid">
        <div>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".14em", color: "#D99A2B", textTransform: "uppercase", marginBottom: 6 }}>
          Бесплатно
        </div>
        <h2 className="t-h2" style={{ fontFamily: BITTER, fontWeight: 800, color: "#FBF6EC", margin: "0 0 6px" }}>Рассчитать стоимость</h2>
        <p style={{ fontSize: 13, color: "rgba(251,246,236,.62)", margin: "0 0 18px", lineHeight: 1.5 }}>
          Оставьте контакты — подберём цвет, посчитаем метраж и пришлём смету
        </p>

        {/* Калькулятор (живой пересчёт) */}
        <div style={{ background: "rgba(217,154,43,.1)", border: "1px solid rgba(217,154,43,.3)", borderRadius: 16, padding: 14, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 9 }}>
            <div style={{ fontSize: 11, color: "#ECB23F", fontWeight: 600 }}>Калькулятор плитки</div>
            <a href="/calculator" style={{ fontSize: 11, color: "#ECB23F", fontWeight: 700, textDecoration: "underline" }}>Расширенный →</a>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <label style={{ flex: 1, background: "#2E2720", borderRadius: 11, padding: "10px 13px", cursor: "text", display: "block" }}>
              <div style={{ fontSize: 10, color: "rgba(251,246,236,.5)" }}>Площадь стены</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                <input
                  type="number"
                  min={0}
                  step={0.5}
                  value={area}
                  onChange={(e) => setArea(e.target.valueAsNumber || 0)}
                  aria-label="Площадь стены, м²"
                  style={{
                    width: 52,
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    fontFamily: BITTER,
                    fontWeight: 700,
                    fontSize: 18,
                    color: "#FBF6EC",
                    padding: 0,
                  }}
                />
                <span style={{ fontFamily: BITTER, fontWeight: 700, fontSize: 18, color: "#FBF6EC" }}>м²</span>
              </div>
            </label>
            <ArrowRight size={20} stroke="#D99A2B" width={2} />
            <div style={{ flex: 1, background: "#2E2720", borderRadius: 11, padding: "10px 13px" }}>
              <div style={{ fontSize: 10, color: "rgba(251,246,236,.5)" }}>≈ {calc.packages} упаковок</div>
              <div style={{ fontFamily: BITTER, fontWeight: 700, fontSize: 18, color: "#D99A2B" }}>от {formatPrice(calc.cost)} ₽</div>
            </div>
          </div>
        </div>
        </div>
        <div>

        {status === "done" ? (
          <div
            role="status"
            style={{
              background: "rgba(74,107,54,.16)",
              border: "1px solid rgba(74,107,54,.5)",
              borderRadius: 14,
              padding: "20px 16px",
              color: "#FBF6EC",
            }}
          >
            <div style={{ fontFamily: BITTER, fontWeight: 700, fontSize: 17, marginBottom: 4 }}>Спасибо! Заявка принята</div>
            <div style={{ fontSize: 13, color: "rgba(251,246,236,.7)", lineHeight: 1.5 }}>
              Свяжемся с вами в ближайшее время — подберём цвет, посчитаем метраж и пришлём смету.
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }} noValidate>
            <input
              className="field"
              placeholder="Ваше имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
              style={inputStyle}
            />
            <input
              className="field"
              placeholder="Телефон"
              value={phone}
              onChange={(e) => setPhone(maskPhone(e.target.value))}
              inputMode="tel"
              autoComplete="tel"
              required
              style={inputStyle}
            />
            <textarea
              className="field"
              placeholder="Площадь, желаемая фактура, комментарий"
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ ...inputStyle, resize: "none" }}
            />
            {/* honeypot от спама (ТЗ п.11) — скрыт от людей */}
            <input
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              name="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
            />
            <button
              type="submit"
              disabled={!consent || status === "sending"}
              className="press-98"
              style={{
                background: "#D99A2B",
                color: "#211C17",
                border: "none",
                fontWeight: 700,
                fontSize: 15,
                padding: 16,
                borderRadius: 13,
                cursor: consent ? "pointer" : "not-allowed",
                opacity: consent ? 1 : 0.55,
                boxShadow: "0 8px 22px -6px rgba(217,154,43,.6)",
              }}
            >
              {status === "sending" ? "Отправляем…" : "Получить расчёт"}
            </button>
            {status === "error" && (
              <div style={{ fontSize: 11.5, color: "#ECB23F" }}>Не удалось отправить. Попробуйте ещё раз или позвоните нам.</div>
            )}
            <label style={{ display: "flex", alignItems: "flex-start", gap: 9, marginTop: 3, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                required
                style={{ position: "absolute", opacity: 0, width: 17, height: 17 }}
              />
              <span
                aria-hidden="true"
                style={{
                  flex: "none",
                  width: 17,
                  height: 17,
                  border: "1.5px solid rgba(251,246,236,.3)",
                  borderRadius: 5,
                  marginTop: 1,
                  background: consent ? "#D99A2B" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {consent && (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12l4 4 10-10" stroke="#211C17" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <span style={{ fontSize: 10.5, color: "rgba(251,246,236,.5)", lineHeight: 1.45 }}>
                Нажимая кнопку, я соглашаюсь на обработку персональных данных и с{" "}
                <a href="/privacy" style={{ color: "rgba(251,246,236,.7)", textDecoration: "underline" }}>
                  политикой конфиденциальности
                </a>
              </span>
            </label>
          </form>
        )}
        </div>
        </div>
      </div>
    </section>
  );
}
