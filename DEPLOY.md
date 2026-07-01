# Деплой «Гипс Стиль 31» на Vercel

Стек: **Next.js 15 (App Router, SSR) + Prisma + PostgreSQL**. Фото — **Vercel Blob**.

## 1. База данных (Postgres)

Нужна managed-Postgres (у Vercel нет своей БД в рантайме). Варианты:
- **Vercel Postgres** (на движке Neon) — подключается в пару кликов: Vercel → проект → **Storage → Create Database → Postgres**. Переменные `DATABASE_URL` подставятся автоматически.
- **Neon** напрямую (neon.tech) — создайте проект, скопируйте connection string (`?sslmode=require`).

> Prisma: для миграций лучше **direct** (не-pooled) URL. Если используете pooled URL Neon, добавьте `DIRECT_URL` и укажите его в `schema.prisma` (`directUrl`). Для нашего размера достаточно одного `DATABASE_URL`.

## 2. Импорт проекта в Vercel

Через Git (рекомендуется): запушьте репозиторий на GitHub → Vercel → **Add New → Project → Import**. Framework определится как **Next.js** автоматически.

Или через CLI:
```bash
npm i -g vercel
vercel        # превью-деплой
vercel --prod # прод
```

## 3. Переменные окружения (Vercel → Settings → Environment Variables)

Скопируйте из `.env.production.example`:

| Переменная | Значение |
|---|---|
| `DATABASE_URL` | строка подключения Neon/Vercel Postgres |
| `ENCRYPTION_KEY` | ключ AES для ПД заявок (сгенерирован в `.env.production.example`) |
| `JWT_SECRET` | секрет для входа в админку |
| `NEXT_PUBLIC_SITE_URL` | `https://ваш-домен.ru` |
| `BLOB_READ_WRITE_TOKEN` | появится сам при подключении Blob (шаг 5) |

## 4. Первый деплой = миграции применятся сами

Build-команда — `prisma generate && prisma migrate deploy && next build`. При деплое схема развернётся в вашей Postgres автоматически.

Дальше **один раз наполните БД** (категории, товары, админ). Локально, указав прод-URL:
```bash
# PowerShell
$env:DATABASE_URL="<Neon URL>"; npm run db:seed
```
Создастся админ: `admin@gips31.ru` / `admin12345` — **смените пароль после входа** (в админке → Пользователи).

## 5. Загрузка фото — Vercel Blob

Vercel → проект → **Storage → Create → Blob**. Переменная `BLOB_READ_WRITE_TOKEN` подставится автоматически. После этого в админке заработает загрузка файлов (до подключения — можно вставлять URL картинок вручную).

## 6. Домен

Vercel → **Settings → Domains** → добавьте свой домен, пропишите DNS. `NEXT_PUBLIC_SITE_URL` обновите на него (для canonical/sitemap).

## 7. После деплоя — проверьте
- `/` — главная, `/catalog` — каталог с фильтром, `/product/...` — товар.
- `/sitemap.xml`, `/robots.txt` — отдаются.
- `/admin` — вход, смена пароля, добавление товара с фото.
- Отправьте тестовую заявку → появилась в админке (Заявки), пришло уведомление в Telegram (если настроен).

---

## ⚠️ 152-ФЗ (важно)

ТЗ требует хранение персональных данных граждан РФ **на серверах в РФ**. **Vercel и Neon расположены вне РФ.** Для строгого соответствия:
- либо хостить в РФ (VPS/облако РФ) вместо Vercel,
- либо держать **БД заявок в РФ**, а витрину — на Vercel,
- либо использовать это как MVP/демо, а перед публичным запуском перенести ПД в РФ-хостинг.

Персональные данные заявок у нас **шифруются (AES-256)**, но требование о локализации хранения это не заменяет. Решение за вами — при выборе Vercel вы это принимаете.
