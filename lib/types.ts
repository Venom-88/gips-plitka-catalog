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
