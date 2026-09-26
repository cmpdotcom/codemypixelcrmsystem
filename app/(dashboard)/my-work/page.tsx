"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, Briefcase, Bug, CheckSquare, FolderKanban, Loader2, Phone, Send } from "lucide-react";

interface MyWork {
  roleName: string;
  isManager: boolean;
  leadsToWork: { id: string; leadNumber: number; name: string; company: string; phone: string | null; status: string; nextFollowUp: string | null }[];
  leadsHandedOff: number;
  deals: {
    id: string;
    dealNumber: number;
    title: string;
    company: string;
    contact: string | null;
    stage: string;
    value: number;
    expectedCloseDate: string | null;
    lead: { id: string; phone: string | null; email: string; interestedNote: string | null; setter: string | null } | null;
  }[];
  projects: { id: string; projNumber: number; name: string; clientName: string; status: string; health: string; progress: number; deadline: string; roles: string[] }[];
  tasks: { id: string; taskNumber: number; name: string; projectName: string; status: string; priority: string; dueDate: string }[];
  bugs: { id: string; bugNumber: number; title: string; projectName: string; status: string; severity: string }[];
}

const shortDate = (value: string | null) =>
  value ? new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—";
const money = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value || 0);
const healthTone: Record<string, string> = {
  "on-track": "bg-emerald-50 text-emerald-700",
  "at-risk": "bg-amber-50 text-amber-700",
  critical: "bg-rose-50 text-rose-700",
};

export default function MyWorkPage() {
  const [work, setWork] = useState<MyWork | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/my-work")
      .then(async (res) => {
        const data = await res.json().catch(() => null);
        if (cancelled) return;
        if (!res.ok) throw new Error(data?.error || "Could not load your work");
        setWork(data);
      })
      .catch((e) => !cancelled && setError(e instanceof Error ? e.message : "Could not load your work"));
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className="mx-auto max-w-3xl p-8">
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      </div>
    );
  }
  if (!work) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
      </div>
    );
  }

  const role = work.roleName;
  const show = {
    leads: role === "Setter" || work.leadsToWork.length > 0,
    deals: role === "Closer" || work.deals.length > 0,
    projects: ["Developer", "Tester", "QA", "DevOps"].includes(role) || work.projects.length > 0,
    tasks: work.tasks.length > 0 || role === "Developer",
    bugs: work.bugs.length > 0 || role === "Tester" || role === "QA",
  };
  const nothing = !Object.values(show).some(Boolean);

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-6 p-6 pb-12 md:p-8">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">My Work</h2>
        <p className="mt-1 text-xs text-slate-500">Everything assigned to you right now{role ? ` as ${role}` : ""}.</p>
      </div>

      {nothing && (
        <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
          Nothing is assigned to you right now.
          {work.isManager && (
            <>
              {" "}See the <Link href="/workflow" className="font-semibold text-blue-600 hover:underline">Workflow board</Link> for hand-offs waiting on you.
            </>
          )}
        </div>
      )}

      {show.leads && (
        <Card
          icon={Phone}
          tone="bg-amber-50 text-amber-600"
          title="Leads to call"
          subtitle={`${work.leadsToWork.length} open · ${work.leadsHandedOff} handed to executives so far`}
          empty="No open leads. New leads assigned to you will appear here."
          count={work.leadsToWork.length}
        >
          {work.leadsToWork.map((lead) => (
            <Row key={lead.id} href={`/leads?lead=${lead.id}`}>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">{lead.name}</p>
                <p className="truncate text-[11px] text-slate-500">{lead.company}{lead.phone ? ` · ${lead.phone}` : ""}</p>
              </div>
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">{lead.status}</span>
              <span className="w-16 text-right text-[11px] text-slate-500">{shortDate(lead.nextFollowUp)}</span>
            </Row>
          ))}
          {work.leadsToWork.length > 0 && (
            <p className="flex items-center gap-1.5 pt-3 text-[11px] text-slate-500">
              <Send className="h-3 w-3" /> When a lead wants a meeting, open it and click <b>Mark interested — request meeting</b>.
            </p>
          )}
        </Card>
      )}

      {show.deals && (
        <Card
          icon={Briefcase}
          tone="bg-indigo-50 text-indigo-600"
          title="My meetings & deals"
          subtitle="Mark a deal Won on the Deals page when the client agrees to work with us."
          empty="No open deals. Executives assign interested leads to you."
          count={work.deals.length}
        >
          {work.deals.map((deal) => (
            <Row key={deal.id} href="/deals">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">{deal.title}</p>
                <p className="truncate text-[11px] text-slate-500">
                  {deal.company}{deal.contact ? ` · ${deal.contact}` : ""}{deal.lead?.phone ? ` · ${deal.lead.phone}` : ""}
                  {deal.lead?.setter ? ` · set by ${deal.lead.setter}` : ""}
                </p>
                {deal.lead?.interestedNote && <p className="mt-0.5 truncate text-[11px] italic text-amber-700">“{deal.lead.interestedNote}”</p>}
              </div>
              <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-bold capitalize text-indigo-700">{deal.stage}</span>
              <span className="w-20 text-right text-xs font-semibold text-slate-800">{money(deal.value)}</span>
            </Row>
          ))}
        </Card>
      )}

      {show.projects && (
        <Card
          icon={FolderKanban}
          tone="bg-blue-50 text-blue-600"
          title="My projects"
          subtitle="Projects you or your team are assigned to."
          empty="You are not assigned to any active project yet."
          count={work.projects.length}
        >
          {work.projects.map((project) => (
            <Row key={project.id} href={`/projects/${project.id}`}>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">{project.name}</p>
                <p className="truncate text-[11px] text-slate-500">{project.clientName} · {project.roles.join(", ")}</p>
              </div>
              <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${healthTone[project.health] || "bg-slate-100 text-slate-600"}`}>{project.status}</span>
              <span className="w-24 text-right text-[11px] text-slate-500">{project.progress}% · {shortDate(project.deadline)}</span>
            </Row>
          ))}
        </Card>
      )}

      {show.tasks && (
        <Card icon={CheckSquare} tone="bg-sky-50 text-sky-600" title="My tasks" subtitle="Open tasks assigned to you." empty="No open tasks." count={work.tasks.length}>
          {work.tasks.map((task) => (
            <Row key={task.id} href={`/projects/tasks/${task.id}`}>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">{task.name}</p>
                <p className="truncate text-[11px] text-slate-500">{task.projectName} · {task.priority}</p>
              </div>
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">{task.status}</span>
              <span className="w-16 text-right text-[11px] text-slate-500">{shortDate(task.dueDate)}</span>
            </Row>
          ))}
        </Card>
      )}

      {show.bugs && (
        <Card icon={Bug} tone="bg-rose-50 text-rose-600" title="My bugs" subtitle="Open bugs assigned to you." empty="No open bugs." count={work.bugs.length}>
          {work.bugs.map((bug) => (
            <Row key={bug.id} href={`/qa/bugs/${bug.id}`}>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">{bug.title}</p>
                <p className="truncate text-[11px] text-slate-500">{bug.projectName} · {bug.severity}</p>
              </div>
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">{bug.status}</span>
            </Row>
          ))}
        </Card>
      )}
    </div>
  );
}

function Card({
  icon: Icon,
  tone,
  title,
  subtitle,
  empty,
  count,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  tone: string;
  title: string;
  subtitle: string;
  empty: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-100/90 bg-white p-5 shadow-sm">
      <div className="mb-2 flex items-center gap-3 border-b border-slate-100 pb-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${tone}`}><Icon className="h-4 w-4" /></div>
        <div className="flex-1">
          <h3 className="text-sm font-extrabold text-slate-900">{title}</h3>
          <p className="text-[11px] text-slate-500">{subtitle}</p>
        </div>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-600">{count}</span>
      </div>
      {count === 0 ? <p className="py-4 text-center text-xs text-slate-400">{empty}</p> : <div>{children}</div>}
    </section>
  );
}

function Row({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="-mx-2 flex items-center gap-3 rounded-lg border-b border-slate-50 px-2 py-2.5 last:border-0 hover:bg-slate-50">
      {children}
    </Link>
  );
}
