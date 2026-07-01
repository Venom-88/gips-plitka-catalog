import type { CSSProperties } from "react";
import Image from "next/image";

/**
 * Плейсхолдер под реальное фото из админки/CMS.
 * Фото из Vercel Blob рендерим через next/image (оптимизация: ресайз + WebP/AVIF, быстрая загрузка).
 * Прочие URL / data-URI — обычный <img>. Без src — аккуратная заглушка.
 */
export default function ImageSlot({
  src,
  alt,
  placeholder,
  width = "100%",
  height,
  shape = "rect",
  radius,
  style,
  priority = false,
  objectPosition,
  sizes = "(max-width: 900px) 100vw, 500px",
}: {
  src?: string | null;
  alt?: string;
  placeholder?: string;
  width?: number | string;
  height: number | string;
  shape?: "rect" | "circle";
  radius?: number;
  style?: CSSProperties;
  priority?: boolean;
  objectPosition?: string | null; // фокус кадра, напр. "50% 30%"
  sizes?: string;
}) {
  const circle = shape === "circle";
  const borderRadius = circle ? "50%" : radius ?? 0;

  const base: CSSProperties = {
    display: "block",
    width,
    height,
    borderRadius,
    objectFit: "cover",
    ...style,
  };

  if (src) {
    const optimized = src.includes(".blob.vercel-storage.com");
    if (optimized) {
      return (
        <span style={{ position: "relative", display: "block", width, height, borderRadius, overflow: "hidden", ...style }}>
          <Image
            src={src}
            alt={alt ?? placeholder ?? ""}
            fill
            priority={priority}
            sizes={sizes}
            style={{ objectFit: "cover", objectPosition: objectPosition || "center" }}
          />
        </span>
      );
    }
    return (
      <img
        src={src}
        alt={alt ?? placeholder ?? ""}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        style={{ ...base, objectPosition: objectPosition || "center" }}
      />
    );
  }

  // Заглушка
  return (
    <div
      role="img"
      aria-label={alt ?? placeholder ?? "Изображение"}
      style={{
        ...base,
        background: "#E7DECE",
        color: "#8C7E68",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        textAlign: "center",
        padding: 10,
      }}
    >
      <svg width={circle ? 18 : 26} height={circle ? 18 : 26} viewBox="0 0 24 24" fill="none">
        <rect x="3" y="5" width="18" height="14" rx="2" stroke="#B7A98C" strokeWidth="1.5" />
        <circle cx="8.5" cy="10" r="1.6" fill="#B7A98C" />
        <path d="M5 17l4.5-4.5 3 3L16 11l3 4" stroke="#B7A98C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {placeholder && !circle && (
        <span style={{ fontSize: 11, fontWeight: 500, lineHeight: 1.3, maxWidth: "85%" }}>
          {placeholder}
        </span>
      )}
    </div>
  );
}
