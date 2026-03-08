"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LogoutButton } from "@/components/auth/logout-button";

const navItems = [
  { href: "/admin/templates", label: "Templates" },
  { href: "/admin/jobs", label: "Jobs" },
];

export function AdminSidebar({ userEmail }: { userEmail?: string }) {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-muted/30 min-h-screen p-4 flex flex-col">
      <Link href="/admin" className="block mb-8">
        <h2 className="text-lg font-bold text-primary">Admin Panel</h2>
      </Link>
      <nav className="space-y-1 flex-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t pt-4 space-y-2">
        {userEmail && (
          <p className="text-xs text-muted-foreground truncate px-1">{userEmail}</p>
        )}
        <Link
          href="/client/gallery"
          className="block text-xs text-muted-foreground hover:text-foreground transition-colors px-1"
        >
          Back to Gallery
        </Link>
        <LogoutButton />
      </div>
    </aside>
  );
}
