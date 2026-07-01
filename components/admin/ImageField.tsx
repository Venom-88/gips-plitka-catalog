"use client";

import { useRef, useState } from "react";
import { uploadImage } from "@/lib/admin/client";
import { A } from "./ui";

function parsePos(pos?: string | null): { x: number; y: number } {
  const m = (pos || "50% 50%").match(/(-?\d+(?:\.\d+)?)%\s+(-?\d+(?:\.\d+)?)%/);
  return m ? { x: Number(m[1]), y: Number(m[2]) } : { x: 50, y: 50 };
}
const clamp = (n: number) => Math.max(0, Math.min(100, n));

/**
 * Поле изображения: URL или загрузка файла + выбор видимой области кадра
 * (перетаскивание фокуса, как выбор аватарки). `aspect` = ширина/высота слота.
 */
export default function ImageField({
  label = "Изображение",
  value,
  onChange,
  pos,
  onPosChange,
  aspect = 16 / 9,
}: {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  pos?: string | null;
  onPosChange?: (pos: string) => void;
  aspect?: number;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [dragging, setDragging] = useState(false);
  const { x, y } = parsePos(pos);
  const showPicker = Boolean(value) && Boolean(onPosChange);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setErr("");
    try {
      const url = await uploadImage(file);
      onChange(url);
      onPosChange?.("50% 50%"); // сброс фокуса при новой картинке
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Ошибка загрузки");
    } finally {
      setBusy(false);
      if (ref.current) ref.current.value = "";
    }
  }

  function setFromEvent(clientX: number, clientY: number) {
    const box = boxRef.current;
    if (!box || !onPosChange) return;
    const r = box.getBoundingClientRect();
    const nx = clamp(((clientX - r.left) / r.width) * 100);
    const ny = clamp(((clientY - r.top) / r.height) * 100);
    onPosChange(`${Math.round(nx)}% ${Math.round(ny)}%`);
  }

  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 12, color: A.muted, marginBottom: 5, fontWeight: 600 }}>{label}</div>

      {/* URL + загрузка */}
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          value={value}
          placeholder="URL изображения или загрузите файл"
          onChange={(e) => onChange(e.target.value)}
          style={{ flex: 1, background: "#fff", border: `1px solid ${A.border}`, borderRadius: 10, padding: "9px 11px", fontSize: 13, fontFamily: "inherit", color: A.ink, outline: "none" }}
        />
        <button
          type="button"
          onClick={() => ref.current?.click()}
          disabled={busy}
          style={{ flex: "none", background: A.ink, color: "#FBF6EC", border: "none", borderRadius: 9, padding: "9px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", opacity: busy ? 0.6 : 1, whiteSpace: "nowrap" }}
        >
          {busy ? "…" : "Файл"}
        </button>
        {value && (
          <button type="button" onClick={() => onChange("")} style={{ flex: "none", background: "transparent", border: `1px solid ${A.border}`, borderRadius: 9, padding: "9px 10px", fontSize: 12, cursor: "pointer", color: A.muted }}>
            ✕
          </button>
        )}
        <input ref={ref} type="file" accept="image/*" onChange={onFile} style={{ display: "none" }} />
      </div>
      {err && <div style={{ fontSize: 11, color: A.danger, marginTop: 5 }}>{err}</div>}

      {/* Выбор области кадра */}
      {showPicker && (
        <div style={{ marginTop: 10 }}>
          <div style={{ fontSize: 11, color: A.muted, marginBottom: 6 }}>
            Область показа — потяните точку по фото (как на сайте):
          </div>
          <div
            ref={boxRef}
            onPointerDown={(e) => {
              (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
              setDragging(true);
              setFromEvent(e.clientX, e.clientY);
            }}
            onPointerMove={(e) => dragging && setFromEvent(e.clientX, e.clientY)}
            onPointerUp={() => setDragging(false)}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 360,
              aspectRatio: String(aspect),
              borderRadius: 12,
              overflow: "hidden",
              border: `1px solid ${A.border}`,
              cursor: "crosshair",
              touchAction: "none",
              userSelect: "none",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt=""
              draggable={false}
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: `${x}% ${y}%`, pointerEvents: "none" }}
            />
            <span
              style={{
                position: "absolute",
                left: `${x}%`,
                top: `${y}%`,
                width: 22,
                height: 22,
                marginLeft: -11,
                marginTop: -11,
                borderRadius: "50%",
                border: "2px solid #fff",
                boxShadow: "0 0 0 2px rgba(0,0,0,.35)",
                background: "rgba(217,154,43,.35)",
                pointerEvents: "none",
              }}
            />
          </div>
          <div style={{ fontSize: 10.5, color: A.muted, marginTop: 5 }}>Фокус: {Math.round(x)}% / {Math.round(y)}%</div>
        </div>
      )}
    </div>
  );
}
