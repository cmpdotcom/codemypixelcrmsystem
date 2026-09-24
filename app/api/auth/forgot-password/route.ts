import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAppUrl } from "@/lib/app-url";
import { sendPasswordResetEmail } from "@/lib/mail";

const RESET_PREFIX = "password-reset:";
const GENERIC_RESPONSE = {
  success: true,
  message: "If an account exists for that email, we sent a password reset link.",
};

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function POST(request: Request) {
  let email = "";
  try {
    const body = await request.json();
    email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  } catch {
    return NextResponse.json(GENERIC_RESPONSE);
  }

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json(GENERIC_RESPONSE);
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json(GENERIC_RESPONSE);

  const rawToken = crypto.randomBytes(32).toString("hex");
  const identifier = `${RESET_PREFIX}${email}`;
  await prisma.verificationToken.deleteMany({ where: { identifier } });
  await prisma.verificationToken.create({
    data: {
      identifier,
      token: hashToken(rawToken),
      expires: new Date(Date.now() + 30 * 60 * 1000),
    },
  });

  const resetUrl = `${getAppUrl(request)}/reset-password?email=${encodeURIComponent(email)}&token=${rawToken}`;
  try {
    const mailResult = await sendPasswordResetEmail({
      to: email,
      resetUrl,
      userName: `${user.firstName} ${user.lastName}`.trim(),
    });
    if (!mailResult.sent && process.env.NODE_ENV !== "production") {
      return NextResponse.json({ ...GENERIC_RESPONSE, devLink: resetUrl });
    }
  } catch (error) {
    console.error("Password reset email failed", error);
    return NextResponse.json({ error: "We could not send the reset email. Please try again." }, { status: 503 });
  }

  return NextResponse.json(GENERIC_RESPONSE);
}
