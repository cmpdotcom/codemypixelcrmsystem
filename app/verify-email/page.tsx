"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { verifyEmail, resendVerification } from "@/app/actions/auth";
import {
  Mail,
  ShieldCheck,
  ArrowRight,
  Loader2,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [brandName, setBrandName] = useState("CMP CRM");
  const [brandLogo, setBrandLogo] = useState("/logo.png");
  const [code, setCode] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [resent, setResent] = useState(false);

  const [state, formAction, isPending] = useActionState(verifyEmail, {});
  const [resendState, resendAction, isResending] = useActionState(resendVerification, {});

  // Load company branding
  useEffect(() => {
    fetch("/api/settings")
      .then((r) => (r.ok ? r.json() : null))
      .then((s) => {
        if (!s) return;
        if (s.company_name || s.companyName) setBrandName(s.company_name || s.companyName);
        setBrandLogo(s.company_loginLogoUrl || s.company_logoUrl || "/logo.png");
      })
      .catch(() => {});
  }, []);

  // Redirect to login once verified
  useEffect(() => {
    if (state.success) {
      const t = setTimeout(() => router.push("/login?verified=1"), 1500);
      return () => clearTimeout(t);
    }
  }, [state.success, router]);

  // Resend cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  // Start cooldown after a resend succeeds
  useEffect(() => {
    if (resendState.success) {
      setCooldown(60);
      setResent(true);
    }
  }, [resendState]);

  const devCode = state.devCode || resendState.devCode;

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center overflow-x-hidden font-sans text-slate-900 bg-[#f4f7fc] px-6">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-multiply"
          style={{ backgroundImage: "url('/flowing_silk_bg.jpg')" }}
        />
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-[100px]" />
        <div className="absolute -bottom-24 right-1/4 w-[500px] h-[450px] bg-indigo-100/45 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Brand */}
        <div className="flex items-center justify-center gap-2.5 mb-6">
          <Image
            src={brandLogo}
            alt={brandName}
            width={40}
            height={40}
            unoptimized={brandLogo.startsWith("http")}
            className="rounded-xl shadow-sm object-contain"
          />
          <h1 className="text-xl font-bold tracking-tight text-slate-900">{brandName}</h1>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-[28px] border border-white/90 shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-8 sm:p-9">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Verify your email
            </h2>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              We sent a 6-digit verification code to
              <br />
              <span className="font-semibold text-slate-800">{email}</span>
            </p>
          </div>

          {devCode && (
            <div className="mb-4 rounded-xl bg-amber-50 border border-amber-200 px-3.5 py-2.5 text-xs font-medium text-amber-700">
              Dev mode — no mail provider configured. Your code: <b className="tracking-widest">{devCode}</b>
            </div>
          )}

          {state.success ? (
            <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-4 text-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <p className="text-sm font-bold text-emerald-700">Email verified!</p>
              <p className="text-xs text-emerald-600 mt-1">Redirecting you to login…</p>
            </div>
          ) : (
            <form action={formAction} className="space-y-4">
              {state.error && (
                <div className="rounded-xl bg-rose-50 border border-rose-100 px-3.5 py-2.5 text-xs font-medium text-rose-600">
                  {state.error}
                </div>
              )}

              <input type="hidden" name="email" value={email} />

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 text-center">
                  Verification Code
                </label>
                <input
                  type="text"
                  required
                  name="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="000000"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  className="block w-full px-4 py-3 bg-white border border-slate-200/90 rounded-xl text-center text-2xl font-extrabold tracking-[0.5em] text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-2xs"
                />
              </div>

              <button
                type="submit"
                disabled={isPending || code.length !== 6}
                className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 text-white text-xs font-semibold py-3 px-4 rounded-xl transition-all shadow-md shadow-blue-600/25 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Verify Email</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Resend */}
          {!state.success && (
            <div className="mt-5 text-center">
              <p className="text-xs text-slate-500">Didn&apos;t receive the code?</p>
              {resendState.error && (
                <p className="text-[11px] text-rose-600 font-medium mt-1.5">{resendState.error}</p>
              )}
              {resent && cooldown > 0 && !resendState.error && (
                <p className="text-[11px] text-emerald-600 font-medium mt-1.5">New code sent!</p>
              )}
              <form action={resendAction} className="mt-2">
                <input type="hidden" name="email" value={email} />
                <button
                  type="submit"
                  disabled={isResending || cooldown > 0}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  {isResending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <RefreshCw className="w-3.5 h-3.5" />
                  )}
                  {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
                </button>
              </form>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <Link
              href="/login"
              className="text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors inline-flex items-center gap-1"
            >
              <Mail className="w-3.5 h-3.5" />
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f4f7fc]">
          <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        </div>
      }
    >
      <VerifyEmailForm />
    </Suspense>
  );
}
