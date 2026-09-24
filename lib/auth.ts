import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { normalizePermissions } from "@/lib/permissions";

export const { handlers, auth, signIn, signOut } = NextAuth({
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
      } else if (token.id) {
        const currentUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          include: { role: { select: { name: true, permissions: true } } },
        });
        token.roleName = currentUser?.role?.name || "Unassigned";
        token.permissions = normalizePermissions(currentUser?.role?.permissions, currentUser?.role?.name);
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
