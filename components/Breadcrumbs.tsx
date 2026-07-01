import Link from "next/link";

export type Crumb = { href?: string; label: string };

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Хлебные крошки" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6, fontSize: 11.5, color: "#8C7E68" }}>
      {items.map((c, i) => {
        const last = i === items.length - 1;
        return (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            {c.href && !last ? (
              <Link href={c.href} className="link-amber" style={{ color: "#8C7E68" }}>
                {c.label}
              </Link>
            ) : (
              <span style={{ color: last ? "#6F6253" : "#8C7E68", fontWeight: last ? 600 : 400 }}>{c.label}</span>
            )}
            {!last && <span style={{ color: "#C4B8A4" }}>/</span>}
          </span>
        );
      })}
    </nav>
  );
}
