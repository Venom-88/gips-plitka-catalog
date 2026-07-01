"use client";

import type { CSSProperties, ReactNode } from "react";

export const A = {
  ink: "#211C17",
  paper: "#F1E9DB",
  cream: "#FBF6EC",
  amber: "#D99A2B",
  amberDark: "#B97E1E",
  muted: "#6F6253",
  border: "rgba(33,28,23,.12)",
  danger: "#B5552F",
  eco: "#4A6B36",
};

export function Btn({
  children,
  onClick,
  variant = "primary",
  type = "button",
  disabled,
  size = "md",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "danger" | "dark";
  type?: "button" | "submit";
  disabled?: boolean;
  size?: "sm" | "md";
}) {
  const bg = variant === "primary" ? A.amber : variant === "danger" ? A.danger : variant === "dark" ? A.ink : "transparent";
  const color = variant === "ghost" ? A.ink : variant === "primary" ? A.ink : "#FBF6EC";
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        background: bg,
        color,
        border: variant === "ghost" ? `1px solid ${A.border}` : "none",
        borderRadius: 10,
        padding: size === "sm" ? "7px 12px" : "10px 16px",
        fontSize: size === "sm" ? 12.5 : 14,
        fontWeight: 600,
        fontFamily: "inherit",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.55 : 1,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </button>
  );
}

const inputStyle: CSSProperties = {
  width: "100%",
  background: "#fff",
  border: `1px solid ${A.border}`,
  borderRadius: 10,
  padding: "10px 12px",
  fontSize: 14,
  fontFamily: "inherit",
  color: A.ink,
  outline: "none",
};

export function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  hint,
  required,
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  hint?: string;
  required?: boolean;
}) {
  return (
    <label style={{ display: "block", marginBottom: 12 }}>
      <div style={{ fontSize: 12, color: A.muted, marginBottom: 5, fontWeight: 600 }}>
        {label} {required && <span style={{ color: A.danger }}>*</span>}
      </div>
      <input type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} style={inputStyle} />
      {hint && <div style={{ fontSize: 11, color: A.muted, marginTop: 4 }}>{hint}</div>}
    </label>
  );
}

export function Area({ label, value, onChange, rows = 4, placeholder }: { label: string; value: string; onChange: (v: string) => void; rows?: number; placeholder?: string }) {
  return (
    <label style={{ display: "block", marginBottom: 12 }}>
      <div style={{ fontSize: 12, color: A.muted, marginBottom: 5, fontWeight: 600 }}>{label}</div>
      <textarea value={value} rows={rows} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} style={{ ...inputStyle, resize: "vertical" }} />
    </label>
  );
}

export function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <label style={{ display: "block", marginBottom: 12 }}>
      <div style={{ fontSize: 12, color: A.muted, marginBottom: 5, fontWeight: 600 }}>{label}</div>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={inputStyle}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, cursor: "pointer" }}>
      <span
        onClick={() => onChange(!checked)}
        style={{ width: 40, height: 23, borderRadius: 100, background: checked ? A.amber : "#cfc4b0", position: "relative", transition: "background .15s", flex: "none" }}
      >
        <span style={{ position: "absolute", top: 2, left: checked ? 19 : 2, width: 19, height: 19, borderRadius: "50%", background: "#fff", transition: "left .15s" }} />
      </span>
      <span style={{ fontSize: 13.5, color: A.ink, fontWeight: 500 }}>{label}</span>
    </label>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div style={{ background: A.cream, border: `1px solid rgba(33,28,23,.08)`, borderRadius: 14, padding: 16, ...style }}>{children}</div>
  );
}

export function Pill({ children, color = A.muted, bg = "rgba(33,28,23,.06)" }: { children: ReactNode; color?: string; bg?: string }) {
  return <span style={{ fontSize: 11, fontWeight: 700, color, background: bg, padding: "3px 9px", borderRadius: 100, whiteSpace: "nowrap" }}>{children}</span>;
}

export function Empty({ children }: { children: ReactNode }) {
  return <div style={{ textAlign: "center", padding: "40px 16px", color: A.muted, fontSize: 13.5 }}>{children}</div>;
}
