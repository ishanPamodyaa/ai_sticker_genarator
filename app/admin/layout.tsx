import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/layout/admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="flex min-h-screen">
      <AdminSidebar userEmail={session?.user?.email} />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
