import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import LeadForm from "@/components/LeadForm";
import { BITTER, MaxMark, MAX_BG, Phone, VKMark, VK_BG } from "@/components/icons";
import { getContactInfo } from "@/lib/catalog";
import { telHref, vkHref, maxHref } from "@/lib/types";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Контакты",
  description:
    "Контакты студии гипсовой плитки «Гипс Стиль 31» в Губкине: телефон, мессенджеры, режим работы. Звоните — подберём цвет и рассчитаем метраж.",
  alternates: { canonical: "/contacts" },
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ padding: "12px 0", borderBottom: "1px solid rgba(33,28,23,.08)" }}>
      <div style={{ fontSize: 11, color: "#8C7E68", marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 14.5, color: "#211C17", fontWeight: 600 }}>{value}</div>
    </div>
  );
}

export default async function ContactsPage() {
  const info = await getContactInfo();
  const phone = info?.phone ?? "+7 (900) 000-00-00";
  const address = info?.address ?? "г. Губкин, Белгородская обл.";
  const hours = info?.workingHours ?? "Ежедневно 9:00–20:00";
  const vk = vkHref(info?.vk);
  const max = maxHref(info?.max);

  return (
    <>
      <section className="gx" style={{ paddingTop: 18, paddingBottom: 20, background: "#F1E9DB" }}>
        <div style={{ maxWidth: 620 }}>
        <Breadcrumbs items={[{ href: "/", label: "Главная" }, { label: "Контакты" }]} />
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".14em", color: "#B97E1E", textTransform: "uppercase", margin: "14px 0 5px" }}>
          Контакты
        </div>
        <h1 style={{ fontFamily: BITTER, fontWeight: 800, fontSize: 26, color: "#211C17", margin: "0 0 16px", lineHeight: 1.1 }}>
          Свяжитесь с нами
        </h1>

        <div style={{ background: "#FBF6EC", border: "1px solid rgba(33,28,23,.08)", borderRadius: 18, padding: "6px 16px 16px", marginBottom: 16 }}>
          <Row label="Телефон" value={phone} />
          <Row label="Адрес" value={address} />
          <Row label="Режим работы" value={hours} />
          {info?.email && <Row label="Email" value={info.email} />}
        </div>

        <div style={{ display: "flex", gap: 9 }}>
          <a href={telHref(phone)} className="press-98" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#211C17", color: "#FBF6EC", fontWeight: 700, fontSize: 14, padding: 14, borderRadius: 13 }}>
            <Phone size={17} fill="#D99A2B" /> Позвонить
          </a>
          {vk && (
            <a href={vk} target="_blank" rel="noopener" aria-label="ВКонтакте" className="press-94" style={{ flex: "none", width: 50, height: 50, borderRadius: 13, background: VK_BG, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <VKMark size={22} />
            </a>
          )}
          {max && (
            <a href={max} target="_blank" rel="noopener" aria-label="MAX" className="press-94" style={{ flex: "none", width: 50, height: 50, borderRadius: 13, background: MAX_BG, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <MaxMark size={22} />
            </a>
          )}
        </div>
        </div>
      </section>

      <LeadForm source="form" />
    </>
  );
}
