import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

/**
 * Auth configuration without the Prisma adapter.
 * Used by middleware which runs in Edge Runtime (no Node.js modules).
 * The full auth config in auth.ts includes the Prisma adapter for DB operations.
 */
export const authConfig: NextAuthConfig = {
  providers: [
    // GitHub OAuth (optional - requires GITHUB_ID and GITHUB_SECRET)
    ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET
      ? [
          GitHub({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
          }),
        ]
      : []),
    // Google OAuth (optional - requires GOOGLE_ID and GOOGLE_SECRET)
    ...(process.env.GOOGLE_ID && process.env.GOOGLE_SECRET
      ? [
          Google({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
          }),
        ]
      : []),
    // Credentials provider for demo/development
    Credentials({
      name: "Demo Account",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "demo@lifeos.app",
        },
      },
      async authorize() {
        // In middleware context, we only validate the JWT token
        // Actual credential validation happens in the full auth config
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isAuthenticated = !!auth?.user;
      const isAuthPage = nextUrl.pathname.startsWith("/sign-in");
      const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
      const isWebhookRoute = nextUrl.pathname.startsWith("/api/webhooks");

      // Always allow auth API routes and webhook routes
      if (isApiAuthRoute || isWebhookRoute) {
        return true;
      }

      // Redirect authenticated users away from auth pages
      if (isAuthPage && isAuthenticated) {
        return Response.redirect(new URL("/", nextUrl));
      }

      // Redirect unauthenticated users to sign-in
      if (!isAuthPage && !isAuthenticated) {
        const signInUrl = new URL("/sign-in", nextUrl);
        signInUrl.searchParams.set("callbackUrl", nextUrl.pathname);
        return Response.redirect(signInUrl);
      }

      return true;
    },
  },
  trustHost: true,
};
