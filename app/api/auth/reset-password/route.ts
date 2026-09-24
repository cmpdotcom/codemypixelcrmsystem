import bcrypt from "bcryptjs";
import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const RESET_PREFIX = "password-reset:";

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function POST(request: Request) {
  let email = "";
  let token = "";
  let password = "";
  let confirmPassword = "";
  try {
    const body = await request.json();
    email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    token = typeof body.token === "string" ? body.token.trim() : "";
    password = typeof body.password === "string" ? body.password : "";
    confirmPassword = typeof body.confirmPassword === "string" ? body.confirmPassword : "";
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!email || !token || !password || !confirmPassword) {
    return NextResponse.json({ error: "Complete all fields." }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
  }
  if (password !== confirmPassword) {
    return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
  }

  const identifier = `${RESET_PREFIX}${email}`;
  const resetToken = await prisma.verificationToken.findFirst({
    where: { identifier, token: hashToken(token) },
  });
  if (!resetToken || resetToken.expires < new Date()) {
    if (resetToken) await prisma.verificationToken.deleteMany({ where: { identifier } });
    return NextResponse.json({ error: "This reset link is invalid or has expired. Request a new one." }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (!user) {
    await prisma.verificationToken.deleteMany({ where: { identifier } });
    return NextResponse.json({ error: "This reset link is invalid or has expired. Request a new one." }, { status: 400 });
  }

  await prisma.$transaction([
    prisma.user.update({ where: { id: user.id }, data: { password: hashedPassword } }),
    prisma.verificationToken.deleteMany({ where: { identifier } }),
  ]);

  return NextResponse.json({ success: true, message: "Your password has been reset. You can now log in." });
}
