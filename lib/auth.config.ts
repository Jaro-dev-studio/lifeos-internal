import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

/**
 * Auth configuration without the Prisma adapter.
 * Used by middleware which runs in Edge Runtime (no Node.js modules).
 * The full auth config in auth.ts includes the Prisma adapter for DB operations.
 */
export const authConfig: NextAuthConfig = {
  providers: [
    // Credentials provider - must match the one in auth.ts
    Credentials({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "you@example.com",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize() {
        // In middleware context, we only validate the JWT token.
        // Actual credential validation happens in the full auth config (auth.ts).
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
