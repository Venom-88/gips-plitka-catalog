import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { getSession, hasRole } from "@/lib/server/auth";

export const runtime = "nodejs";

// Клиентская загрузка в Vercel Blob: файл идёт напрямую браузер -> Blob,
// минуя serverless-функцию (у которой лимит тела ~4.5 МБ). Функция лишь выдаёт
// одноразовый токен и проверяет авторизацию.
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;
  try {
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        const session = await getSession();
        if (!session || !hasRole(session, "EDITOR")) {
          throw new Error("Требуется авторизация");
        }
        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"],
          addRandomSuffix: true,
          maximumSizeInBytes: 15 * 1024 * 1024, // до 15 МБ
        };
      },
      onUploadCompleted: async () => {
        // ничего не сохраняем на сервере: клиент получает url и кладёт его в объект
      },
    });
    return NextResponse.json(json);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Ошибка загрузки" },
      { status: 400 }
    );
  }
}
