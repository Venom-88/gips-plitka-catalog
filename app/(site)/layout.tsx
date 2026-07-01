import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import { MaxMark, MAX_BG, VKMark, VK_BG } from "@/components/icons";
import { getContactInfo } from "@/lib/catalog";
import { vkHref, maxHref, type ContactData } from "@/lib/types";

// Публичный layout: адаптивная шапка, контент, футер.
// Контакты берём из БД (админка → Настройки) и раздаём в шапку/футер/панель.
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const info = await getContactInfo();
  const contact: ContactData = info
    ? { phone: info.phone, email: info.email, address: info.address, workingHours: info.workingHours, vk: info.vk, max: info.max }
    : null;

  const vk = vkHref(contact?.vk);
  const max = maxHref(contact?.max);

  return (
    <div className="app">
      <Header phone={contact?.phone} />
      <main>{children}</main>
      <Footer contact={contact} />

      {/* спейсер под нижнюю панель — только мобайл */}
      <div className="mobile-only" style={{ height: 74, background: "#1A1612" }} />
      <MobileNav phone={contact?.phone} vk={vk} max={max} />

      {/* плавающие мессенджеры — только десктоп */}
      <div className="desktop-only" style={{ position: "fixed", right: 24, bottom: 24, zIndex: 50, flexDirection: "column", gap: 12 }}>
        {vk && (
          <a href={vk} target="_blank" rel="noopener" aria-label="ВКонтакте" className="lift" style={{ width: 52, height: 52, borderRadius: "50%", background: VK_BG, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 20px -6px rgba(0,0,0,.35)" }}>
            <VKMark size={26} />
          </a>
        )}
        {max && (
          <a href={max} target="_blank" rel="noopener" aria-label="MAX" className="lift" style={{ width: 52, height: 52, borderRadius: "50%", background: MAX_BG, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 20px -6px rgba(0,0,0,.35)" }}>
            <MaxMark size={26} />
          </a>
        )}
      </div>
    </div>
  );
}
