"use client";

import { useRef, useState } from "react";
import { uploadImage } from "@/lib/admin/client";
import { A } from "./ui";

/** Галерея доп. фото: загрузка нескольких файлов + удаление. Значение — массив URL. */
export default function GalleryField({
  label = "Доп. фото (галерея)",
  value,
  onChange,
}: {
  label?: string;
  value: string[];
  onChange: (urls: string[]) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setBusy(true);
    setErr("");
    try {
      const urls: string[] = [];
      for (const f of files) urls.push(await uploadImage(f));
      onChange([...value, ...urls]);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Ошибка загрузки");
    } finally {
      setBusy(false);
      if (ref.current) ref.current.value = "";
    }
  }

  function remove(i: number) {
    onChange(value.filter((_, idx) => idx !== i));
  }

  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 12, color: A.muted, marginBottom: 5, fontWeight: 600 }}>{label}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {value.map((url, i) => (
          <div key={i} style={{ position: "relative", width: 72, height: 72, borderRadius: 10, overflow: "hidden", border: `1px solid ${A.border}` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <button
              type="button"
              onClick={() => remove(i)}
              aria-label="Удалить"
              style={{ position: "absolute", top: 2, right: 2, width: 20, height: 20, borderRadius: 6, border: "none", background: "rgba(33,28,23,.75)", color: "#fff", fontSize: 12, cursor: "pointer", lineHeight: 1 }}
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => ref.current?.click()}
          disabled={busy}
          style={{ width: 72, height: 72, borderRadius: 10, border: `1.5px dashed ${A.border}`, background: "#fff", color: A.muted, fontSize: 12, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}
        >
          {busy ? "…" : <><span style={{ fontSize: 20, lineHeight: 1 }}>+</span>фото</>}
        </button>
        <input ref={ref} type="file" accept="image/*" multiple onChange={onFiles} style={{ display: "none" }} />
      </div>
      {err && <div style={{ fontSize: 11, color: A.danger, marginTop: 5 }}>{err}</div>}
    </div>
  );
}
