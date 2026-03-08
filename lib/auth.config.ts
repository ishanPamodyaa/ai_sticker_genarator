import type { NextAuthConfig } from "next-auth";

/**
 * Edge-compatible auth config (no Node.js imports like Prisma or bcrypt).
 * Used by middleware for JWT session checking only.
 */
export const authConfig: NextAuthConfig = {
  providers: [],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as { role: string }).role = token.role as string;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;
      const role = (auth?.user as { role?: string })?.role;

      // Admin routes require ADMIN role
      if (pathname.startsWith("/admin")) {
        if (!isLoggedIn) return false;
        if (role !== "ADMIN") {
          return Response.redirect(
            new URL("/client/gallery", nextUrl.origin)
          );
        }
        return true;
      }

      // Client routes require any authenticated user
      if (pathname.startsWith("/client")) {
        return isLoggedIn;
      }

      // Redirect logged-in users away from login/register pages based on role
      if (pathname === "/login" || pathname === "/register") {
        if (isLoggedIn) {
          const redirectPath =
            role === "ADMIN" ? "/admin/templates" : "/client/gallery";
          return Response.redirect(new URL(redirectPath, nextUrl.origin));
        }
      }

      return true;
    },
  },
  pages: {
    signIn: "/login",
  },
};
