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
  value,
  defaultValue,
  onChange,
  type = "text",
}: {
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (v: string) => void;
  type?: string;
}) {
  const controlled = value !== undefined;
  return (
    <input
      type={type}
      placeholder={placeholder}
      {...(controlled
        ? { value, onChange: (e) => onChange?.(e.target.value) }
        : { defaultValue })}
      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
    />
  );
}

export function Select({
  options,
  value,
  defaultValue,
  onChange,
}: {
  options: string[];
  value?: string;
  defaultValue?: string;
  onChange?: (v: string) => void;
}) {
  const controlled = value !== undefined;
  return (
    <select
      {...(controlled
        ? { value, onChange: (e) => onChange?.(e.target.value) }
        : { defaultValue })}
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
  checked,
  defaultOn,
  onChange,
}: {
  label: string;
  description?: string;
  checked?: boolean;
  defaultOn?: boolean;
  onChange?: (v: boolean) => void;
}) {
  const on = checked !== undefined ? checked : !!defaultOn;
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
      <div>
        <p className="text-xs font-semibold text-slate-800">{label}</p>
        {description && (
          <p className="text-[10px] text-slate-400 mt-0.5">{description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onChange?.(!on)}
        className={`relative w-10 rounded-full transition-colors shrink-0 cursor-pointer ${
          on ? "bg-blue-600" : "bg-slate-200"
        }`}
        style={{ height: "22px", width: "40px" }}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
            on ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}

export function SaveBar({
  saving,
  saved,
  onSave,
  onCancel,
}: {
  saving?: boolean;
  saved?: boolean;
  onSave?: () => void;
  onCancel?: () => void;
}) {
  return (
    <div className="sticky bottom-0 -mx-1 mt-6 z-20">
      <div className="flex items-center justify-end gap-3 bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl px-4 py-3 shadow-lg shadow-slate-200/50">
        {saved && (
          <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 mr-auto">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            Saved — changes are live across the CRM
          </span>
        )}
        <button
          onClick={onCancel}
          className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          disabled={saving}
          className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg shadow-sm shadow-blue-500/20 transition-colors cursor-pointer flex items-center gap-1.5"
        >
          {saving && (
            <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
          )}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
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
