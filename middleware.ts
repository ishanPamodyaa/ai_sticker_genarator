import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// Use the edge-compatible auth config (no Prisma/bcrypt imports).
// All route protection logic is in authConfig.callbacks.authorized.
const { auth } = NextAuth(authConfig);
export default auth;

export const config = {
  matcher: [
    "/admin/:path*",
    "/client/:path*",
    "/login",
    "/register",
  ],
};
