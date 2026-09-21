"use server";

import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/mail";

interface SignupState {
  error?: string;
  success?: boolean;
  needsVerification?: boolean;
  /** Shown in the UI only when no mail provider is configured (dev fallback) */
  devCode?: string;
}

// Free/public email providers — work email required
const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com", "googlemail.com", "yahoo.com", "ymail.com", "rocketmail.com",
  "hotmail.com", "outlook.com", "live.com", "msn.com", "aol.com",
  "icloud.com", "me.com", "mac.com", "protonmail.com", "proton.me",
  "gmx.com", "gmx.net", "mail.com", "email.com", "yandex.com", "yandex.ru",
  "zoho.com", "inbox.com", "rediffmail.com", "mail.ru", "bk.ru",
  "tutanota.com", "tuta.io", "fastmail.com", "hushmail.com", "mailfence.com",
]);

export async function signup(
  _prev: SignupState,
  formData: FormData,
): Promise<SignupState> {
  const firstName = (formData.get("firstName") as string)?.trim();
  const lastName = (formData.get("lastName") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const turnstileToken = formData.get("turnstileToken") as string;
  const companyName = (formData.get("companyName") as string)?.trim();
  const industry = (formData.get("industry") as string)?.trim();
  const companySize = (formData.get("companySize") as string)?.trim();
  const country = (formData.get("country") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim();
  const website = (formData.get("website") as string)?.trim();

  // --- Validation ---
  if (!firstName || !lastName || !email || !password || !companyName) {
    return { error: "All fields are required." };
  }
  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }
  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }
  const emailDomain = email.split("@")[1]?.toLowerCase() || "";
  if (FREE_EMAIL_DOMAINS.has(emailDomain)) {
    return { error: `We don't accept ${emailDomain} addresses. Please use your work email.` };
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

  // --- Persist company profile to settings (drives branding system-wide) ---
  try {
    const companySettings: Record<string, string> = {
      company_name: companyName,
      companyName,
      company_industry: industry || "Other",
      industry: industry || "Other",
      company_size: companySize || "1-10",
      company_country: country || "Other",
      country: country || "Other",
      company_officialEmail: email,
      companyEmail: email,
      company_phone: phone || "",
      companyPhone: phone || "",
      company_website: website || "",
      companyWebsite: website || "",
      company_primaryColor: "blue",
      company_secondaryColor: "indigo",
      currency: "USD ($)",
      dateFormat: "DD/MM/YYYY",
      timeFormat: "12-hour",
      language: "English",
      landingPage: "Dashboard",
      leadView: "List",
      dealView: "Kanban",
      pageSize: "10",
    };
    await Promise.all(
      Object.entries(companySettings).map(([key, value]) =>
        prisma.setting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        }),
      ),
    );
  } catch {
    // Settings are best-effort; account creation already succeeded
  }

  // --- Issue email verification code ---
  const result = await issueVerificationCode(email, `${firstName} ${lastName}`);
  return {
    success: true,
    needsVerification: true,
    devCode: result.devCode,
  };
}

async function issueVerificationCode(email: string, userName: string) {
  const code = crypto.randomInt(100000, 999999).toString();
  const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await prisma.verificationToken.deleteMany({ where: { identifier: email } });
  await prisma.verificationToken.create({
    data: { identifier: email, token: code, expires },
  });

  return sendVerificationEmail(email, code, userName);
}

export async function verifyEmail(
  _prev: SignupState,
  formData: FormData,
): Promise<SignupState> {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const code = (formData.get("code") as string)?.trim();

  if (!email || !code) return { error: "Enter the 6-digit verification code." };
  if (!/^\d{6}$/.test(code)) return { error: "The code must be exactly 6 digits." };

  const token = await prisma.verificationToken.findFirst({
    where: { identifier: email, token: code },
  });
  if (!token) {
    return { error: "Invalid verification code. Please check and try again." };
  }
  if (token.expires < new Date()) {
    await prisma.verificationToken.deleteMany({ where: { identifier: email } });
    return { error: "This code has expired. Request a new one." };
  }

  await prisma.user.update({
    where: { email },
    data: { emailVerified: new Date() },
  });
  await prisma.verificationToken.deleteMany({ where: { identifier: email } });

  return { success: true };
}

export async function resendVerification(
  _prev: SignupState,
  formData: FormData,
): Promise<SignupState> {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  if (!email) return { error: "Email is required." };

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { error: "No account found with this email." };
  if (user.emailVerified) return { error: "This email is already verified. Please log in." };

  const result = await issueVerificationCode(email, `${user.firstName} ${user.lastName}`);
  return { success: true, devCode: result.devCode };
}
