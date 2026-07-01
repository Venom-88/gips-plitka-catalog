import type { Metadata } from "next";

// Админку не индексируем.
export const metadata: Metadata = {
  title: "Админка — Гипс Стиль 31",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
