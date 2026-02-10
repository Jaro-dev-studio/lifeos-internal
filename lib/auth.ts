import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    // Email + password credentials provider
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
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email as string;
        const password = credentials.password as string;

        console.log("[Auth] Looking up user:", email);

        // Find existing user
        let user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          // For demo: auto-create user on first sign-in
          // In production, replace with proper registration + password hashing
          console.log("[Auth] Creating new user:", email);
          user = await prisma.user.create({
            data: {
              email,
              name: email.split("@")[0],
            },
          });
        }

        // TODO: In production, verify hashed password here
        // For demo purposes, any non-empty password is accepted
        if (!password) return null;

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
