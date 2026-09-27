import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { normalizePermissions } from "@/lib/permissions";

// The proxy calls auth() on every request (pages, API calls, prefetches). Reloading the role
// from the database each time exhausted the DB connection limit, and any failed lookup
// looked like "signed out". Refresh at most this often, and never sign out on a DB error.
const ROLE_REFRESH_MS = 60_000;

if (!process.env.AUTH_URL && process.env.NEXT_PUBLIC_URL) {
  process.env.AUTH_URL = process.env.NEXT_PUBLIC_URL;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
          include: { role: { select: { name: true, permissions: true } } },
        });
        if (!user || !user.password) return null;

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return null;

        // Block sign-in until the email is verified
        if (!user.emailVerified) return null;

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          image: user.image,
          roleName: user.role?.name || "Unassigned",
          permissions: normalizePermissions(user.role?.permissions, user.role?.name),
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.roleName = user.roleName;
        token.permissions = user.permissions;
        token.refreshedAt = Date.now();
        return token;
      }
      if (!token.id) return token;

      const refreshedAt = typeof token.refreshedAt === "number" ? token.refreshedAt : 0;
      if (Date.now() - refreshedAt < ROLE_REFRESH_MS) return token;

      try {
        const currentUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { role: { select: { name: true, permissions: true } } },
        });
        token.roleName = currentUser?.role?.name || "Unassigned";
        token.permissions = normalizePermissions(currentUser?.role?.permissions, currentUser?.role?.name);
        token.refreshedAt = Date.now();
      } catch (error) {
        console.error("[auth] Could not refresh role, keeping the current session", error);
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.roleName = token.roleName as string;
        session.user.permissions = token.permissions as Record<string, unknown>;
      }
      return session;
    },
  },
});
