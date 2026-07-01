import {
  BITTER,
  HexOutline,
  IconCalculator,
  IconColorSwatch,
  IconHandcraft,
  IconLeaf,
  IconTruck,
} from "./icons";
import type { ReactNode } from "react";

function SmallCard({ icon, iconBg, title, text }: { icon: ReactNode; iconBg: string; title: string; text: string }) {
  return (
    <div style={{ background: "#FBF6EC", border: "1px solid rgba(33,28,23,.08)", borderRadius: 16, padding: 15 }}>
      <div
        style={{
          width: 40,
          height: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: iconBg,
          borderRadius: 11,
          marginBottom: 11,
        }}
      >
        {icon}
      </div>
      <div style={{ fontFamily: BITTER, fontWeight: 700, fontSize: 14.5, color: "#211C17", lineHeight: 1.15 }}>{title}</div>
      <div style={{ fontSize: 11.5, color: "#6F6253", marginTop: 4, lineHeight: 1.4 }}>{text}</div>
    </div>
  );
}

export default function Advantages() {
  return (
    <section className="gx" style={{ paddingTop: 30, paddingBottom: 6, background: "#F1E9DB" }}>
      <div className="grid-adv">
        {/* широкая карточка */}
        <div
          style={{
            gridColumn: "1 / -1",
            background: "#211C17",
            borderRadius: 18,
            padding: "18px 18px 16px",
            display: "flex",
            alignItems: "center",
            gap: 14,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", right: -18, top: -18, opacity: 0.5 }}>
            <HexOutline size={92} stroke="#D99A2B" width={1} />
          </div>
          <div
            style={{
              flex: "none",
              width: 46,
              height: 46,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#D99A2B",
              borderRadius: 13,
            }}
          >
            <IconHandcraft size={24} />
          </div>
          <div>
            <div style={{ fontFamily: BITTER, fontWeight: 700, fontSize: 16, color: "#FBF6EC" }}>
              Ручная формовка и окраска
            </div>
            <div style={{ fontSize: 12, color: "rgba(251,246,236,.7)", marginTop: 2, lineHeight: 1.4 }}>
              Каждая плитка проходит через руки мастера
            </div>
          </div>
        </div>

        <SmallCard icon={<IconColorSwatch />} iconBg="#F1E2C6" title="Подбор цвета" text="Колер под ваш интерьер — бесплатно" />
        <SmallCard icon={<IconLeaf />} iconBg="#DCE7D0" title="Экологичный гипс" text="Лёгкий, дышащий, держит микроклимат" />
        <SmallCard icon={<IconTruck />} iconBg="#E7DECE" title="Доставка по РФ" text="В любой город транспортной компанией" />
        <SmallCard icon={<IconCalculator />} iconBg="#E7DECE" title="Расчёт метража" text="Поможем посчитать и не переплатить" />
      </div>
    </section>
  );
}
