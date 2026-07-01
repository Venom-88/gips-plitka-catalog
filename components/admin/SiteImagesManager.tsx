"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/admin/client";
import { A, Btn, Card, Empty } from "./ui";
import ImageField from "./ImageField";

export default function SiteImagesManager() {
  const [heroUrl, setHeroUrl] = useState("");
  const [heroPos, setHeroPos] = useState("50% 50%");
  const [aboutUrl, setAboutUrl] = useState("");
  const [aboutPos, setAboutPos] = useState("50% 50%");
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const s = await api.get("/api/settings");
        setHeroUrl(s.heroImageUrl ?? "");
        setHeroPos(s.heroImagePos ?? "50% 50%");
        setAboutUrl(s.aboutImageUrl ?? "");
        setAboutPos(s.aboutImagePos ?? "50% 50%");
      } catch (e) {
        setErr(e instanceof Error ? e.message : "Ошибка загрузки");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function save() {
    setMsg("");
    setErr("");
    try {
      await api.put("/api/settings", {
        heroImageUrl: heroUrl,
        heroImagePos: heroPos,
        aboutImageUrl: aboutUrl,
        aboutImagePos: aboutPos,
      });
      setMsg("Изображения сохранены");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Ошибка");
    }
  }

  if (loading) return <Empty>Загрузка…</Empty>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ fontSize: 12.5, color: A.muted }}>
        Глобальные изображения сайта. Товары, категории и работы — со своими фото в соответствующих разделах.
        После загрузки потяните точку по фото, чтобы выбрать видимую область (как аватарку).
      </div>
      {msg && <div style={{ fontSize: 13, color: A.eco, background: "rgba(74,107,54,.1)", padding: "8px 12px", borderRadius: 10 }}>{msg}</div>}
      {err && <div style={{ fontSize: 13, color: A.danger }}>{err}</div>}

      <Card>
        <h3 style={{ margin: "0 0 4px", fontSize: 16, color: A.ink }}>Главный экран (hero)</h3>
        <div style={{ fontSize: 11.5, color: A.muted, marginBottom: 12 }}>Широкое фото на первом экране главной. Держите низ-лево спокойным — там заголовок.</div>
        <ImageField label="Фоновое фото главной" value={heroUrl} onChange={setHeroUrl} pos={heroPos} onPosChange={setHeroPos} aspect={16 / 9} />
      </Card>

      <Card>
        <h3 style={{ margin: "0 0 4px", fontSize: 16, color: A.ink }}>Блок «О студии»</h3>
        <div style={{ fontSize: 11.5, color: A.muted, marginBottom: 12 }}>Фото мастера/мастерской в блоке «О студии».</div>
        <ImageField label="Фото мастерской" value={aboutUrl} onChange={setAboutUrl} pos={aboutPos} onPosChange={setAboutPos} aspect={3 / 2} />
      </Card>

      <div>
        <Btn onClick={save}>Сохранить изображения</Btn>
      </div>
    </div>
  );
}
