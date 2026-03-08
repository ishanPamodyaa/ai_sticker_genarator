import Link from "next/link";
import { auth } from "@/lib/auth";
import { LogoutButton } from "@/components/auth/logout-button";

export async function ClientHeader() {
  const session = await auth();

  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold text-primary">
          AI Sticker Generator
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/client/gallery"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Gallery
          </Link>
          {session && (
            <Link
              href="/client/history"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              My History
            </Link>
          )}
          {session?.user.role === "ADMIN" && (
            <Link
              href="/admin"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Admin
            </Link>
          )}
          {session ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">
                {session.user.email}
              </span>
              <LogoutButton />
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex h-8 items-center rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
