"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, KeyRound, Loader2, Mail } from "lucide-react";
import { DEFAULT_LOGO } from "@/lib/brand";

export default function ForgotPasswordPage() {
  const [brandName, setBrandName] = useState("CMP CRM");
  const [brandLogo, setBrandLogo] = useState(DEFAULT_LOGO);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [devLink, setDevLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((response) => (response.ok ? response.json() : null))
      .then((settings) => {
        if (!settings) return;
        if (settings.company_name || settings.companyName) setBrandName(settings.company_name || settings.companyName);
        setBrandLogo(settings.company_loginLogoUrl || settings.company_logoUrl || DEFAULT_LOGO);
      })
      .catch(() => {});
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "We could not send the reset email.");
      setDevLink(result.devLink || null);
      setSent(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "We could not send the reset email.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden font-sans text-slate-900 bg-[#f4f7fc] px-6 py-10">
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-multiply" style={{ backgroundImage: "url('/flowing_silk_bg.jpg')" }} />
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-[100px]" />
        <div className="absolute -bottom-24 right-1/4 w-[500px] h-[450px] bg-indigo-100/45 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="flex items-center justify-center gap-2.5 mb-6">
          <Image src={brandLogo} alt={brandName} width={40} height={40} unoptimized={brandLogo.startsWith("http")} className="rounded-xl shadow-sm object-contain" />
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">{brandName}</h1>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide">Sell. Deliver. Grow.</p>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-[28px] border border-white/90 shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-8 sm:p-9">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
              <KeyRound className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Forgot your password?</h2>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">Enter your work email and we&apos;ll send you a secure link to create a new password.</p>
          </div>

          {sent ? (
            <div className="rounded-2xl bg-emerald-50 border border-emerald-100 px-4 py-5 text-center">
              <CheckCircle2 className="w-9 h-9 text-emerald-600 mx-auto mb-2" />
              <p className="text-sm font-bold text-emerald-700">Check your inbox</p>
              <p className="text-xs text-emerald-600 mt-1 leading-relaxed">If an account exists for <span className="font-semibold">{email}</span>, a reset link is on its way.</p>
              {devLink && <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 px-3.5 py-2.5 text-left text-[11px] text-amber-700"><p className="font-semibold">Dev mode — no mail provider configured.</p><a href={devLink} className="mt-1 block break-all underline hover:text-amber-800">Open the reset link</a></div>}
              <button type="button" onClick={() => setSent(false)} className="mt-4 text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline cursor-pointer">Use a different email</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="rounded-xl bg-rose-50 border border-rose-100 px-3.5 py-2.5 text-xs font-medium text-rose-600">{error}</div>}
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input id="email" type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" className="block w-full pl-10 pr-4 py-3 bg-white border border-slate-200/90 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-2xs" />
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full mt-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 text-white text-xs font-semibold py-3 px-4 rounded-xl transition-all shadow-md shadow-blue-600/25 flex items-center justify-center gap-1.5 cursor-pointer">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>Send reset link</span><ArrowRight className="w-3.5 h-3.5" /></>}
              </button>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <Link href="/login" className="text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors inline-flex items-center gap-1"><ArrowLeft className="w-3.5 h-3.5" />Back to login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
