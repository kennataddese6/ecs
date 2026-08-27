import { requireAdmin } from "@/lib/auth";
import { AdminSidebar } from "@/components/layout/admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background text-foreground min-w-0 overflow-x-hidden">
      <AdminSidebar />
      <main className="flex-1 p-4 sm:p-6 md:p-8 min-w-0 overflow-x-auto w-full">{children}</main>
    </div>
  );
}
