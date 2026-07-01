import { IconHeart, IconLock, IconReturn, IconTruckWarranty } from "./icons";
import type { ReactNode } from "react";

function Guarantee({ icon, label }: { icon: ReactNode; label: ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 11, background: "#FBF6EC", border: "1px solid rgba(33,28,23,.08)", borderRadius: 14, padding: 13 }}>
      {icon}
      <div style={{ fontSize: 11.5, fontWeight: 600, color: "#211C17", lineHeight: 1.3 }}>{label}</div>
    </div>
  );
}

export default function Guarantees() {
  return (
    <section className="gx" style={{ paddingTop: 18, paddingBottom: 26, background: "#F1E9DB" }}>
      <div className="grid-adv">
        <Guarantee icon={<IconTruckWarranty />} label={<>Доставка по&nbsp;всей РФ</>} />
        <Guarantee icon={<IconReturn />} label={<>Возврат и&nbsp;замена</>} />
        <Guarantee icon={<IconHeart />} label={<>Всегда на&nbsp;связи</>} />
        <Guarantee icon={<IconLock />} label={<>Безопасная&nbsp;оплата</>} />
      </div>
    </section>
  );
}
