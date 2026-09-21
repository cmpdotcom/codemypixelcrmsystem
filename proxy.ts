import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/signup", "/verify-email"];
  const isPublicRoute = publicRoutes.includes(pathname);

  // API auth and uploadthing routes should always pass through
  if (pathname.startsWith("/api/auth") || pathname.startsWith("/api/uploadthing")) {
    return NextResponse.next();
  }

  // Redirect logged-in users away from login/signup
  if (isPublicRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Redirect unauthenticated users to login
  if (!isPublicRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
