"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  Building2,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  Code,
  DollarSign,
  FolderKanban,
  Loader2,
  Phone,
  RefreshCw,
  Rocket,
  ShieldCheck,
  Trophy,
  Undo2,
  UserCheck,
  X,
} from "lucide-react";
import { AssigneePicker, type PickerPerson, type PickerSelection, type PickerTeam } from "@/components/workflow/AssigneePicker";

interface InterestedLead {
  id: string;
  leadNumber: number;
  name: string;
  company: string;
  email: string;
  phone: string | null;
  service: string | null;
  budget: string | null;
  timeline: string | null;
  setter: string | null;
  interestedAt: string;
  interestedNote: string | null;
  nextFollowUp: string | null;
}

interface OpenDeal {
  id: string;
  dealNumber: number;
  title: string;
  company: string;
  contact: string | null;
  closer: string | null;
  closerId: string | null;
  stage: string;
  value: number;
  expectedCloseDate: string | null;
}

interface WonDeal {
  id: string;
  dealNumber: number;
  title: string;
  company: string;
  contact: string | null;
  closer: string | null;
  service: string | null;
  value: number;
  closedAt: string | null;
}

interface ActiveProject {
  id: string;
  projNumber: number;
  name: string;
  clientName: string;
  status: string;
  health: string;
  progress: number;
  deadline: string;
  assignments: { id: string; role: string; isLead: boolean; label: string }[];
}

interface Board {
  canManage: boolean;
  awaitingCloser: InterestedLead[];
  withClosers: OpenDeal[];
  awaitingDelivery: WonDeal[];
  activeProjects: ActiveProject[];
  people: { closers: PickerPerson[]; developers: PickerPerson[]; testers: PickerPerson[]; devops: PickerPerson[] };
  teams: PickerTeam[];
}

const money = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value || 0);
const shortDate = (value: string | null) =>
  value ? new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";
const since = (value: string, now: number) => {
  const hours = Math.floor((now - new Date(value).getTime()) / 3600000);
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

const stageLabel: Record<string, string> = {
  qualified: "Qualified",
  discovery: "Meeting / Discovery",
  proposal: "Proposal",
  negotiation: "Negotiation",
  contract: "Contract",
};

const ROLE_META = [
  { role: "Developer", short: "Dev", icon: Code, chip: "bg-blue-50 text-blue-700 border-blue-100" },
  { role: "Tester", short: "QA", icon: ShieldCheck, chip: "bg-rose-50 text-rose-700 border-rose-100" },
  { role: "DevOps", short: "DevOps", icon: Rocket, chip: "bg-emerald-50 text-emerald-700 border-emerald-100" },
] as const;

export default function WorkflowPage() {
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [closerChoice, setCloserChoice] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [startingDeal, setStartingDeal] = useState<WonDeal | null>(null);
  const [loadedAt, setLoadedAt] = useState(0);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/workflow");
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "Could not load the workflow board");
      setBoard(data);
      setLoadedAt(Date.now());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load the workflow board");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/workflow")
      .then(async (res) => {
        const data = await res.json().catch(() => null);
        if (cancelled) return;
        if (!res.ok) throw new Error(data?.error || "Could not load the workflow board");
        setBoard(data);
        setLoadedAt(Date.now());
      })
      .catch((e) => !cancelled && setError(e instanceof Error ? e.message : "Could not load the workflow board"))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const request = async (key: string, url: string, init: RequestInit, success: string) => {
    setBusy(key);
    setError(null);
    try {
      const res = await fetch(url, { headers: { "Content-Type": "application/json" }, ...init });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "Something went wrong");
      setNotice(success);
      await load();
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      return false;
    } finally {
      setBusy(null);
    }
  };

  const assignCloser = (lead: InterestedLead) => {
    const closerId = closerChoice[lead.id];
    if (!closerId) {
      setError("Choose a closer first");
      return;
    }
    const closer = board?.people.closers.find((person) => person.id === closerId);
    request(`lead:${lead.id}`, "/api/workflow/assign-closer", {
      method: "POST",
      body: JSON.stringify({ leadId: lead.id, closerId }),
    }, `${lead.name} is now with ${closer?.name || "the closer"}. A deal was opened on the Deals page.`);
  };

  const sendBack = (lead: InterestedLead) =>
    request(`lead:${lead.id}`, `/api/leads/${lead.id}/handoff`, { method: "DELETE" }, `${lead.name} was sent back to ${lead.setter || "the setter"}.`);

  const reassignDeal = (deal: OpenDeal, closerId: string) => {
    if (!closerId || closerId === deal.closerId) return;
    const closer = board?.people.closers.find((person) => person.id === closerId);
    request(`deal:${deal.id}`, `/api/deals/${deal.id}`, {
      method: "PATCH",
      body: JSON.stringify({ closerId }),
    }, `${deal.title} was reassigned to ${closer?.name || "the new closer"}.`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
        <span className="ml-2 text-sm font-medium text-slate-500">Loading workflow…</span>
      </div>
    );
  }

  const steps = [
    { label: "Interested leads", sub: "need a closer", count: board?.awaitingCloser.length || 0, icon: Phone, tone: "text-amber-600 bg-amber-50" },
    { label: "With closers", sub: "meetings & deals", count: board?.withClosers.length || 0, icon: UserCheck, tone: "text-indigo-600 bg-indigo-50" },
    { label: "Won deals", sub: "need a delivery team", count: board?.awaitingDelivery.length || 0, icon: Trophy, tone: "text-emerald-600 bg-emerald-50" },
    { label: "Active projects", sub: "in delivery", count: board?.activeProjects.length || 0, icon: FolderKanban, tone: "text-blue-600 bg-blue-50" },
  ];
  const canManage = !!board?.canManage;

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-5 p-4 pb-12 sm:p-6 md:p-8">
      <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-6 py-7 text-white shadow-xl shadow-slate-200/50 sm:px-8">
        <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-1/3 h-24 w-24 rounded-full bg-indigo-400/10 blur-2xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-100">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,0.12)]" />
              Operations workspace
            </div>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Workflow command center</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
              Move every opportunity from interested lead to active delivery with a clear owner at every hand-off.
            </p>
          </div>
          <div className="flex items-center justify-between gap-4 lg:justify-end">
            <div className="text-left lg:text-right">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Board status</p>
              <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-white lg:justify-end">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Live · {loadedAt ? `updated ${new Date(loadedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}` : "just now"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => load()}
              disabled={loading}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3.5 text-xs font-bold text-white transition hover:bg-white/15 disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span className="flex-1">{error}</span>
          <button onClick={() => setError(null)} className="cursor-pointer text-red-400 hover:text-red-600"><X className="h-4 w-4" /></button>
        </div>
      )}
      {notice && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span className="flex-1">{notice}</span>
          <button onClick={() => setNotice(null)} className="cursor-pointer text-emerald-500 hover:text-emerald-700"><X className="h-4 w-4" /></button>
        </div>
      )}
      {!canManage && board && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
          You&apos;re only seeing hand-offs that involve you. Assigning closers and delivery teams needs the Workflow “assign” permission.
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={step.label} className="group relative rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm shadow-slate-200/40 transition hover:-translate-y-0.5 hover:shadow-md sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${step.tone}`}>
                  <Icon className="h-[18px] w-[18px]" />
                </div>
                <span className="text-2xl font-black tracking-tight text-slate-900">{step.count}</span>
              </div>
              <div className="mt-4">
                <p className="text-[11px] font-bold text-slate-700">{index + 1}. {step.label}</p>
                <p className="mt-1 text-[10px] text-slate-400">{step.sub}</p>
              </div>
              {index < steps.length - 1 && <ArrowRight className="absolute -right-3 top-1/2 z-10 hidden h-4 w-4 -translate-y-1/2 text-slate-300 sm:block" />}
            </div>
          );
        })}
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {/* 1. Interested leads → assign a closer */}
        <Section
          step="01"
          icon={Phone}
          tone="bg-amber-50 text-amber-600"
          title="Interested leads"
          subtitle="Waiting for a closer to take the meeting."
          empty="No leads are waiting for a closer."
          emptyHint="New interested leads will appear here automatically."
          count={board?.awaitingCloser.length || 0}
        >
        {board?.awaitingCloser.map((lead) => (
          <div key={lead.id} className="my-3 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3.5 transition hover:border-amber-200 hover:bg-amber-50/30">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
              <div className="flex min-w-0 flex-1 gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-xs font-black text-white shadow-sm shadow-amber-200">
                  {lead.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link href={`/leads?lead=${lead.id}`} className="text-sm font-extrabold text-slate-900 hover:text-blue-600">{lead.name}</Link>
                    <span className="rounded-md bg-white px-1.5 py-0.5 text-[10px] font-bold text-slate-400 shadow-sm">LD-{String(lead.leadNumber).padStart(5, "0")}</span>
                  </div>
                  <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-500">
                    <span className="inline-flex items-center gap-1"><Building2 className="h-3 w-3 text-slate-400" />{lead.company}</span>
                    <span className="hidden text-slate-300 sm:inline">•</span>
                    <span>Setter <b className="text-slate-700">{lead.setter || "—"}</b></span>
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <span className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px] font-semibold text-slate-500">Interested {since(lead.interestedAt, loadedAt)}</span>
                    {lead.service && <span className="rounded-md border border-blue-100 bg-blue-50 px-2 py-1 text-[10px] font-semibold text-blue-700">{lead.service}</span>}
                    {lead.budget && <span className="rounded-md border border-emerald-100 bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">{lead.budget}</span>}
                    {lead.nextFollowUp && <span className="inline-flex items-center gap-1 rounded-md border border-violet-100 bg-violet-50 px-2 py-1 text-[10px] font-semibold text-violet-700"><CalendarDays className="h-3 w-3" />{shortDate(lead.nextFollowUp)}</span>}
                  </div>
                </div>
              </div>
              {canManage && (
                <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:w-[290px] lg:items-center">
                <select
                  value={closerChoice[lead.id] || ""}
                  onChange={(event) => setCloserChoice({ ...closerChoice, [lead.id]: event.target.value })}
                  className="h-9 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="">Choose closer…</option>
                  {board.people.closers.map((closer) => (
                    <option key={closer.id} value={closer.id}>{closer.name}</option>
                  ))}
                </select>
                <button
                  onClick={() => assignCloser(lead)}
                  disabled={busy === `lead:${lead.id}`}
                  className="flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3 text-xs font-bold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700 disabled:opacity-50"
                >
                  {busy === `lead:${lead.id}` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UserCheck className="h-3.5 w-3.5" />}
                  Assign
                </button>
                <button
                  onClick={() => sendBack(lead)}
                  disabled={busy === `lead:${lead.id}`}
                  title="Send back to setter"
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-800 disabled:opacity-50"
                >
                  <Undo2 className="h-3.5 w-3.5" />
                </button>
                </div>
              )}
            </div>
            {lead.interestedNote && (
              <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2 text-[11px] leading-5 text-amber-900">
                <span className="mt-0.5 text-amber-500">“</span><span className="flex-1">{lead.interestedNote}</span><span className="text-amber-500">”</span>
              </div>
            )}
          </div>
        ))}
        {canManage && board && board.people.closers.length === 0 && board.awaitingCloser.length > 0 && (
          <div className="mb-3 flex items-center gap-2 rounded-xl border border-orange-100 bg-orange-50 px-3 py-2 text-[11px] font-medium text-orange-700"><AlertCircle className="h-3.5 w-3.5" />No active users have the Closer role yet — invite one from Users.</div>
        )}
        </Section>

        {/* 2. Deals with closers */}
        <Section
          step="02"
          icon={UserCheck}
          tone="bg-indigo-50 text-indigo-600"
          title="With closers"
          subtitle="Open deals currently being worked by a closer."
          empty="No open deals with closers."
          emptyHint="Assigned deals will be tracked here until they are won."
          count={board?.withClosers.length || 0}
        >
        <div className="my-3 overflow-x-auto rounded-2xl border border-slate-200/80">
          <table className="w-full min-w-[620px] text-left text-xs">
            <thead className="bg-slate-50/80">
              <tr className="border-b border-slate-200/80 text-[10px] uppercase tracking-wide text-slate-400">
                <th className="px-3 py-3 pr-3 font-bold">Deal</th>
                <th className="px-3 py-3 pr-3 font-bold">Stage</th>
                <th className="px-3 py-3 pr-3 font-bold">Value</th>
                <th className="px-3 py-3 pr-3 font-bold">Expected close</th>
                <th className="px-3 py-3 font-bold">Closer</th>
              </tr>
            </thead>
            <tbody>
              {board?.withClosers.map((deal) => (
                <tr key={deal.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60">
                  <td className="px-3 py-3 pr-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600"><Briefcase className="h-3.5 w-3.5" /></div>
                      <div><p className="font-extrabold text-slate-900">{deal.title}</p><p className="text-[11px] text-slate-500">{deal.company}{deal.contact ? ` · ${deal.contact}` : ""}</p></div>
                    </div>
                  </td>
                  <td className="px-3 py-3 pr-3">
                    <span className="inline-flex rounded-md border border-indigo-100 bg-indigo-50 px-2 py-1 text-[10px] font-bold text-indigo-700">{stageLabel[deal.stage] || deal.stage}</span>
                  </td>
                  <td className="px-3 py-3 pr-3 font-extrabold text-slate-800">{money(deal.value)}</td>
                  <td className="px-3 py-3 pr-3 text-slate-600"><span className="inline-flex items-center gap-1"><CalendarDays className="h-3 w-3 text-slate-400" />{shortDate(deal.expectedCloseDate)}</span></td>
                  <td className="px-3 py-3">
                    {canManage ? (
                      <select
                        value={deal.closerId || ""}
                        disabled={busy === `deal:${deal.id}`}
                        onChange={(event) => reassignDeal(deal, event.target.value)}
                        className="w-44 rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-xs font-medium text-slate-700 shadow-sm focus:border-indigo-400 focus:outline-none"
                      >
                        <option value="" disabled>{deal.closer ? `${deal.closer} (not linked)` : "Unassigned"}</option>
                        {deal.closerId && !board.people.closers.some((closer) => closer.id === deal.closerId) && (
                          <option value={deal.closerId} disabled>{deal.closer || "Current closer"}</option>
                        )}
                        {board.people.closers.map((closer) => (
                          <option key={closer.id} value={closer.id}>{closer.name}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="font-semibold text-slate-700">{deal.closer || "—"}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </Section>

        {/* 3. Won deals → start the project */}
        <Section
          step="03"
          icon={Trophy}
          tone="bg-emerald-50 text-emerald-600"
          title="Won deals"
          subtitle="Ready to become a staffed delivery project."
          empty="No won deals are waiting for delivery."
          emptyHint="A project can be started as soon as a deal is marked won."
          count={board?.awaitingDelivery.length || 0}
        >
        {board?.awaitingDelivery.map((deal) => (
          <div key={deal.id} className="my-3 flex flex-col gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/40 p-3.5 transition hover:border-emerald-200 sm:flex-row sm:items-center">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600"><Trophy className="h-4 w-4" /></div>
              <div className="min-w-0"><p className="truncate text-sm font-extrabold text-slate-900">{deal.title}</p><p className="mt-1 text-[11px] text-slate-500">{deal.company} · closed by <b className="text-slate-700">{deal.closer || "—"}</b></p><div className="mt-2 flex flex-wrap gap-1.5"><span className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-1 text-[10px] font-bold text-emerald-700 shadow-sm"><DollarSign className="h-3 w-3" />{money(deal.value)}</span><span className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-1 text-[10px] font-semibold text-slate-500 shadow-sm"><CalendarDays className="h-3 w-3" />Won {shortDate(deal.closedAt)}</span></div></div>
            </div>
            {canManage && (
              <button
                onClick={() => setStartingDeal(deal)}
                className="flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm shadow-emerald-200 transition hover:bg-emerald-700"
              >
                <Briefcase className="h-3.5 w-3.5" /> Start project
              </button>
            )}
          </div>
        ))}
        </Section>

        {/* 4. Active projects and their coverage */}
        <Section
          step="04"
          icon={FolderKanban}
          tone="bg-blue-50 text-blue-600"
          title="Active projects"
          subtitle="Delivery coverage across development, QA, and DevOps."
          empty="No active projects."
          emptyHint="Projects created from won deals will show their team coverage here."
          count={board?.activeProjects.length || 0}
        >
        {board?.activeProjects.map((project) => (
          <div key={project.id} className="my-3 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-3.5 transition hover:border-blue-200 hover:bg-blue-50/20">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <div className="min-w-0 lg:w-64 lg:shrink-0">
                <div className="flex items-center gap-2"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><FolderKanban className="h-3.5 w-3.5" /></div><Link href={`/projects/${project.id}`} className="truncate text-sm font-extrabold text-slate-900 hover:text-blue-600">{project.name}</Link></div>
                <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-500"><span>{project.clientName}</span><span className="text-slate-300">•</span><span>{project.status}</span><span className="text-slate-300">•</span><span>Due {shortDate(project.deadline)}</span></p>
                <div className="mt-3 flex items-center gap-2"><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-blue-500" style={{ width: `${Math.min(100, Math.max(0, project.progress))}%` }} /></div><span className="text-[10px] font-bold text-slate-600">{project.progress}%</span></div>
              </div>
            </div>
            <div className="flex flex-1 flex-wrap gap-1.5">
              {ROLE_META.map(({ role, short, icon: Icon, chip }) => {
                const people = project.assignments.filter((assignment) => assignment.role === role);
                if (people.length === 0) {
                  return (
                    <span key={role} className="inline-flex items-center gap-1 rounded-lg border border-dashed border-slate-200 px-2 py-1 text-[11px] text-slate-400">
                      <Icon className="h-3 w-3" /> No {short}
                    </span>
                  );
                }
                return people.map((assignment) => (
                  <span key={assignment.id} className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-semibold ${chip}`}>
                    <Icon className="h-3 w-3" /> {short}: {assignment.label}{assignment.isLead ? " ★" : ""}
                  </span>
                ));
              })}
            </div>
            <Link href={`/projects/${project.id}?tab=team`} className="shrink-0 text-xs font-bold text-blue-600 hover:underline">
              Manage team →
            </Link>
          </div>
        ))}
        </Section>
      </div>

      {startingDeal && board && (
        <StartProjectModal
          deal={startingDeal}
          board={board}
          onClose={() => setStartingDeal(null)}
          onStarted={async (name) => {
            setStartingDeal(null);
            setNotice(`Project "${name}" was created and the team was notified.`);
            await load();
          }}
        />
      )}
    </div>
  );
}

function Section({
  step,
  icon: Icon,
  tone,
  title,
  subtitle,
  empty,
  emptyHint,
  count,
  children,
}: {
  step: string;
  icon: typeof Phone;
  tone: string;
  title: string;
  subtitle: string;
  empty: string;
  emptyHint: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[22px] border border-slate-200/80 bg-white shadow-sm shadow-slate-200/40">
      <div className="flex items-start gap-3 border-b border-slate-100 px-5 py-4">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${tone}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black tracking-[0.16em] text-slate-400">{step}</span>
            <h3 className="truncate text-sm font-extrabold text-slate-900">{title}</h3>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">{subtitle}</p>
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-black text-slate-600">{count}</span>
      </div>
      {count === 0 ? (
        <div className="flex min-h-[142px] flex-col items-center justify-center px-6 py-7 text-center">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-300">
            <Icon className="h-4 w-4" />
          </div>
          <p className="text-xs font-bold text-slate-600">{empty}</p>
          <p className="mt-1 max-w-xs text-[11px] leading-5 text-slate-400">{emptyHint}</p>
        </div>
      ) : <div className="px-5 py-1">{children}</div>}
    </section>
  );
}

function StartProjectModal({
  deal,
  board,
  onClose,
  onStarted,
}: {
  deal: WonDeal;
  board: Board;
  onClose: () => void;
  onStarted: (name: string) => Promise<void>;
}) {
  const [form, setForm] = useState(() => ({
    name: deal.title,
    description: "",
    budget: String(deal.value || ""),
    deadline: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
  }));
  const [developers, setDevelopers] = useState<PickerSelection[]>([]);
  const [testers, setTesters] = useState<PickerSelection[]>([]);
  const [devops, setDevops] = useState<PickerSelection[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (developers.length === 0) {
      setError("Assign at least one developer or development team.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/workflow/start-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dealId: deal.id, ...form, developers, testers, devops }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "Could not start the project");
      await onStarted(data.name);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not start the project");
      setSaving(false);
    }
  };

  const input = "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm" onClick={onClose}>
      <form
        onSubmit={submit}
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Start project</h3>
            <p className="text-xs text-slate-500">{deal.company} · won by {deal.closer || "—"}</p>
          </div>
          <button type="button" onClick={onClose} className="cursor-pointer rounded-xl p-2 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              <AlertCircle className="h-3.5 w-3.5" /> {error}
            </div>
          )}
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-[11px] font-semibold text-slate-700 sm:col-span-2">
              Project name
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={`mt-1 ${input}`} />
            </label>
            <label className="block text-[11px] font-semibold text-slate-700">
              Deadline
              <input type="date" required value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} className={`mt-1 ${input}`} />
            </label>
            <label className="block text-[11px] font-semibold text-slate-700">
              Budget (USD)
              <input type="number" min="0" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} className={`mt-1 ${input}`} />
            </label>
            <label className="block text-[11px] font-semibold text-slate-700 sm:col-span-2">
              Scope / notes for the team
              <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`mt-1 ${input}`} />
            </label>
          </div>
          <div className="space-y-4 border-t border-slate-100 pt-4">
            <AssigneePicker label="Developers *" hint="A person or a whole team for bigger projects · ★ = lead" people={board.people.developers} teams={board.teams} value={developers} onChange={setDevelopers} />
            <AssigneePicker label="Testers" hint="Optional — can also be added later" people={board.people.testers} teams={board.teams} value={testers} onChange={setTesters} />
            <AssigneePicker label="DevOps" hint="Optional — can also be added later" people={board.people.devops} teams={board.teams} value={devops} onChange={setDevops} />
          </div>
        </div>
        <div className="flex justify-end gap-2 border-t border-slate-100 px-6 py-4">
          <button type="button" onClick={onClose} className="cursor-pointer rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
          <button type="submit" disabled={saving} className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50">
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Briefcase className="h-3.5 w-3.5" />}
            Create project & notify team
          </button>
        </div>
      </form>
    </div>
  );
}
