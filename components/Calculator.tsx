"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ImageSlot from "./ImageSlot";
import { ArrowRight, BITTER } from "./icons";
import type { CalcProduct } from "@/lib/catalog";

// ---- предварительные нормы (доборы/расходники) ----
const CORNER = { pricePerPc: 350, pcsPerMeter: 4 };
const GLUE = { kgPerM2: 4.5, packKg: 5, packPrice: 390 };
const GROUT = { kgPerM2: 0.5, packKg: 2, packPrice: 450 };
const LAK = { m2PerL: 9, bottlePrice: 590 };

const money = (n: number) => `${Math.round(n).toLocaleString("ru-RU")} ₽`;
const m2 = (n: number) => `${n.toFixed(1)} м²`;

// плавная анимация чисел (count-up) без библиотек
function useCountUp(value: number, duration = 450) {
  const [display, setDisplay] = useState(value);
  const from = useRef(value);
  const raf = useRef<number | undefined>(undefined);
  useEffect(() => {
    const start = performance.now();
    const a = from.current;
    const b = value;
    if (a === b) {
      setDisplay(b);
      return;
    }
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(a + (b - a) * eased);
      if (t < 1) raf.current = requestAnimationFrame(tick);
      else from.current = b;
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      from.current = value;
    };
  }, [value, duration]);
  return display;
}

function Num({ value, kind }: { value: number; kind: "money" | "m2" | "int" }) {
  const d = useCountUp(value);
  return <>{kind === "money" ? money(d) : kind === "m2" ? m2(d) : Math.round(d).toLocaleString("ru-RU")}</>;
}

function maskPhone(raw: string) {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("8")) d = "7" + d.slice(1);
  if (!d.startsWith("7")) d = "7" + d;
  d = d.slice(0, 11);
  const p = d.slice(1);
  let out = "+7";
  if (p.length) out += " (" + p.slice(0, 3);
  if (p.length >= 3) out += ") " + p.slice(3, 6);
  if (p.length >= 6) out += "-" + p.slice(6, 8);
  if (p.length >= 8) out += "-" + p.slice(8, 10);
  return out;
}

const num = (s: string) => Math.max(0, Number(String(s).replace(",", ".")) || 0);

const label: React.CSSProperties = { fontSize: 12, color: "#6F6253", fontWeight: 600, marginBottom: 5, display: "block" };

export default function Calculator({ products }: { products: CalcProduct[] }) {
  const [mode, setMode] = useState<"area" | "walls">("area");
  const [directArea, setDirectArea] = useState("12");
  const [walls, setWalls] = useState<{ w: string; h: string }[]>([{ w: "3", h: "2.7" }]);
  const [openings, setOpenings] = useState<{ w: string; h: string; n: string }[]>([]);
  const [reserve, setReserve] = useState(10);
  const [productId, setProductId] = useState(products[0]?.id ?? "");

  const [useCorners, setUseCorners] = useState(false);
  const [cornerM, setCornerM] = useState("2");
  const [useGlue, setUseGlue] = useState(true);
  const [useGrout, setUseGrout] = useState(false);
  const [useLak, setUseLak] = useState(false);

  // форма заявки
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  const product = products.find((p) => p.id === productId) ?? products[0];

  const calc = useMemo(() => {
    const wallsArea = walls.reduce((s, w) => s + num(w.w) * num(w.h), 0);
    const openArea = openings.reduce((s, o) => s + num(o.w) * num(o.h) * Math.max(1, num(o.n) || 1), 0);
    const net = mode === "area" ? num(directArea) : Math.max(0, wallsArea - openArea);
    const withReserve = net * (1 + reserve / 100);

    const coverage = product?.coverage && product.coverage > 0 ? product.coverage : 1;
    const pricePerM2 = product?.priceFrom ?? 0;
    const packages = withReserve > 0 ? Math.ceil(withReserve / coverage) : 0;
    const tileCost = packages * coverage * pricePerM2;

    const cornerPcs = useCorners ? Math.ceil(num(cornerM) * CORNER.pcsPerMeter) : 0;
    const cornerCost = cornerPcs * CORNER.pricePerPc;

    const glueBags = useGlue ? Math.ceil((withReserve * GLUE.kgPerM2) / GLUE.packKg) : 0;
    const glueCost = glueBags * GLUE.packPrice;
    const groutBags = useGrout ? Math.ceil((withReserve * GROUT.kgPerM2) / GROUT.packKg) : 0;
    const groutCost = groutBags * GROUT.packPrice;
    const lakBottles = useLak ? Math.ceil(withReserve / LAK.m2PerL) : 0;
    const lakCost = lakBottles * LAK.bottlePrice;

    const total = tileCost + cornerCost + glueCost + groutCost + lakCost;
    return {
      net, withReserve, openArea, coverage, packages, tileCost,
      cornerPcs, cornerCost, glueBags, glueCost, groutBags, groutCost, lakBottles, lakCost, total,
    };
  }, [mode, directArea, walls, openings, reserve, product, useCorners, cornerM, useGlue, useGrout, useLak]);

  // пульс на «Итого» при изменении
  const [pulse, setPulse] = useState(false);
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    setPulse(true);
    const t = setTimeout(() => setPulse(false), 420);
    return () => clearTimeout(t);
  }, [calc.total]);

  const reservePart = calc.withReserve > 0 ? Math.min(100, (calc.net / calc.withReserve) * 100) : 0;

  function summary() {
    const lines = [
      `Расчёт калькулятора:`,
      `• Товар: ${product?.title ?? "—"}`,
      `• Площадь: ${calc.net.toFixed(1)} м² (+${reserve}% запас = ${calc.withReserve.toFixed(1)} м²)`,
      `• Плитка: ~${calc.packages} упак., ~${Math.round(calc.tileCost)} ₽`,
    ];
    if (useCorners) lines.push(`• Углы: ${calc.cornerPcs} шт, ~${calc.cornerCost} ₽`);
    if (useGlue) lines.push(`• Клей: ${calc.glueBags} уп., ~${calc.glueCost} ₽`);
    if (useGrout) lines.push(`• Затирка: ${calc.groutBags} уп., ~${calc.groutCost} ₽`);
    if (useLak) lines.push(`• Лак: ${calc.lakBottles} шт, ~${calc.lakCost} ₽`);
    lines.push(`• ИТОГО (предв.): ~${Math.round(calc.total)} ₽`);
    return lines.join("\n");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!consent || status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, phone, message: summary(), area: Number(calc.withReserve.toFixed(1)),
          source: "calc", productSlug: product?.slug, consent, company: "",
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="calc-grid">
      {/* ЛЕВО: вводные */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Площадь */}
        <div className="calc-card">
          <div style={{ fontFamily: BITTER, fontWeight: 700, fontSize: 16, color: "#211C17", marginBottom: 12 }}>1. Площадь</div>
          <div className="calc-seg" style={{ marginBottom: 14 }}>
            <button data-active={mode === "area"} onClick={() => setMode("area")}>Ввести площадь</button>
            <button data-active={mode === "walls"} onClick={() => setMode("walls")}>Посчитать по стенам</button>
          </div>

          {mode === "area" ? (
            <label>
              <span style={label}>Площадь облицовки, м²</span>
              <input className="calc-in" type="number" min={0} step={0.5} value={directArea} onChange={(e) => setDirectArea(e.target.value)} />
            </label>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {walls.map((w, i) => (
                <div key={i} className="calc-anim" style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                  <label style={{ flex: 1 }}>
                    {i === 0 && <span style={label}>Ширина, м</span>}
                    <input className="calc-in" type="number" min={0} step={0.1} value={w.w} onChange={(e) => setWalls((a) => a.map((x, j) => (j === i ? { ...x, w: e.target.value } : x)))} />
                  </label>
                  <span style={{ color: "#8C7E68", paddingBottom: 12 }}>×</span>
                  <label style={{ flex: 1 }}>
                    {i === 0 && <span style={label}>Высота, м</span>}
                    <input className="calc-in" type="number" min={0} step={0.1} value={w.h} onChange={(e) => setWalls((a) => a.map((x, j) => (j === i ? { ...x, h: e.target.value } : x)))} />
                  </label>
                  <button aria-label="Удалить стену" onClick={() => setWalls((a) => a.filter((_, j) => j !== i))} disabled={walls.length === 1} style={{ flex: "none", width: 40, height: 42, borderRadius: 10, border: "1px solid rgba(33,28,23,.14)", background: "#fff", color: "#B5552F", cursor: walls.length === 1 ? "not-allowed" : "pointer", opacity: walls.length === 1 ? 0.4 : 1 }}>✕</button>
                </div>
              ))}
              <button onClick={() => setWalls((a) => [...a, { w: "", h: "" }])} className="press-98" style={{ alignSelf: "flex-start", background: "transparent", border: "1.5px dashed rgba(33,28,23,.22)", color: "#6F6253", borderRadius: 10, padding: "9px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>+ Добавить стену</button>

              {/* Проёмы */}
              <div style={{ marginTop: 6, fontSize: 12.5, color: "#6F6253", fontWeight: 600 }}>Проёмы (двери/окна) — вычтем из площади</div>
              {openings.map((o, i) => (
                <div key={i} className="calc-anim" style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input className="calc-in" type="number" min={0} step={0.1} placeholder="ширина" value={o.w} onChange={(e) => setOpenings((a) => a.map((x, j) => (j === i ? { ...x, w: e.target.value } : x)))} />
                  <span style={{ color: "#8C7E68" }}>×</span>
                  <input className="calc-in" type="number" min={0} step={0.1} placeholder="высота" value={o.h} onChange={(e) => setOpenings((a) => a.map((x, j) => (j === i ? { ...x, h: e.target.value } : x)))} />
                  <input className="calc-in" type="number" min={1} step={1} placeholder="шт" value={o.n} onChange={(e) => setOpenings((a) => a.map((x, j) => (j === i ? { ...x, n: e.target.value } : x)))} style={{ width: 64, flex: "none" }} />
                  <button aria-label="Удалить проём" onClick={() => setOpenings((a) => a.filter((_, j) => j !== i))} style={{ flex: "none", width: 40, height: 42, borderRadius: 10, border: "1px solid rgba(33,28,23,.14)", background: "#fff", color: "#B5552F", cursor: "pointer" }}>✕</button>
                </div>
              ))}
              <button onClick={() => setOpenings((a) => [...a, { w: "0.9", h: "2.1", n: "1" }])} className="press-98" style={{ alignSelf: "flex-start", background: "transparent", border: "1.5px dashed rgba(33,28,23,.22)", color: "#6F6253", borderRadius: 10, padding: "9px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>+ Добавить проём</button>
            </div>
          )}
        </div>

        {/* Запас + товар */}
        <div className="calc-card">
          <div style={{ fontFamily: BITTER, fontWeight: 700, fontSize: 16, color: "#211C17", marginBottom: 12 }}>2. Плитка и запас</div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: "#6F6253", fontWeight: 600 }}>Запас на подрез</span>
              <span style={{ fontFamily: BITTER, fontWeight: 800, fontSize: 15, color: "#B97E1E" }}>{reserve}%</span>
            </div>
            <input
              className="calc-range"
              type="range"
              min={5}
              max={15}
              step={1}
              value={reserve}
              onChange={(e) => setReserve(Number(e.target.value))}
              style={{ background: `linear-gradient(90deg, #D99A2B ${((reserve - 5) / 10) * 100}%, rgba(33,28,23,.12) ${((reserve - 5) / 10) * 100}%)` }}
            />
            <div style={{ fontSize: 11, color: "#8C7E68", marginTop: 6 }}>10% — стандарт; для диагонали/сложного узора берите больше.</div>
          </div>

          <div style={{ fontSize: 13, color: "#6F6253", fontWeight: 600, marginBottom: 8 }}>Выберите товар</div>
          <div className="no-scrollbar" style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }}>
            {products.map((p) => (
              <button key={p.id} className="calc-prod" data-active={p.id === productId} onClick={() => setProductId(p.id)}>
                <ImageSlot src={p.imageUrl} objectPosition={p.imagePos} height={80} placeholder={p.title} alt={p.title} />
                <div style={{ padding: "8px 9px 10px", textAlign: "left" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#211C17", lineHeight: 1.2 }}>{p.title}</div>
                  <div style={{ fontSize: 11, color: "#8C7E68", marginTop: 2 }}>от {p.priceFrom.toLocaleString("ru-RU")} ₽/м²</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Доборы и расходники */}
        <div className="calc-card">
          <div style={{ fontFamily: BITTER, fontWeight: 700, fontSize: 16, color: "#211C17", marginBottom: 12 }}>3. Доборы и расходники</div>
          <Toggle label="Угловые элементы" checked={useCorners} onChange={setUseCorners} />
          {useCorners && (
            <label className="calc-anim" style={{ display: "block", margin: "0 0 12px 34px" }}>
              <span style={label}>Погонные метры внешних углов</span>
              <input className="calc-in" type="number" min={0} step={0.1} value={cornerM} onChange={(e) => setCornerM(e.target.value)} />
            </label>
          )}
          <Toggle label="Монтажный клей" checked={useGlue} onChange={setUseGlue} />
          <Toggle label="Затирка для швов" checked={useGrout} onChange={setUseGrout} />
          <Toggle label="Лак-пропитка (защита)" checked={useLak} onChange={setUseLak} />
        </div>
      </div>

      {/* ПРАВО: результат + заявка (sticky на десктопе) */}
      <div className="calc-result">
        <div style={{ background: "#211C17", borderRadius: 18, padding: 18, color: "#FBF6EC" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".14em", color: "#D99A2B", textTransform: "uppercase", marginBottom: 10 }}>Предварительный расчёт</div>

          <Row k="Чистая площадь" v={<Num value={calc.net} kind="m2" />} />
          <Row k={`С запасом (+${reserve}%)`} v={<Num value={calc.withReserve} kind="m2" />} />
          <Row k="Упаковок плитки" v={<Num value={calc.packages} kind="int" />} />

          {/* полоса-пропорция */}
          <div className="calc-bar" style={{ margin: "12px 0 4px" }}>
            <span style={{ width: `${reservePart}%`, background: "#D99A2B" }} />
            <span style={{ width: `${100 - reservePart}%`, background: "#6E5A48" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "rgba(251,246,236,.6)", marginBottom: 12 }}>
            <span>плитка</span>
            <span>запас</span>
          </div>

          <div style={{ borderTop: "1px solid rgba(251,246,236,.14)", paddingTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
            <Line k={`Плитка · ${product?.title ?? ""}`} v={<Num value={calc.tileCost} kind="money" />} />
            {useCorners && <Line k={`Углы · ${calc.cornerPcs} шт`} v={<Num value={calc.cornerCost} kind="money" />} />}
            {useGlue && <Line k={`Клей · ${calc.glueBags} уп.`} v={<Num value={calc.glueCost} kind="money" />} />}
            {useGrout && <Line k={`Затирка · ${calc.groutBags} уп.`} v={<Num value={calc.groutCost} kind="money" />} />}
            {useLak && <Line k={`Лак · ${calc.lakBottles} шт`} v={<Num value={calc.lakCost} kind="money" />} />}
          </div>

          <div style={{ borderTop: "1px solid rgba(251,246,236,.14)", marginTop: 10, paddingTop: 12, display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, color: "rgba(251,246,236,.7)" }}>Итого, предв.</span>
            <span className={pulse ? "total-pulse" : ""} style={{ fontFamily: BITTER, fontWeight: 800, fontSize: 26, color: "#ECB23F", lineHeight: 1 }}>
              <Num value={calc.total} kind="money" />
            </span>
          </div>
          <div style={{ fontSize: 10.5, color: "rgba(251,246,236,.5)", marginTop: 8, lineHeight: 1.45 }}>
            Оценка ориентировочная. Точную смету пришлём после подбора цвета и уточнения раскладки.
          </div>
        </div>

        {/* Заявка со сметой */}
        <div style={{ background: "#FBF6EC", border: "1px solid rgba(33,28,23,.08)", borderRadius: 18, padding: 16, marginTop: 12 }}>
          {status === "done" ? (
            <div>
              <div style={{ fontFamily: BITTER, fontWeight: 700, fontSize: 17, color: "#211C17", marginBottom: 4 }}>Спасибо! Заявка принята</div>
              <div style={{ fontSize: 13, color: "#5C5040", lineHeight: 1.5 }}>Расчёт ушёл нам — свяжемся и пришлём точную смету.</div>
            </div>
          ) : (
            <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 10 }} noValidate>
              <div style={{ fontFamily: BITTER, fontWeight: 700, fontSize: 16, color: "#211C17" }}>Получить точную смету</div>
              <input className="calc-in" placeholder="Ваше имя" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
              <input className="calc-in" placeholder="Телефон" value={phone} onChange={(e) => setPhone(maskPhone(e.target.value))} inputMode="tel" required autoComplete="tel" />
              <button type="submit" disabled={!consent || status === "sending"} className="press-98" style={{ background: "#D99A2B", color: "#211C17", border: "none", fontWeight: 700, fontSize: 15, padding: 15, borderRadius: 13, cursor: consent ? "pointer" : "not-allowed", opacity: consent ? 1 : 0.55, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 8px 22px -6px rgba(217,154,43,.5)" }}>
                {status === "sending" ? "Отправляем…" : "Отправить расчёт"}
                {status !== "sending" && <ArrowRight size={16} stroke="#211C17" width={2.2} />}
              </button>
              {status === "error" && <div style={{ fontSize: 11.5, color: "#B5552F" }}>Не удалось отправить. Попробуйте ещё раз или позвоните.</div>}
              <label style={{ display: "flex", alignItems: "flex-start", gap: 9, cursor: "pointer" }}>
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} required style={{ marginTop: 2, width: 16, height: 16, accentColor: "#D99A2B" }} />
                <span style={{ fontSize: 10.5, color: "#6F6253", lineHeight: 1.45 }}>
                  Соглашаюсь на обработку персональных данных и с{" "}
                  <a href="/privacy" style={{ color: "#B97E1E", textDecoration: "underline" }}>политикой конфиденциальности</a>
                </span>
              </label>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "5px 0" }}>
      <span style={{ fontSize: 13, color: "rgba(251,246,236,.7)" }}>{k}</span>
      <span style={{ fontFamily: BITTER, fontWeight: 700, fontSize: 16, color: "#FBF6EC" }}>{v}</span>
    </div>
  );
}
function Line({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 10, fontSize: 12.5 }}>
      <span style={{ color: "rgba(251,246,236,.65)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{k}</span>
      <span style={{ color: "#FBF6EC", fontWeight: 600, flex: "none" }}>{v}</span>
    </div>
  );
}
function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, cursor: "pointer" }}>
      <span onClick={() => onChange(!checked)} style={{ flex: "none", width: 40, height: 23, borderRadius: 100, background: checked ? "#D99A2B" : "#cfc4b0", position: "relative", transition: "background .15s" }}>
        <span style={{ position: "absolute", top: 2, left: checked ? 19 : 2, width: 19, height: 19, borderRadius: "50%", background: "#fff", transition: "left .15s" }} />
      </span>
      <span style={{ fontSize: 13.5, color: "#211C17", fontWeight: 500 }}>{label}</span>
    </label>
  );
}
