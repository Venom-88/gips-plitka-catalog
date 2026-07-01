# Гипс Стиль 31 — сайт-каталог гипсовой плитки

Каталог домашней студии гипсовой плитки ручной работы (г. Губкин): витрина + заявки + админка.
Переработан из донора **MediaSunrise** под Гипс Стиль, облегчён и адаптирован под **Vercel**.

## Стек

- **Next.js 15 (App Router) + React 19 + TypeScript** — SSR/SSG ради SEO.
- **Prisma + PostgreSQL** — товары, категории, работы, отзывы, заявки, настройки, пользователи.
- **JWT (httpOnly cookie) + bcrypt** — вход в админку; **AES-256 (crypto-js)** — шифрование ПД заявок (152-ФЗ).
- **Vercel Blob** — хранение фото.
- Лёгкий бандл (~103–112 kB First Load JS): без three.js / framer-motion / Radix / gsap.

## Структура

```
app/
  (site)/           # публичные страницы (шапка/футер/нижняя панель):
    page.tsx        #   главная
    catalog/        #   каталог + фильтр/поиск, [category] — категория
    product/[slug]/ #   страница товара (Schema.org, похожие, форма заказа)
    gallery, about, contacts, not-found
  admin/            # CMS (клиентская SPA, без публичного chrome, noindex)
  api/              # route handlers: auth, leads, products, categories, works,
                    #   reviews, settings, contact-info, users, upload
  robots.ts, sitemap.ts, layout.tsx, globals.css
components/         # презентационные + admin/* (менеджеры CMS)
lib/
  catalog.ts        # доступ к данным каталога (server-only)
  prisma.ts, types.ts
  server/           # encryption, auth, telegram, sanitize, validation, api, leads
  admin/client.ts   # клиент админ-API
prisma/             # schema.prisma, migrations, seed.mjs
donor/              # исходник донора (референс; в деплой не идёт)
```

## Локальная разработка

```bash
# 1. Поднять локальную Postgres (Docker)
docker compose -f docker-compose.dev.yml up -d      # порт 5544

# 2. Зависимости + Prisma client
npm install

# 3. Применить миграции и наполнить демо-данными
npx prisma migrate deploy
npm run db:seed

# 4. Запуск
npm run dev            # http://localhost:3000
```

Локальная БД: `postgresql://postgres:postgres@localhost:5544/gips_style` (см. `.env`).

## Админка

`/admin` — вход `admin@gips31.ru` / `admin12345` (сменить после первого входа).
Разделы: Заявки · Товары · Категории · Работы · Отзывы · Настройки · Пользователи.

| Команда | Действие |
|---|---|
| `npm run dev` | дев-сервер |
| `npm run build` | прод-сборка (генерит Prisma client + миграции + Next) |
| `npm run db:seed` | залить демо-контент + админа |
| `npm run db:studio` | Prisma Studio — смотреть заявки, править данные |

## Деплой на Vercel

См. **[DEPLOY.md](DEPLOY.md)** — БД (Neon/Vercel Postgres), переменные окружения, Blob, домен и заметка про 152-ФЗ.

## Управление контентом

- **Фото** — загрузка в админке (Vercel Blob) или вставка URL; публичные компоненты сами показывают плейсхолдер, пока фото нет.
- **Товары/категории/работы/отзывы** — в админке; на главную «Хиты» попадают товары с флагом «Хит/на главную».
- **Заявки** — таблица `Lead` (ПД зашифрованы), уведомление в Telegram при настроенном боте.
- Публичные страницы кешируются (ISR, `revalidate = 60`).
