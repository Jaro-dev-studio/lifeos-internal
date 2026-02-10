import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

/**
 * Middleware for authentication route protection.
 * Uses the edge-compatible auth config (no Prisma adapter).
 * Auth logic is handled in the `authorized` callback in auth.config.ts.
 */
export default NextAuth(authConfig).auth;

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api/auth (NextAuth routes)
     * - api/webhooks (webhook endpoints - authenticated by workflow ID)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public files (images, etc.)
     */
    "/((?!api/auth|api/webhooks|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
