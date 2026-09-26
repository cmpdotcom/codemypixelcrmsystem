"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Code,
  FolderKanban,
  Loader2,
  Phone,
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
    <div className="mx-auto w-full max-w-[1600px] space-y-6 p-6 pb-12 md:p-8">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Workflow</h2>
        <p className="mt-1 text-xs text-slate-500">
          Setter → Closer → Delivery. Every hand-off waiting on an executive decision, in one place.
        </p>
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
          You can view this board. Assigning closers and delivery teams needs the Workflow “assign” permission.
        </div>
      )}

      <div className="grid grid-cols-2 gap-3.5 xl:grid-cols-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={step.label} className="relative flex items-center gap-3.5 rounded-2xl border border-slate-100/90 bg-white p-4 shadow-sm">
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${step.tone}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500">{index + 1}. {step.label}</p>
                <h3 className="text-xl font-extrabold text-slate-900">{step.count}</h3>
                <p className="text-[10px] text-slate-400">{step.sub}</p>
              </div>
              {index < steps.length - 1 && <ArrowRight className="absolute -right-3 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-slate-300 xl:block" />}
            </div>
          );
        })}
      </div>

      {/* 1. Interested leads → assign a closer */}
      <Section
        title="1 · Interested leads waiting for a closer"
        subtitle="Setters marked these leads interested in a meeting. Pick the closer who should take the meeting."
        empty="No leads are waiting. When a setter marks a lead interested it shows up here."
        count={board?.awaitingCloser.length || 0}
      >
        {board?.awaitingCloser.map((lead) => (
          <div key={lead.id} className="flex flex-col gap-3 border-b border-slate-50 py-3 last:border-0 lg:flex-row lg:items-center">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Link href={`/leads?lead=${lead.id}`} className="text-sm font-bold text-slate-900 hover:text-blue-600">{lead.name}</Link>
                <span className="text-xs text-slate-500">{lead.company}</span>
                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500">LD-{String(lead.leadNumber).padStart(5, "0")}</span>
              </div>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Setter <b className="text-slate-700">{lead.setter || "—"}</b> · marked {since(lead.interestedAt, loadedAt)}
                {lead.service && <> · {lead.service}</>}
                {lead.budget && <> · {lead.budget}</>}
                {lead.nextFollowUp && <> · meeting pref. {shortDate(lead.nextFollowUp)}</>}
              </p>
              {lead.interestedNote && <p className="mt-1 rounded-lg bg-amber-50 px-2 py-1 text-[11px] text-amber-900">“{lead.interestedNote}”</p>}
            </div>
            {canManage && (
              <div className="flex shrink-0 items-center gap-2">
                <select
                  value={closerChoice[lead.id] || ""}
                  onChange={(event) => setCloserChoice({ ...closerChoice, [lead.id]: event.target.value })}
                  className="w-48 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700"
                >
                  <option value="">Choose closer…</option>
                  {board.people.closers.map((closer) => (
                    <option key={closer.id} value={closer.id}>{closer.name}</option>
                  ))}
                </select>
                <button
                  onClick={() => assignCloser(lead)}
                  disabled={busy === `lead:${lead.id}`}
                  className="flex cursor-pointer items-center gap-1 rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
                >
                  {busy === `lead:${lead.id}` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UserCheck className="h-3.5 w-3.5" />}
                  Assign
                </button>
                <button
                  onClick={() => sendBack(lead)}
                  disabled={busy === `lead:${lead.id}`}
                  title="Send back to setter"
                  className="cursor-pointer rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-800 disabled:opacity-50"
                >
                  <Undo2 className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        ))}
        {canManage && board && board.people.closers.length === 0 && board.awaitingCloser.length > 0 && (
          <p className="pt-2 text-[11px] text-amber-700">No active users have the Closer role yet — invite one from Users.</p>
        )}
      </Section>

      {/* 2. Deals with closers */}
      <Section
        title="2 · With closers"
        subtitle="Open deals. The closer runs the meeting and marks the deal Won when the client agrees to work with you."
        empty="No open deals with closers right now."
        count={board?.withClosers.length || 0}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] uppercase tracking-wide text-slate-400">
                <th className="py-2 pr-3 font-semibold">Deal</th>
                <th className="py-2 pr-3 font-semibold">Stage</th>
                <th className="py-2 pr-3 font-semibold">Value</th>
                <th className="py-2 pr-3 font-semibold">Expected close</th>
                <th className="py-2 font-semibold">Closer</th>
              </tr>
            </thead>
            <tbody>
              {board?.withClosers.map((deal) => (
                <tr key={deal.id} className="border-b border-slate-50 last:border-0">
                  <td className="py-2.5 pr-3">
                    <p className="font-bold text-slate-900">{deal.title}</p>
                    <p className="text-[11px] text-slate-500">{deal.company}{deal.contact ? ` · ${deal.contact}` : ""}</p>
                  </td>
                  <td className="py-2.5 pr-3">
                    <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700">{stageLabel[deal.stage] || deal.stage}</span>
                  </td>
                  <td className="py-2.5 pr-3 font-semibold text-slate-800">{money(deal.value)}</td>
                  <td className="py-2.5 pr-3 text-slate-600">{shortDate(deal.expectedCloseDate)}</td>
                  <td className="py-2.5">
                    {canManage ? (
                      <select
                        value={deal.closerId || ""}
                        disabled={busy === `deal:${deal.id}`}
                        onChange={(event) => reassignDeal(deal, event.target.value)}
                        className="w-44 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700"
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
        title="3 · Won deals waiting for a delivery team"
        subtitle="The client said yes. Create the project and assign developers — and a tester or DevOps if needed."
        empty="No won deals are waiting for a project."
        count={board?.awaitingDelivery.length || 0}
      >
        {board?.awaitingDelivery.map((deal) => (
          <div key={deal.id} className="flex flex-col gap-3 border-b border-slate-50 py-3 last:border-0 sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-900">{deal.title}</p>
              <p className="text-[11px] text-slate-500">
                {deal.company} · {money(deal.value)} · closed by <b className="text-slate-700">{deal.closer || "—"}</b> · won {shortDate(deal.closedAt)}
              </p>
            </div>
            {canManage && (
              <button
                onClick={() => setStartingDeal(deal)}
                className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700"
              >
                <Briefcase className="h-3.5 w-3.5" /> Start project
              </button>
            )}
          </div>
        ))}
      </Section>

      {/* 4. Active projects and their coverage */}
      <Section
        title="4 · Active projects"
        subtitle="Who is developing, testing and deploying each project. Add a tester or DevOps at any time from the project page."
        empty="No active projects."
        count={board?.activeProjects.length || 0}
      >
        {board?.activeProjects.map((project) => (
          <div key={project.id} className="flex flex-col gap-2 border-b border-slate-50 py-3 last:border-0 lg:flex-row lg:items-center">
            <div className="min-w-0 lg:w-72">
              <Link href={`/projects/${project.id}`} className="text-sm font-bold text-slate-900 hover:text-blue-600">{project.name}</Link>
              <p className="text-[11px] text-slate-500">{project.clientName} · {project.status} · due {shortDate(project.deadline)} · {project.progress}%</p>
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
  title,
  subtitle,
  empty,
  count,
  children,
}: {
  title: string;
  subtitle: string;
  empty: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-100/90 bg-white p-5 shadow-sm">
      <div className="mb-2 flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900">{title}</h3>
          <p className="mt-0.5 text-[11px] text-slate-500">{subtitle}</p>
        </div>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-600">{count}</span>
      </div>
      {count === 0 ? <p className="py-4 text-center text-xs text-slate-400">{empty}</p> : children}
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
