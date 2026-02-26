import { ClientHeader } from "@/components/layout/client-header";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <ClientHeader />
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
    </div>
  );
}
