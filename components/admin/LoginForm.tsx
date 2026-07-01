"use client";

import { useState } from "react";
import { api } from "@/lib/admin/client";
import { A, Btn } from "./ui";
import { LogoHex, BITTER } from "../icons";

export default function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      await api.post("/api/auth/login", { email, password });
      onLogin();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Ошибка входа");
    } finally {
      setBusy(false);
    }
  }

  const input: React.CSSProperties = {
    width: "100%",
    background: "#fff",
    border: `1px solid ${A.border}`,
    borderRadius: 11,
    padding: "13px 14px",
    fontSize: 14,
    fontFamily: "inherit",
    color: A.ink,
    outline: "none",
    marginBottom: 10,
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: A.paper, padding: 20 }}>
      <form onSubmit={submit} style={{ width: "100%", maxWidth: 360, background: A.cream, border: "1px solid rgba(33,28,23,.08)", borderRadius: 18, padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <LogoHex size={38} />
          <div>
            <div style={{ fontFamily: BITTER, fontWeight: 800, fontSize: 16, color: A.ink }}>Админка · Гипс Стиль 31</div>
            <div style={{ fontSize: 11.5, color: A.muted, marginTop: 2 }}>Вход для сотрудников</div>
          </div>
        </div>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" style={input} />
        <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" style={input} />
        {err && <div style={{ fontSize: 12.5, color: A.danger, marginBottom: 10 }}>{err}</div>}
        <div style={{ marginTop: 4 }}>
          <Btn type="submit" disabled={busy}>{busy ? "Входим…" : "Войти"}</Btn>
        </div>
      </form>
    </div>
  );
}
