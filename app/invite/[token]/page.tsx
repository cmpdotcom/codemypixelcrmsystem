"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { DEFAULT_LOGO } from "@/lib/brand";

interface InvitationDetails {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  team: string | null;
  expiresAt: string;
}

export default function InvitationPage() {
  const params = useParams<{ token: string }>();
  const router = useRouter();
  const [invitation, setInvitation] = useState<InvitationDetails | null>(null);
  const [form, setForm] = useState({ firstName: "", lastName: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/invitations/${params.token}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "This invitation is no longer available.");
        setInvitation(data);
        setForm((current) => ({ ...current, firstName: data.firstName, lastName: data.lastName }));
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load invitation."))
      .finally(() => setLoading(false));
  }, [params.token]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/invitations/${params.token}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not create your account.");
      setSuccess(true);
      setTimeout(() => router.push(`/login?invited=1&email=${encodeURIComponent(data.email)}`), 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create your account.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f4f7fc] px-5 py-10">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2.5 mb-6">
          <Image src={DEFAULT_LOGO} alt="CMP CRM" width={42} height={42} className="rounded-xl" />
          <span className="text-xl font-bold text-slate-900">CMP CRM</span>
        </div>
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-7 sm:p-9">
          {loading ? (
            <div className="py-12 flex justify-center"><Loader2 className="w-6 h-6 text-blue-600 animate-spin" /></div>
          ) : success ? (
            <div className="py-8 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
              <h1 className="text-xl font-bold text-slate-900">You’re in!</h1>
              <p className="text-sm text-slate-500 mt-2">Your account is ready. Redirecting you to login…</p>
            </div>
          ) : error && !invitation ? (
            <div className="py-8 text-center">
              <h1 className="text-xl font-bold text-slate-900">Invitation unavailable</h1>
              <p className="text-sm text-red-600 mt-2">{error}</p>
              <Link href="/login" className="inline-block mt-6 text-sm font-semibold text-blue-600">Go to login</Link>
            </div>
          ) : invitation ? (
            <>
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3"><ShieldCheck className="w-6 h-6" /></div>
                <h1 className="text-2xl font-bold text-slate-900">Join your workspace</h1>
                <p className="text-sm text-slate-500 mt-2">You’ve been invited as a <strong className="text-slate-700">{invitation.role}</strong>{invitation.team ? <> on <strong className="text-slate-700">{invitation.team}</strong></> : ""}.</p>
                <p className="text-xs text-slate-400 mt-1">{invitation.email}</p>
              </div>
              {error && <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">{error}</div>}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <label className="text-xs font-semibold text-slate-700">First name<input required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-500/20" /></label>
                  <label className="text-xs font-semibold text-slate-700">Last name<input required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-500/20" /></label>
                </div>
                <label className="block text-xs font-semibold text-slate-700">Create password<input required minLength={6} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-500/20" /></label>
                <label className="block text-xs font-semibold text-slate-700">Confirm password<input required minLength={6} type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-500/20" /></label>
                <button disabled={submitting} className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">{submitting ? "Creating account…" : "Accept invitation"}</button>
              </form>
            </>
          ) : null}
        </div>
      </div>
    </main>
  );
}
