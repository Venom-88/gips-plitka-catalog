// Тонкий клиент для админ-API. Куки (JWT) шлём автоматически (same-origin).

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

export async function uploadImage(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: form, credentials: "include" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || "Не удалось загрузить файл");
  return (data as { url: string }).url;
}
