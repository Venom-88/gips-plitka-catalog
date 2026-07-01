import NotFoundContent from "@/components/NotFoundContent";

// Глобальный 404 (для маршрутов вне публичной группы). Центрируем как мобильную колонку.
export default function NotFound() {
  return (
    <div style={{ maxWidth: 480, margin: "0 auto" }}>
      <NotFoundContent />
    </div>
  );
}
