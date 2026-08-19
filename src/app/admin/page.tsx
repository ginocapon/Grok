import { AdminCMS } from "@/components/admin/AdminCMS";

export const metadata = {
  title: "Admin — Grok CMS",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminCMS />;
}
