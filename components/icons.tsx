/* Инлайн-SVG иконки прототипа (stroke ~1.6–1.7). Можно заменить на свой icon-set
   того же визуального веса. Фирменный мотив — сота (pointy-top hexagon). */
import type { CSSProperties } from "react";

export const BITTER = "var(--font-bitter), serif";

type IconProps = { size?: number; style?: CSSProperties };

/** Сплошная сота (логотип / бейджи / номера шагов). */
export function HexFilled({ size = 24, fill = "#211C17" }: { size?: number; fill?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M12 2 21 7v10l-9 5-9-5V7Z" fill={fill} />
    </svg>
  );
}

/** Контурная сота (декор в тёмных блоках). */
export function HexOutline({
  size = 24,
  stroke = "#D99A2B",
  width = 1,
  nested = false,
}: {
  size?: number;
  stroke?: string;
  width?: number;
  nested?: boolean;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M12 2 21 7v10l-9 5-9-5V7Z" fill="none" stroke={stroke} strokeWidth={width} />
      {nested && (
        <path d="M12 6 17 9v6l-5 3-5-3V9Z" fill="none" stroke={stroke} strokeWidth={width} />
      )}
    </svg>
  );
}

/** Логотип-сота с цифрой «31». */
export function LogoHex({ size = 38, digitSize = 13 }: { size?: number; digitSize?: number }) {
  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24">
        <path d="M12 1.5 21.2 6.8v10.4L12 22.5 2.8 17.2V6.8Z" fill="#211C17" />
        <path d="M12 4 18.9 8v8L12 20 5.1 16V8Z" fill="#D99A2B" />
      </svg>
      <span
        style={{
          position: "absolute",
          fontFamily: BITTER,
          fontWeight: 800,
          fontSize: digitSize,
          color: "#211C17",
        }}
      >
        31
      </span>
    </div>
  );
}

export function ArrowRight({ size = 17, stroke = "#211C17", width = 2.2 }: { size?: number; stroke?: string; width?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M5 12h13M13 6l6 6-6 6" stroke={stroke} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Phone({ size = 17, fill = "#D99A2B" }: { size?: number; fill?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M6.5 3h3l1.5 4-2 1.5a12 12 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.5 5.2 2 2 0 0 1 6.5 3Z" fill={fill} />
    </svg>
  );
}

export function Plus({ size = 20, stroke = "#211C17" }: { size?: number; stroke?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 5v14M5 12h14" stroke={stroke} strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export function IconHandcraft({ size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M5 13c1-4 4-7 8-7M8 21l1.5-5M16 21l-1.5-5M9 16h6M7 13l-2 2M17 13l2 2" stroke="#211C17" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 6c1.5 0 3 1 3 3s-1.5 4-3 4-3-2-3-4 1.5-3 3-3Z" stroke="#211C17" strokeWidth="1.7" />
    </svg>
  );
}

export function IconColorSwatch({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="9" r="5" fill="#B5552F" />
      <circle cx="15" cy="11" r="5" fill="#D99A2B" opacity=".85" />
      <circle cx="11" cy="15" r="5" fill="#7A6A52" opacity=".75" />
    </svg>
  );
}

export function IconLeaf({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 3C7 8 7 16 12 21C17 16 17 8 12 3Z" stroke="#4A6B36" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M12 6v13" stroke="#4A6B36" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconTruck({ size = 22, stroke = "#211C17", accent = "#D99A2B" }: { size?: number; stroke?: string; accent?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M3 7h10v8H3z" stroke={stroke} strokeWidth="1.6" />
      <path d="M13 10h4l3 3v2h-7z" stroke={stroke} strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="7" cy="17" r="1.8" stroke={accent} strokeWidth="1.6" />
      <circle cx="16.5" cy="17" r="1.8" stroke={accent} strokeWidth="1.6" />
    </svg>
  );
}

export function IconCalculator({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="5" y="3" width="14" height="18" rx="2" stroke="#211C17" strokeWidth="1.6" />
      <path d="M8 7h8" stroke="#211C17" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="9" cy="12" r="1" fill="#D99A2B" />
      <circle cx="12" cy="12" r="1" fill="#D99A2B" />
      <circle cx="15" cy="12" r="1" fill="#D99A2B" />
      <circle cx="9" cy="16" r="1" fill="#211C17" />
      <circle cx="12" cy="16" r="1" fill="#211C17" />
    </svg>
  );
}

export function IconCorner({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M4 8h16M4 8l3-4h10l3 4M4 8v12h16V8" stroke="#D99A2B" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

export function IconSupplies({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M6 3h9l3 3v15H6z" stroke="#D99A2B" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 11h6M9 15h6" stroke="#D99A2B" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/* ===== Гарантии ===== */
export function IconTruckWarranty({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M4 8h11v8H4z" stroke="#B5552F" strokeWidth="1.6" />
      <path d="M15 10h4l2 3v3h-6z" stroke="#B5552F" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="8" cy="17" r="1.8" stroke="#211C17" strokeWidth="1.6" />
      <circle cx="17" cy="17" r="1.8" stroke="#211C17" strokeWidth="1.6" />
    </svg>
  );
}

export function IconReturn({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M3 12a9 9 0 1 1 4 7.5" stroke="#B5552F" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M3 20v-5h5" stroke="#B5552F" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconHeart({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10Z" stroke="#B5552F" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

export function IconLock({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="5" y="10" width="14" height="10" rx="2" stroke="#B5552F" strokeWidth="1.6" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="#B5552F" strokeWidth="1.6" />
    </svg>
  );
}

/* ===== Мессенджеры ===== */
export function IconWhatsApp({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M3 21l1.6-4.8A8 8 0 1 1 12 20a8 8 0 0 1-3.8-1L3 21Z" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M8.5 8.5c0 4 3 7 7 7l1-2-2.5-1-.8.9c-1.2-.4-2.3-1.5-2.7-2.7l.9-.8L10.5 7.5l-2 1Z" fill="#fff" />
    </svg>
  );
}

export function IconTelegram({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M21 4 3 11l5 2 2 6 3-4 5 4 3-15Z" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" fill="none" />
      <path d="M8 13l9-6-6 7" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Бренд-цвета мессенджеров РФ
export const VK_BG = "#0077FF";
export const MAX_BG = "linear-gradient(135deg,#7C5CFF,#2E90FF)";

/** Вордмарк VK (белый, на синем фоне-кнопке). */
export function VKMark({ size = 22 }: IconProps) {
  return (
    <span style={{ fontFamily: "var(--font-golos), sans-serif", fontWeight: 800, fontSize: Math.round(size * 0.62), color: "#fff", letterSpacing: ".01em", lineHeight: 1 }}>
      VK
    </span>
  );
}

/** Вордмарк мессенджера MAX (белый, на градиентном фоне-кнопке).
 *  Плейсхолдер под официальный логотип — заменяется на SVG при наличии. */
export function MaxMark({ size = 22 }: IconProps) {
  return (
    <span style={{ fontFamily: "var(--font-golos), sans-serif", fontWeight: 800, fontSize: Math.round(size * 0.5), color: "#fff", letterSpacing: ".03em", lineHeight: 1 }}>
      MAX
    </span>
  );
}
