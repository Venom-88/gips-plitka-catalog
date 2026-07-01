import type { Metadata, Viewport } from "next";
import { Bitter, Golos_Text } from "next/font/google";
import "./globals.css";

// Шрифты через next/font — self-hosted (быстро + удобно для 152-ФЗ, без обращений к Google).
const bitter = Bitter({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-bitter",
  display: "swap",
});

const golos = Golos_Text({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-golos",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://gips-style-31.ru"),
  title: {
    default: "Гипс Стиль 31 — авторская гипсовая плитка ручной работы · Губкин",
    template: "%s — Гипс Стиль 31",
  },
  description:
    "Студия гипсовой плитки ручной работы в Губкине. Эксклюзивные фактуры, индивидуальный подбор цвета под интерьер, экологичный гипс, нестандартные размеры под заказ.",
  keywords: [
    "гипсовая плитка",
    "декоративный кирпич",
    "плитка ручной работы",
    "Губкин",
    "3D-мозаика",
    "гипс",
  ],
  openGraph: {
    title: "Гипс Стиль 31 — гипсовая плитка ручной работы",
    description:
      "Авторская гипсовая плитка: подбор цвета под интерьер, экологичный гипс, доставка по РФ.",
    locale: "ru_RU",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#211C17",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${bitter.variable} ${golos.variable}`}>
      <body>{children}</body>
    </html>
  );
}
