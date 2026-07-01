"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/admin/client";
import { A, Btn, Card, Empty, Pill } from "./ui";

type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  message: string | null;
  area: number | null;
  productSlug: string | null;
  source: string;
  status: string;
  createdAt: string;
};

const STATUS = [
  { value: "NEW", label: "Новая", color: A.amber },
  { value: "IN_PROGRESS", label: "В работе", color: "#2B5C9E" },
  { value: "COMPLETED", label: "Завершена", color: A.eco },
  { value: "ARCHIVED", label: "Архив", color: A.muted },
];
const SOURCE: Record<string, string> = { form: "Форма", product: "Товар", b2b: "B2B", calc: "Калькулятор" };

export default function LeadsManager() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  async function load() {
    setLoading(true);
    try {
      const r = await api.get<{ data: Lead[] }>("/api/leads");
      setLeads(r.data);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);

  async function setStatus(id: string, status: string) {
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, status } : l)));
    try {
      await api.patch(`/api/leads/${id}`, { status });
    } catch {
      load();
    }
  }
  async function remove(id: string) {
    if (!confirm("Удалить заявку?")) return;
    await api.del(`/api/leads/${id}`);
    setLeads((ls) => ls.filter((l) => l.id !== id));
  }

  if (loading) return <Empty>Загрузка…</Empty>;
  if (err) return <Empty>{err}</Empty>;
  if (leads.length === 0) return <Empty>Заявок пока нет.</Empty>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ fontSize: 12.5, color: A.muted }}>Всего заявок: {leads.length}</div>
      {leads.map((l) => {
        const st = STATUS.find((s) => s.value === l.status) ?? STATUS[0];
        return (
          <Card key={l.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: A.ink }}>{l.name}</div>
                <a href={`tel:${l.phone.replace(/[^\d+]/g, "")}`} style={{ fontSize: 13.5, color: A.amberDark, fontWeight: 600 }}>{l.phone}</a>
                {l.email && <div style={{ fontSize: 12.5, color: A.muted }}>{l.email}</div>}
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                <Pill color={st.color} bg={`${st.color}22`}>{st.label}</Pill>
                <span style={{ fontSize: 11, color: A.muted }}>{new Date(l.createdAt).toLocaleString("ru-RU")}</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "10px 0" }}>
              <Pill>{SOURCE[l.source] ?? l.source}</Pill>
              {l.area != null && <Pill>{l.area} м²</Pill>}
              {l.productSlug && <Pill>товар: {l.productSlug}</Pill>}
            </div>
            {l.message && <div style={{ fontSize: 13, color: "#5C5040", lineHeight: 1.5, marginBottom: 10 }}>{l.message}</div>}
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <select
                value={l.status}
                onChange={(e) => setStatus(l.id, e.target.value)}
                style={{ background: "#fff", border: `1px solid ${A.border}`, borderRadius: 9, padding: "7px 10px", fontSize: 12.5, fontFamily: "inherit", color: A.ink }}
              >
                {STATUS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              <Btn variant="danger" size="sm" onClick={() => remove(l.id)}>Удалить</Btn>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
