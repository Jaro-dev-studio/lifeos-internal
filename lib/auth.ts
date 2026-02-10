import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
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
      async authorize(credentials) {
        // For demo purposes, create or find a demo user
        if (!credentials?.email) return null;

        const email = credentials.email as string;

        console.log("[Auth] Looking up user:", email);

        // Find or create the user
        let user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          console.log("[Auth] Creating new user:", email);
          user = await prisma.user.create({
            data: {
              email,
              name: email.split("@")[0],
            },
          });
        }

        console.log("[Auth] User authenticated:", user.id);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
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
  },
  trustHost: true,
});
