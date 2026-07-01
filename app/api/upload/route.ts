import { put } from "@vercel/blob";
import { ok, fail, requireSession } from "@/lib/server/api";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Загрузка фото в Vercel Blob. Требует BLOB_READ_WRITE_TOKEN (в Vercel добавляется автоматически
// при подключении Blob-хранилища). Локально без токена — вернём понятную ошибку, можно вставлять URL вручную.
export async function POST(req: Request) {
  const guard = await requireSession("EDITOR");
  if (guard instanceof NextResponse) return guard;

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return fail(
      "Загрузка фото не настроена: добавьте хранилище Vercel Blob (переменная BLOB_READ_WRITE_TOKEN). Пока можно вставить URL картинки вручную.",
      501
    );
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return fail("Файл не передан", 400);
  if (file.size > 8 * 1024 * 1024) return fail("Файл больше 8 МБ", 400);

  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const blob = await put(`gips/${Date.now()}-${safe}`, file, { access: "public" });
  return ok({ url: blob.url });
}
