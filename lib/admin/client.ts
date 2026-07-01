// Тонкий клиент для админ-API. Куки (JWT) шлём автоматически (same-origin).
import { upload } from "@vercel/blob/client";

async function req<T = any>(method: string, url: string, body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    credentials: "include",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || `Ошибка ${res.status}`);
  return data as T;
}

export const api = {
  get: <T = any>(url: string) => req<T>("GET", url),
  post: <T = any>(url: string, body?: unknown) => req<T>("POST", url, body ?? {}),
  put: <T = any>(url: string, body?: unknown) => req<T>("PUT", url, body ?? {}),
  patch: <T = any>(url: string, body?: unknown) => req<T>("PATCH", url, body ?? {}),
  del: <T = any>(url: string) => req<T>("DELETE", url),
};

// Загрузка фото напрямую в Vercel Blob (браузер -> Blob), без лимита 4.5 МБ у функции.
export async function uploadImage(file: File): Promise<string> {
  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const blob = await upload(`gips/${safe}`, file, {
    access: "public",
    handleUploadUrl: "/api/upload",
    contentType: file.type || undefined,
  });
  return blob.url;
}
