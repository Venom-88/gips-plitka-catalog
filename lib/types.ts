// Клиент-безопасные типы (без Prisma) для презентационных компонентов.

export type ProductCardData = {
  id: string;
  slug: string;
  title: string;
  article: string | null;
  status: string | null;
  priceFrom: number;
  unit: string;
  colors: string[];
  extraColors: number;
  imageUrl: string | null;
  imagePos: string | null;
  categorySlug?: string | null;
};

export type ReviewData = {
  id: string;
  name: string;
  source: string;
  rating: number;
  text: string;
  avatarUrl: string | null;
};

export type CategoryData = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  priceFrom: number | null;
  badge: string | null;
  imageUrl: string | null;
  productCount?: number;
};

export const STATUS_BG: Record<string, string> = {
  Хит: "#B5552F",
  Новинка: "#4A6B36",
  "Под заказ": "#211C17",
};

export function formatPrice(n: number): string {
  return n.toLocaleString("ru-RU");
}

export function priceUnitLabel(unit: string): string {
  return `/${unit}`;
}

// ---- контакты: ссылки и формат телефона ----
export type ContactData = {
  phone: string;
  email: string | null;
  address: string;
  workingHours: string;
  vk: string | null;
  max: string | null;
} | null;

export function telHref(phone?: string | null): string {
  const clean = (phone || "").replace(/[^\d+]/g, "");
  return `tel:${clean || "+7"}`;
}

export function vkHref(vk?: string | null): string | null {
  if (!vk) return null;
  return /^https?:\/\//.test(vk) ? vk : `https://vk.com/${vk.replace(/^@/, "")}`;
}

export function maxHref(max?: string | null): string | null {
  if (!max) return null;
  return /^https?:\/\//.test(max) ? max : `https://max.ru/${max.replace(/^@/, "")}`;
}

/** +79997003257 -> +7 (999) 700-32-57; иначе как есть. */
export function formatPhoneDisplay(phone?: string | null): string {
  const d = (phone || "").replace(/\D/g, "");
  if (d.length === 11) {
    const n = d.slice(1);
    return `+7 (${n.slice(0, 3)}) ${n.slice(3, 6)}-${n.slice(6, 8)}-${n.slice(8, 10)}`;
  }
  return phone || "";
}
