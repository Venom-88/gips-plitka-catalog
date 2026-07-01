import { BITTER, HexFilled } from "./icons";

const STEPS = [
  { n: 1, title: "Заявка", text: "Звонок, мессенджер или форма на сайте" },
  { n: 2, title: "Подбор цвета и расчёт", text: "Бесплатно подбираем колер и считаем метраж" },
  { n: 3, title: "Изготовление", text: "Ручная формовка и окраска вашей партии" },
  { n: 4, title: "Доставка", text: "Бережная упаковка и отправка по всей России" },
  { n: 5, title: "Монтаж", text: "Подробные рекомендации по укладке и уходу" },
];

export default function Process() {
  return (
    <section className="gx" style={{ paddingTop: 28, paddingBottom: 12, background: "#F1E9DB" }}>
      <h2 className="t-h2" style={{ fontFamily: BITTER, fontWeight: 800, color: "#211C17", margin: "0 0 18px" }}>
        Как мы работаем
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 0, maxWidth: 720 }}>
        {STEPS.map((s, i) => {
          const last = i === STEPS.length - 1;
          return (
            <div key={s.n} style={{ display: "flex", gap: 14 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ flex: "none", width: 42, height: 42, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <HexFilled size={42} fill={last ? "#211C17" : "#D99A2B"} />
                  <span style={{ position: "absolute", fontFamily: BITTER, fontWeight: 800, fontSize: 15, color: last ? "#D99A2B" : "#211C17" }}>{s.n}</span>
                </div>
                {!last && <div style={{ width: 2, flex: 1, background: "rgba(33,28,23,.12)", margin: "4px 0" }} />}
              </div>
              <div style={{ paddingBottom: last ? 0 : 20 }}>
                <div style={{ fontFamily: BITTER, fontWeight: 700, fontSize: 16, color: "#211C17" }}>{s.title}</div>
                <div style={{ fontSize: 12.5, color: "#6F6253", marginTop: 3, lineHeight: 1.45 }}>{s.text}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
