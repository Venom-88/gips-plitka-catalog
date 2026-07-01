"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/admin/client";
import { A, Btn } from "./ui";
import { LogoHex, BITTER } from "../icons";
import LoginForm from "./LoginForm";
import LeadsManager from "./LeadsManager";
import ProductsManager from "./ProductsManager";
import CategoriesManager from "./CategoriesManager";
import WorksManager from "./WorksManager";
import ReviewsManager from "./ReviewsManager";
import SettingsManager from "./SettingsManager";
import SiteImagesManager from "./SiteImagesManager";
import UsersManager from "./UsersManager";

type Me = { id: string; name: string; email: string; role: string; permissions: string[] };

type Tab = { key: string; label: string; adminOnly?: boolean };
const TABS: Tab[] = [
  { key: "leads", label: "Заявки" },
  { key: "products", label: "Товары" },
  { key: "categories", label: "Категории" },
  { key: "works", label: "Работы" },
  { key: "reviews", label: "Отзывы" },
  { key: "images", label: "Изображения", adminOnly: true },
  { key: "settings", label: "Настройки", adminOnly: true },
  { key: "users", label: "Пользователи", adminOnly: true },
];

export default function AdminApp() {
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("leads");

  async function loadMe() {
    setLoading(true);
    try {
      const r = await api.get<{ user: Me }>("/api/auth/me");
      setMe(r.user);
    } catch {
      setMe(null);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { loadMe(); }, []);

  async function logout() {
    await api.post("/api/auth/logout");
    setMe(null);
  }

  if (loading) {
    return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: A.paper, color: A.muted }}>Загрузка…</div>;
  }
  if (!me) return <LoginForm onLogin={loadMe} />;

  const isAdmin = me.role === "ADMIN";
  const tabs = TABS.filter((t) => !t.adminOnly || isAdmin);
  const active = tabs.find((t) => t.key === tab) ? tab : "leads";

  return (
    <div style={{ minHeight: "100vh", background: A.paper }}>
      {/* Верхняя панель */}
      <div style={{ background: A.ink, color: "#FBF6EC", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <LogoHex size={32} digitSize={11} />
          <div>
            <div style={{ fontFamily: BITTER, fontWeight: 800, fontSize: 14 }}>Админка</div>
            <div style={{ fontSize: 10.5, color: "rgba(251,246,236,.6)" }}>{me.name} · {me.role}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <a href="/" target="_blank" style={{ fontSize: 12.5, color: "rgba(251,246,236,.75)", padding: "8px 10px" }}>Сайт ↗</a>
          <Btn variant="ghost" size="sm" onClick={logout}>Выйти</Btn>
        </div>
      </div>

      {/* Вкладки */}
      <div className="no-scrollbar" style={{ display: "flex", gap: 6, overflowX: "auto", padding: "12px 16px 0", background: A.paper, position: "sticky", top: 56, zIndex: 9 }}>
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              flex: "none",
              padding: "9px 14px",
              borderRadius: "10px 10px 0 0",
              border: "none",
              borderBottom: active === t.key ? `2px solid ${A.amber}` : "2px solid transparent",
              background: active === t.key ? A.cream : "transparent",
              color: active === t.key ? A.ink : A.muted,
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "inherit",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Контент */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "18px 16px 60px" }}>
        {active === "leads" && <LeadsManager />}
        {active === "products" && <ProductsManager />}
        {active === "categories" && <CategoriesManager />}
        {active === "works" && <WorksManager />}
        {active === "reviews" && <ReviewsManager />}
        {active === "images" && isAdmin && <SiteImagesManager />}
        {active === "settings" && isAdmin && <SettingsManager />}
        {active === "users" && isAdmin && <UsersManager currentUserId={me.id} />}
      </div>
    </div>
  );
}
