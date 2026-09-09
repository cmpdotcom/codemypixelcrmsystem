"use client";

import { ReactNode } from "react";

export function FormCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 mb-5">
      <div className="mb-5">
        <h3 className="text-sm font-bold text-slate-900">{title}</h3>
        {description && (
          <p className="text-xs text-slate-500 mt-0.5">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

export function FormField({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
        {label}
      </label>
      {children}
      {hint && <p className="text-[10px] text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}

export function Input({
  placeholder,
  defaultValue,
  type = "text",
}: {
  placeholder?: string;
  defaultValue?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      defaultValue={defaultValue}
      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
    />
  );
}

export function Select({
  options,
  defaultValue,
}: {
  options: string[];
  defaultValue?: string;
}) {
  return (
    <select
      defaultValue={defaultValue}
      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}

export function Toggle({
  label,
  description,
  defaultOn,
}: {
  label: string;
  description?: string;
  defaultOn?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
      <div>
        <p className="text-xs font-semibold text-slate-800">{label}</p>
        {description && (
          <p className="text-[10px] text-slate-400 mt-0.5">{description}</p>
        )}
      </div>
      <button
        className={`relative w-10 h-5.5 rounded-full transition-colors shrink-0 ${
          defaultOn ? "bg-blue-600" : "bg-slate-200"
        }`}
        style={{ height: "22px", width: "40px" }}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
            defaultOn ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}

export function SaveBar() {
  return (
    <div className="flex justify-end gap-3 mt-6">
      <button className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
        Cancel
      </button>
      <button className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-500/20 transition-colors">
        Save Changes
      </button>
    </div>
  );
}

export function Badge({
  label,
  color = "slate",
}: {
  label: string;
  color?: "slate" | "blue" | "green" | "amber" | "rose" | "purple";
}) {
  const colors: Record<string, string> = {
    slate: "bg-slate-100 text-slate-600",
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-600",
    purple: "bg-purple-50 text-purple-600",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold ${colors[color]}`}
    >
      {label}
    </span>
  );
}
