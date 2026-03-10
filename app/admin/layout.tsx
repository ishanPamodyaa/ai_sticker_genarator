import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/layout/admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="flex min-h-screen relative overflow-hidden">
      {/* Background glowing orbs */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[128px] -z-10 mix-blend-screen pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-fuchsia-600/10 rounded-full blur-[128px] -z-10 mix-blend-screen pointer-events-none" />

      <AdminSidebar userEmail={session?.user?.email} />
      <main className="flex-1 p-6 relative z-10 overflow-y-auto">{children}</main>
    </div>
  );
}
