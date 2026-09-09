"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/lib/auth";

interface SignupState {
  error?: string;
  success?: boolean;
}

export async function signup(
  _prev: SignupState,
  formData: FormData,
): Promise<SignupState> {
  const firstName = (formData.get("firstName") as string)?.trim();
  const lastName = (formData.get("lastName") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;
  const turnstileToken = formData.get("turnstileToken") as string;

  // --- Validation ---
  if (!firstName || !lastName || !email || !password) {
    return { error: "All fields are required." };
  }
  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  // --- Verify Cloudflare Turnstile ---
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) {
    return { error: "Captcha is not configured." };
  }
  if (!turnstileToken) {
    return { error: "Please complete the captcha." };
  }

  try {
    const verifyRes = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: secretKey,
          response: turnstileToken,
        }),
      },
    );
    const verifyData = await verifyRes.json();
    if (!verifyData.success) {
      return { error: "Captcha verification failed. Please try again." };
    }
  } catch {
    return { error: "Captcha verification failed. Please try again." };
  }

  // --- Check for existing user ---
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with this email already exists." };
  }

  // --- Create user ---
  const hashedPassword = await bcrypt.hash(password, 12);
  try {
    await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
    });
  } catch {
    return { error: "Failed to create account. Please try again." };
  }

  // --- Sign in the new user ---
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return { success: true };
  } catch {
    // Account created but auto-login failed — redirect to login
    return { success: true };
  }
}
