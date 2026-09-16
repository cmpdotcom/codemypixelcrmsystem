"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Edit2, Loader2, CheckCircle2, AlertCircle, X, ArrowRight } from "lucide-react";
import { SettingsPageHeader } from "@/components/SettingsPageHeader";
import { FormCard, FormField, Badge, SaveBar } from "@/components/SettingsUI";

interface Stage {
  name: string;
  color: string;
}

interface Pipeline {
  id: string;
  name: string;
  stages: Stage[];
}

const STAGE_COLORS: Record<string, string> = {
  blue: "bg-blue-500",
  cyan: "bg-cyan-500",
  amber: "bg-amber-500",
  purple: "bg-purple-500",
  indigo: "bg-indigo-500",
  green: "bg-emerald-500",
  slate: "bg-slate-400",
};

export default function PipelinesPage() {
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Edit / Add Modal
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [pipelineForm, setPipelineForm] = useState({ id: "", name: "", stages: [] as Stage[] });
  const [newStageName, setNewStageName] = useState("");
  const [newStageColor, setNewStageColor] = useState("blue");

  const fetchPipelines = useCallback(async () => {
    try {
      const res = await fetch("/api/settings/pipelines");
      if (!res.ok) throw new Error("Failed to load pipelines");
      const data = await res.json();
      setPipelines(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPipelines();
  }, [fetchPipelines]);

  const savePipelines = async (updated: Pipeline[]) => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/settings/pipelines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error("Failed to save pipelines");
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      setPipelines(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleOpenCreate = () => {
    setModalMode("create");
    setPipelineForm({
      id: "",
      name: "",
      stages: [
        { name: "Qualified", color: "blue" },
        { name: "Meeting", color: "cyan" },
        { name: "Proposal", color: "amber" },
        { name: "Won", color: "green" },
      ],
    });
    setShowModal(true);
  };

  const handleOpenEdit = (p: Pipeline) => {
    setModalMode("edit");
    setPipelineForm({
      id: p.id,
      name: p.name,
      stages: [...p.stages],
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this pipeline?")) return;
    const next = pipelines.filter((p) => p.id !== id);
    savePipelines(next);
  };

  const handleAddStage = () => {
    if (!newStageName.trim()) return;
    setPipelineForm({
      ...pipelineForm,
      stages: [...pipelineForm.stages, { name: newStageName.trim(), color: newStageColor }],
    });
    setNewStageName("");
  };

  const handleRemoveStage = (idx: number) => {
    setPipelineForm({
      ...pipelineForm,
      stages: pipelineForm.stages.filter((_, i) => i !== idx),
    });
  };

  const handleSubmitModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pipelineForm.name.trim() || pipelineForm.stages.length === 0) return;

    if (modalMode === "create") {
      const id = pipelineForm.name.toLowerCase().replace(/\s+/g, "-");
      const next = [
        ...pipelines,
        {
          id,
          name: pipelineForm.name.trim(),
          stages: pipelineForm.stages,
        },
      ];
      savePipelines(next);
    } else {
      const next = pipelines.map((p) =>
        p.id === pipelineForm.id
          ? { ...p, name: pipelineForm.name.trim(), stages: pipelineForm.stages }
          : p
      );
      savePipelines(next);
    }
    setShowModal(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        <span className="ml-2 text-sm text-slate-500">Loading deal pipelines...</span>
      </div>
    );
  }

  return (
    <div>
      <SettingsPageHeader
        title="Deal Pipelines"
        description="Configure structured multi-stage pipelines to track deals to closure"
      />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-medium px-4 py-3 rounded-xl mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 font-bold">×</button>
        </div>
      )}

      {saved && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium px-4 py-3 rounded-xl mb-5 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Pipelines saved to database!</span>
        </div>
      )}

      <div className="flex justify-end mb-4">
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-500/20 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Pipeline
        </button>
      </div>

      <div className="space-y-4">
        {pipelines.map((pipeline) => (
          <div
            key={pipeline.id}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 hover:border-slate-300 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <h3 className="text-sm font-bold text-slate-900">{pipeline.name}</h3>
                <Badge label={`${pipeline.stages.length} stages`} color="blue" />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(pipeline)}
                  className="px-3 py-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Edit2 className="w-3 h-3" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(pipeline.id)}
                  className="px-3 py-1.5 text-xs font-semibold text-rose-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
              </div>
            </div>

            <div className="flex items-center flex-wrap gap-2 pt-2 border-t border-slate-100">
              {pipeline.stages.map((stage, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 border border-slate-200/90 rounded-full">
                    <span className={`w-2 h-2 rounded-full ${STAGE_COLORS[stage.color] || "bg-blue-500"}`} />
                    <span className="text-xs font-medium text-slate-700">{stage.name}</span>
                  </div>
                  {idx < pipeline.stages.length - 1 && (
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Pipeline Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                {modalMode === "create" ? "Create New Pipeline" : `Edit Pipeline: ${pipelineForm.name}`}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitModal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Pipeline Name *</label>
                <input
                  type="text"
                  required
                  value={pipelineForm.name}
                  onChange={(e) => setPipelineForm({ ...pipelineForm, name: e.target.value })}
                  placeholder="e.g. Enterprise Software Sales"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pipeline Stages ({pipelineForm.stages.length})
                </label>
                <div className="space-y-1.5 border border-slate-200 rounded-lg p-2 max-h-48 overflow-y-auto divide-y divide-slate-100">
                  {pipelineForm.stages.map((st, i) => (
                    <div key={i} className="flex items-center justify-between py-1.5 px-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${STAGE_COLORS[st.color] || "bg-blue-500"}`} />
                        <span className="font-medium text-slate-800">{st.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveStage(i)}
                        className="p-1 text-slate-400 hover:text-red-600 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="text"
                    value={newStageName}
                    onChange={(e) => setNewStageName(e.target.value)}
                    placeholder="Add new stage name..."
                    className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <select
                    value={newStageColor}
                    onChange={(e) => setNewStageColor(e.target.value)}
                    className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    {Object.keys(STAGE_COLORS).map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleAddStage}
                    className="px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 border border-blue-200 rounded-lg"
                  >
                    + Stage
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg shadow-sm shadow-blue-500/20 transition-all flex items-center gap-1.5"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Save Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
