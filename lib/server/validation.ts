import { z } from "zod";

const slug = z
  .string()
  .min(2)
  .max(120)
  .regex(/^[a-z0-9-]+$/, "Slug: только строчные латинские буквы, цифры и дефисы");

const hex = z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Некорректный цвет");

// ---- Вход в админку ----
export const loginSchema = z.object({
  email: z.string().email("Некорректный email"),
  password: z.string().min(6, "Пароль минимум 6 символов").max(100),
});

// ---- Заявка (публичная форма) ----
export const leadSchema = z.object({
  name: z.string().min(2, "Укажите имя").max(120),
  phone: z.string().min(6, "Укажите телефон").max(40),
  email: z.string().email().max(120).optional().or(z.literal("")),
  message: z.string().max(2000).optional().or(z.literal("")),
  area: z.number().positive().max(100000).optional().nullable(),
  productSlug: z.string().max(120).optional().nullable(),
  source: z.enum(["form", "b2b", "calc", "product"]).optional(),
  consent: z.boolean().refine((v) => v === true, "Требуется согласие на обработку ПД"),
  // honeypot: скрытое поле, у людей пустое
  company: z.string().optional(),
});

// ---- Товар ----
export const productSchema = z.object({
  slug,
  title: z.string().min(2).max(200),
  article: z.string().max(60).optional().nullable(),
  description: z.string().max(8000).optional().nullable(),
  status: z.string().max(40).optional().nullable(),
  priceFrom: z.number().int().min(0),
  unit: z.string().max(10).optional(),
  colors: z.array(hex).max(30).optional(),
  extraColors: z.number().int().min(0).max(99).optional(),
  size: z.string().max(120).optional().nullable(),
  coverage: z.number().positive().max(1000).optional().nullable(),
  weight: z.string().max(60).optional().nullable(),
  material: z.string().max(120).optional().nullable(),
  imageUrl: z.string().max(500).optional().nullable().or(z.literal("")),
  imagePos: z.string().max(20).optional().nullable(),
  gallery: z.array(z.string().max(500)).max(20).optional(),
  inStock: z.boolean().optional(),
  isBestseller: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  htmlContent: z.string().max(100000).optional().nullable(),
  seoTitle: z.string().max(200).optional().nullable(),
  seoDescription: z.string().max(400).optional().nullable(),
  categoryId: z.string().optional().nullable(),
});
export const productUpdateSchema = productSchema.partial();

// ---- Категория ----
export const categorySchema = z.object({
  slug,
  title: z.string().min(2).max(120),
  subtitle: z.string().max(200).optional().nullable(),
  description: z.string().max(8000).optional().nullable(),
  icon: z.string().max(20).optional().nullable(),
  imageUrl: z.string().max(500).optional().nullable().or(z.literal("")),
  imagePos: z.string().max(20).optional().nullable(),
  priceFrom: z.number().int().min(0).optional().nullable(),
  badge: z.string().max(40).optional().nullable(),
  sortOrder: z.number().int().optional(),
  seoTitle: z.string().max(200).optional().nullable(),
  seoDescription: z.string().max(400).optional().nullable(),
});
export const categoryUpdateSchema = categorySchema.partial();

// ---- Работа (портфолио) ----
export const workSchema = z.object({
  slug,
  title: z.string().min(2).max(200),
  description: z.string().max(4000).optional().nullable(),
  tag: z.string().max(60).optional().nullable(),
  imageUrl: z.string().max(500).optional().nullable().or(z.literal("")),
  imagePos: z.string().max(20).optional().nullable(),
  gallery: z.array(z.string().max(500)).max(30).optional(),
  year: z.number().int().min(2000).max(2100).optional().nullable(),
  featured: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});
export const workUpdateSchema = workSchema.partial();

// ---- Отзыв ----
export const reviewSchema = z.object({
  name: z.string().min(2).max(120),
  source: z.string().max(40),
  rating: z.number().int().min(1).max(5).optional(),
  text: z.string().min(2).max(2000),
  avatarUrl: z.string().max(500).optional().nullable().or(z.literal("")),
  published: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});
export const reviewUpdateSchema = reviewSchema.partial();

// ---- Пользователь (админка) ----
export const userSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  password: z.string().min(6).max(100),
  role: z.enum(["ADMIN", "EDITOR", "VIEWER"]).optional(),
  permissions: z.array(z.string()).optional(),
});
export const userUpdateSchema = userSchema.partial();

// ---- Настройки ----
export const settingsSchema = z.object({
  siteName: z.string().max(120).optional(),
  siteDescription: z.string().max(400).optional(),
  telegramBotToken: z.string().max(200).optional().nullable(),
  telegramChatId: z.string().max(120).optional().nullable(),
  heroImageUrl: z.string().max(500).optional().nullable().or(z.literal("")),
  heroImagePos: z.string().max(20).optional().nullable(),
  aboutImageUrl: z.string().max(500).optional().nullable().or(z.literal("")),
  aboutImagePos: z.string().max(20).optional().nullable(),
});

// ---- Контактная информация ----
export const contactInfoSchema = z.object({
  phone: z.string().max(60),
  email: z.string().max(120).optional().nullable().or(z.literal("")),
  address: z.string().max(300),
  workingHours: z.string().max(120).optional(),
  vk: z.string().max(200).optional().nullable().or(z.literal("")),
  max: z.string().max(200).optional().nullable().or(z.literal("")),
});
