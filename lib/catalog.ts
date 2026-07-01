import "server-only";
import { prisma } from "@/lib/prisma";
import type { ProductCardData, ReviewData, CategoryData } from "@/lib/types";

// Все чтения обёрнуты в safe(): если БД недоступна (напр. первый деплой без Postgres),
// возвращается пустой результат, и публичные страницы всё равно открываются.
async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    if (process.env.NODE_ENV !== "production") console.error("catalog read failed:", e);
    return fallback;
  }
}

// ---- маппинг Prisma -> клиент-безопасные типы ----
type PrismaProduct = {
  id: string; slug: string; title: string; article: string | null;
  status: string | null; priceFrom: number; unit: string;
  colors: string[]; extraColors: number; imageUrl: string | null; imagePos: string | null;
  category?: { slug: string; title: string } | null;
};

export function toCard(p: PrismaProduct): ProductCardData {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    article: p.article,
    status: p.status,
    priceFrom: p.priceFrom,
    unit: p.unit,
    colors: p.colors,
    extraColors: p.extraColors,
    imageUrl: p.imageUrl,
    imagePos: p.imagePos,
    categorySlug: p.category?.slug ?? null,
  };
}

const cardSelect = {
  id: true, slug: true, title: true, article: true, status: true,
  priceFrom: true, unit: true, colors: true, extraColors: true, imageUrl: true, imagePos: true,
  category: { select: { slug: true, title: true } },
} as const;

export function getBestsellers(): Promise<ProductCardData[]> {
  return safe(async () => {
    const rows = await prisma.product.findMany({
      where: { isBestseller: true },
      orderBy: { sortOrder: "asc" },
      select: cardSelect,
    });
    return rows.map(toCard);
  }, []);
}

export function getAllProductCards(): Promise<ProductCardData[]> {
  return safe(async () => {
    const rows = await prisma.product.findMany({
      // группируем по категории (её порядок), затем по порядку товара внутри категории
      orderBy: [{ category: { sortOrder: "asc" } }, { sortOrder: "asc" }, { createdAt: "desc" }],
      select: cardSelect,
    });
    return rows.map(toCard);
  }, []);
}

export function getReviews(): Promise<ReviewData[]> {
  return safe(
    () =>
      prisma.review.findMany({
        where: { published: true },
        orderBy: { sortOrder: "asc" },
        select: { id: true, name: true, source: true, rating: true, text: true, avatarUrl: true },
      }),
    []
  );
}

export function getCategoriesWithCounts(): Promise<CategoryData[]> {
  return safe(async () => {
    const rows = await prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      select: {
        id: true, slug: true, title: true, subtitle: true, priceFrom: true,
        badge: true, imageUrl: true, _count: { select: { products: true } },
      },
    });
    return rows.map((c) => ({
      id: c.id, slug: c.slug, title: c.title, subtitle: c.subtitle,
      priceFrom: c.priceFrom, badge: c.badge, imageUrl: c.imageUrl, productCount: c._count.products,
    }));
  }, []);
}

export function getCategoryBySlug(slug: string) {
  return safe(
    () =>
      prisma.category.findUnique({
        where: { slug },
        include: {
          products: { orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }], select: cardSelect },
        },
      }),
    null
  );
}

export function getProductBySlug(slug: string) {
  return safe(
    () =>
      prisma.product.findUnique({
        where: { slug },
        include: { category: { select: { slug: true, title: true } } },
      }),
    null
  );
}

export function getRelatedProducts(categoryId: string | null, excludeId: string): Promise<ProductCardData[]> {
  if (!categoryId) return Promise.resolve([]);
  return safe(async () => {
    const rows = await prisma.product.findMany({
      where: { categoryId, NOT: { id: excludeId } },
      orderBy: { sortOrder: "asc" },
      take: 6,
      select: cardSelect,
    });
    return rows.map(toCard);
  }, []);
}

export function getFeaturedWorks() {
  return safe(() => prisma.work.findMany({ orderBy: { sortOrder: "asc" } }), []);
}

/** Карта slug -> {фото, фокус} категории — для блока «Популярные категории» на главной. */
export async function getCategoryImageMap(): Promise<Record<string, { imageUrl: string | null; imagePos: string | null }>> {
  const rows = await safe(
    () => prisma.category.findMany({ select: { slug: true, imageUrl: true, imagePos: true } }),
    [] as { slug: string; imageUrl: string | null; imagePos: string | null }[]
  );
  const map: Record<string, { imageUrl: string | null; imagePos: string | null }> = {};
  for (const c of rows) map[c.slug] = { imageUrl: c.imageUrl, imagePos: c.imagePos };
  return map;
}

export function getContactInfo() {
  return safe(() => prisma.contactInfo.findFirst(), null);
}

/** Глобальные изображения сайта (hero, about) + фокус кадра. */
export async function getSiteImages() {
  const s = await safe(
    () =>
      prisma.siteSettings.findFirst({
        select: { heroImageUrl: true, heroImagePos: true, aboutImageUrl: true, aboutImagePos: true },
      }),
    null
  );
  return {
    heroImageUrl: s?.heroImageUrl ?? null,
    heroImagePos: s?.heroImagePos ?? null,
    aboutImageUrl: s?.aboutImageUrl ?? null,
    aboutImagePos: s?.aboutImagePos ?? null,
  };
}

export function getAllProductSlugs() {
  return safe(() => prisma.product.findMany({ select: { slug: true } }), []);
}

export function getAllCategorySlugs() {
  return safe(() => prisma.category.findMany({ select: { slug: true } }), []);
}
