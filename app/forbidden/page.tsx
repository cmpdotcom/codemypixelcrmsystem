"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Loader2, LogOut, ShieldAlert } from "lucide-react";

export default function ForbiddenPage() {
  const { data: session } = useSession();
  const [signingOut, setSigningOut] = useState(false);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f4f7fc] px-4 sm:px-6">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 sm:p-9 text-center shadow-xl">
        <ShieldAlert className="mx-auto h-12 w-12 text-amber-500" />
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Access restricted</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">Your role does not have permission to view this section. Ask an Executive or administrator to update your role permissions.</p>

        {session?.user && (
          <p className="mt-4 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-500 break-words">
            Signed in as <span className="font-semibold text-slate-700">{session.user.email || session.user.name}</span>
            {session.user.roleName && <> · {session.user.roleName}</>}
          </p>
        )}

        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-center gap-2.5">
          <button
            onClick={() => { setSigningOut(true); signOut({ callbackUrl: "/login" }); }}
            disabled={signingOut}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 hover:border-rose-200 disabled:opacity-60 cursor-pointer"
          >
            {signingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
            Sign out
          </button>
          <Link href="/" className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
            Back to dashboard
          </Link>
        </div>
        <p className="mt-3 text-[11px] text-slate-400">Signing out lets you log in with a different account.</p>
      </div>
    </main>
  );
}
