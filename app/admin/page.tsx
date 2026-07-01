import AdminApp from "@/components/admin/AdminApp";

// Клиентская SPA-админка. Данные — через /api/* (JWT-cookie).
export const dynamic = "force-dynamic";

export default function AdminPage() {
  return <AdminApp />;
}
