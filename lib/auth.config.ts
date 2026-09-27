import type { NextAuthConfig } from "next-auth";

if (!process.env.AUTH_URL && process.env.NEXT_PUBLIC_URL) {
  process.env.AUTH_URL = process.env.NEXT_PUBLIC_URL;
}

// Shared by the proxy and the full auth setup. It must never touch the database: Vercel runs
// the proxy close to each visitor (e.g. Mumbai/Singapore), so any DB access here opens
// connections from every region to the database and exhausts its connection limit.
export const authConfig = {
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.roleName = token.roleName as string;
        session.user.permissions = token.permissions as Record<string, unknown>;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
