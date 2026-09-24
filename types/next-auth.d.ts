import "next-auth";
import "next-auth/jwt";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    roleName?: string;
    permissions?: Record<string, unknown>;
  }

  interface Session {
    user: {
      id: string;
      roleName?: string;
      permissions?: Record<string, unknown>;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    roleName?: string;
    permissions?: Record<string, unknown>;
  }
}
