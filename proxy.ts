import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { actionForMethod, apiModule, canPerform, pageModule } from "@/lib/permissions";
import { NextResponse } from "next/server";

// Reads the session cookie only — no database access (see lib/auth.config.ts).
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/signup", "/verify-email", "/forgot-password", "/reset-password", "/forbidden"];
  const isPublicRoute = publicRoutes.includes(pathname) || pathname.startsWith("/invite/");

  // API auth and uploadthing routes should always pass through
  if (pathname.startsWith("/api/auth") || pathname.startsWith("/api/uploadthing") || pathname.startsWith("/api/invitations/")) {
    return NextResponse.next();
  }

  // Redirect logged-in users away from login/signup
  if (isPublicRoute && isLoggedIn && pathname !== "/forbidden") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Redirect unauthenticated users to login. API calls get a JSON 401 instead of the login
  // page's HTML, so the UI can tell "session expired" apart from a real server error.
  if (!isPublicRoute && !isLoggedIn) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Your session has expired. Please sign in again." }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isLoggedIn && !pathname.startsWith("/api/auth") && !pathname.startsWith("/api/uploadthing") && !pathname.startsWith("/api/invitations/")) {
    const module = pathname.startsWith("/api/") ? apiModule(pathname) : pageModule(pathname);
    const roleName = req.auth?.user?.roleName;
    const permissions = req.auth?.user?.permissions;
    const allowed = !roleName || roleName === "Super Admin" || (module ? canPerform(permissions, module, pathname.startsWith("/api/") ? actionForMethod(req.method) : "view") : true);
    if (!allowed) {
      if (pathname.startsWith("/api/")) return NextResponse.json({ error: "You do not have permission to access this section." }, { status: 403 });
      return NextResponse.redirect(new URL(`/forbidden?module=${encodeURIComponent(module || "this section")}`, req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
