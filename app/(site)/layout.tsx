import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import { MaxMark, MAX_BG, VKMark, VK_BG } from "@/components/icons";

// Публичный layout: адаптивная шапка, контент, футер.
// Мобайл — нижняя панель с меню/звонком/мессенджерами; десктоп — плавающие мессенджеры.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app">
      <Header />
      <main>{children}</main>
      <Footer />

      {/* спейсер под нижнюю панель — только мобайл */}
      <div className="mobile-only" style={{ height: 74, background: "#1A1612" }} />
      <MobileNav />

      {/* плавающие мессенджеры — только десктоп */}
      <div className="desktop-only" style={{ position: "fixed", right: 24, bottom: 24, zIndex: 50, flexDirection: "column", gap: 12 }}>
        <a href="#" aria-label="ВКонтакте" className="lift" style={{ width: 52, height: 52, borderRadius: "50%", background: VK_BG, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 20px -6px rgba(0,0,0,.35)" }}>
          <VKMark size={26} />
        </a>
        <a href="#" aria-label="MAX" className="lift" style={{ width: 52, height: 52, borderRadius: "50%", background: MAX_BG, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 20px -6px rgba(0,0,0,.35)" }}>
          <MaxMark size={26} />
        </a>
      </div>
    </div>
  );
}
