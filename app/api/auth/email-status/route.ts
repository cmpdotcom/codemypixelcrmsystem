import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/auth/email-status?email=x@y.com
// Lets the login page distinguish "invalid credentials" from "email not verified"
export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email")?.trim().toLowerCase();
  if (!email) {
    return NextResponse.json({ exists: false, verified: false });
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { emailVerified: true },
  });

  return NextResponse.json({
    exists: !!user,
    verified: !!user?.emailVerified,
  });
}
