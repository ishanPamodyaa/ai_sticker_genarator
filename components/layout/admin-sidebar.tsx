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
    <aside className="w-64 border-r border-white/10 bg-background/40 backdrop-blur-xl min-h-screen p-4 flex flex-col relative z-20 shadow-2xl">
      <Link href="/admin" className="block mb-8 px-2 flex items-center gap-2">
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400">Admin</span>
      </Link>
      <nav className="space-y-2 flex-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block rounded-xl px-3 py-2 text-sm font-medium transition-all",
                isActive
                  ? "bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 text-violet-300 border border-white/10 shadow-inner"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground border border-transparent"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 pt-4 space-y-3 mt-4">
        {userEmail && (
          <div className="px-2 py-2 rounded-xl bg-white/5 border border-white/10 mb-2 shadow-inner">
            <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
          </div>
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
