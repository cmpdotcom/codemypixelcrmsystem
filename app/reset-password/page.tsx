"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Eye, EyeOff, KeyRound, Loader2, Lock } from "lucide-react";
import { DEFAULT_LOGO } from "@/lib/brand";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";
  const [brandName, setBrandName] = useState("CMP CRM");
  const [brandLogo, setBrandLogo] = useState(DEFAULT_LOGO);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
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
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, password, confirmPassword }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "We could not reset your password.");
      setSuccess(true);
      setTimeout(() => router.push("/login"), 1800);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "We could not reset your password.");
    } finally {
      setLoading(false);
    }
  }

  const invalidLink = !email || !token;

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
          <div><h1 className="text-xl font-bold tracking-tight text-slate-900">{brandName}</h1><p className="text-[10px] text-slate-400 font-medium tracking-wide">Sell. Deliver. Grow.</p></div>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-[28px] border border-white/90 shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-8 sm:p-9">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4"><KeyRound className="w-7 h-7" /></div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Create a new password</h2>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">Choose a strong password for your {brandName} account.</p>
          </div>

          {success ? (
            <div className="rounded-2xl bg-emerald-50 border border-emerald-100 px-4 py-5 text-center"><CheckCircle2 className="w-9 h-9 text-emerald-600 mx-auto mb-2" /><p className="text-sm font-bold text-emerald-700">Password updated</p><p className="text-xs text-emerald-600 mt-1">Redirecting you to login…</p></div>
          ) : invalidLink ? (
            <div className="rounded-xl bg-rose-50 border border-rose-100 px-4 py-3 text-xs font-medium text-rose-600 text-center">This reset link is incomplete. Request a new one from the forgot password page.</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="rounded-xl bg-rose-50 border border-rose-100 px-3.5 py-2.5 text-xs font-medium text-rose-600">{error}</div>}
              <PasswordField id="password" label="New password" value={password} onChange={setPassword} visible={showPassword} onToggle={() => setShowPassword((value) => !value)} />
              <PasswordField id="confirmPassword" label="Confirm new password" value={confirmPassword} onChange={setConfirmPassword} visible={showConfirm} onToggle={() => setShowConfirm((value) => !value)} />
              <p className="text-[11px] text-slate-400">Use at least 6 characters. A mix of letters, numbers, and symbols is best.</p>
              <button type="submit" disabled={loading} className="w-full mt-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 text-white text-xs font-semibold py-3 px-4 rounded-xl transition-all shadow-md shadow-blue-600/25 flex items-center justify-center gap-1.5 cursor-pointer">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>Update password</span><ArrowRight className="w-3.5 h-3.5" /></>}
              </button>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-slate-100 text-center"><Link href="/login" className="text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors inline-flex items-center gap-1"><ArrowLeft className="w-3.5 h-3.5" />Back to login</Link></div>
        </div>
      </div>
    </div>
  );
}

function PasswordField({ id, label, value, onChange, visible, onToggle }: { id: string; label: string; value: string; onChange: (value: string) => void; visible: boolean; onToggle: () => void }) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-slate-700 mb-1.5">{label}</label>
      <div className="relative"><Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input id={id} type={visible ? "text" : "password"} required minLength={6} autoComplete={id === "password" ? "new-password" : "new-password"} value={value} onChange={(event) => onChange(event.target.value)} placeholder="••••••••" className="block w-full pl-10 pr-10 py-3 bg-white border border-slate-200/90 rounded-xl text-xs text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-2xs" /><button type="button" onClick={onToggle} className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-slate-600 cursor-pointer" aria-label={visible ? "Hide password" : "Show password"}>{visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button></div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#f4f7fc]"><Loader2 className="w-6 h-6 text-blue-500 animate-spin" /></div>}><ResetPasswordForm /></Suspense>;
}
