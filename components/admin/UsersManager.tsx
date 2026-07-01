"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/admin/client";
import { A, Btn, Card, Empty, Field, Pill, Select } from "./ui";

type User = { id: string; name: string; email: string; role: string; permissions: string[]; createdAt: string };

const ROLES = [
  { value: "ADMIN", label: "Администратор" },
  { value: "EDITOR", label: "Редактор" },
  { value: "VIEWER", label: "Наблюдатель" },
];

export default function UsersManager({ currentUserId }: { currentUserId?: string }) {
  const [items, setItems] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "EDITOR" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [adding, setAdding] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const r = await api.get<{ data: User[] }>("/api/users");
      setItems(r.data);
    } catch (e) { setErr(e instanceof Error ? e.message : "Ошибка"); }
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function create() {
    setBusy(true); setErr("");
    try {
      await api.post("/api/users", { ...form, permissions: [] });
      setForm({ name: "", email: "", password: "", role: "EDITOR" });
      setAdding(false); await load();
    } catch (e) { setErr(e instanceof Error ? e.message : "Ошибка"); } finally { setBusy(false); }
  }
  async function changeRole(id: string, role: string) {
    setItems((xs) => xs.map((u) => (u.id === id ? { ...u, role } : u)));
    try { await api.put(`/api/users/${id}`, { role }); } catch { load(); }
  }
  async function remove(id: string) {
    if (!confirm("Удалить пользователя?")) return;
    try { await api.del(`/api/users/${id}`); setItems((xs) => xs.filter((x) => x.id !== id)); }
    catch (e) { alert(e instanceof Error ? e.message : "Ошибка"); }
  }

  if (loading) return <Empty>Загрузка…</Empty>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ fontSize: 12.5, color: A.muted }}>Пользователей: {items.length}</div>
        <Btn onClick={() => setAdding((v) => !v)}>{adding ? "Отмена" : "+ Добавить"}</Btn>
      </div>

      {adding && (
        <Card style={{ marginBottom: 14 }}>
          <Field label="Имя" value={form.name} onChange={set("name")} required />
          <Field label="Email" value={form.email} onChange={set("email")} type="email" required />
          <Field label="Пароль" value={form.password} onChange={set("password")} type="password" required />
          <Select label="Роль" value={form.role} onChange={set("role")} options={ROLES} />
          {err && <div style={{ fontSize: 12.5, color: A.danger, marginBottom: 10 }}>{err}</div>}
          <Btn onClick={create} disabled={busy}>{busy ? "Создаём…" : "Создать пользователя"}</Btn>
        </Card>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((u) => (
          <Card key={u.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: A.ink }}>{u.name} {u.id === currentUserId && <Pill color={A.eco} bg="rgba(74,107,54,.12)">вы</Pill>}</div>
              <div style={{ fontSize: 12, color: A.muted }}>{u.email}</div>
            </div>
            <select value={u.role} onChange={(e) => changeRole(u.id, e.target.value)} style={{ background: "#fff", border: `1px solid ${A.border}`, borderRadius: 9, padding: "6px 8px", fontSize: 12, fontFamily: "inherit" }}>
              {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
            {u.id !== currentUserId && <Btn variant="danger" size="sm" onClick={() => remove(u.id)}>×</Btn>}
          </Card>
        ))}
      </div>
    </div>
  );
}
