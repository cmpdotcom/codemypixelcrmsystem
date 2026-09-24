"use client";

import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f4f7fc] px-6">
      <div className="max-w-md rounded-3xl border border-slate-200 bg-white p-9 text-center shadow-xl">
        <ShieldAlert className="mx-auto h-12 w-12 text-amber-500" />
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Access restricted</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">Your role does not have permission to view this section. Ask an Executive or administrator to update your role permissions.</p>
        <Link href="/" className="mt-6 inline-flex rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">Back to dashboard</Link>
      </div>
    </main>
  );
}
