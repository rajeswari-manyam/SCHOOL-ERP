import { useState, useEffect } from "react";
import {
  Loader2,
  ArrowRight,
  Eye,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import {
  getAllAcademicYears,
  previewCarryForward,
  carryForward,
  type AcademicYearRecord,
  type CarryForwardPreviewItem,
  type CarryForwardModule,
} from "@/services/academicYear.api";

// Keys must match CarryForwardModule exactly — these are the only modules the backend supports.
const MODULES: { key: CarryForwardModule; label: string; desc: string }[] = [
  { key: "classes",            label: "Classes",             desc: "Class names and structure" },
  { key: "sections",           label: "Sections",            desc: "Sections and teacher assignments" },
  { key: "subjects",           label: "Subjects",            desc: "Subject definitions" },
  { key: "subjectAssignments", label: "Subject Assignments", desc: "Subject–section–teacher mappings" },
  { key: "staff",              label: "Staff",               desc: "Staff records and assignments" },
  { key: "departments",        label: "Departments",         desc: "Department structure" },
];

export default function CarryForwardPage() {
  const [years, setYears]             = useState<AcademicYearRecord[]>([]);
  const [yearsLoading, setYearsLoading] = useState(true);
  const [sourceYearId, setSourceYearId] = useState("");
  const [targetYearId, setTargetYearId] = useState("");
  const [modules, setModules] = useState<Record<CarryForwardModule, boolean>>({
    classes: true,
    sections: true,
    subjects: true,
    subjectAssignments: true,
    staff: false,
    departments: false,
  });
  const [preview, setPreview]     = useState<CarryForwardPreviewItem[] | null>(null);
  const [previewing, setPreviewing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [executing, setExecuting]  = useState(false);
  const [done, setDone]            = useState<{ success: boolean; message: string } | null>(null);
  const [error, setError]          = useState<string | null>(null);

  useEffect(() => {
    getAllAcademicYears()
      .then((res) => {
        const list = res.data ?? [];
        setYears(list);
        const active = list.find((y) => y.isActive || y.active);
        if (active) setSourceYearId(active.id);
      })
      .catch(() => {})
      .finally(() => setYearsLoading(false));
  }, []);

  const activeModuleKeys = (Object.keys(modules) as CarryForwardModule[]).filter((k) => modules[k]);

  const canPreview =
    !!sourceYearId &&
    !!targetYearId &&
    sourceYearId !== targetYearId &&
    activeModuleKeys.length > 0;

  const modulesPayload = (): CarryForwardModule[] => activeModuleKeys;

  const handlePreview = async () => {
    if (!canPreview) return;
    setPreviewing(true);
    setPreview(null);
    setError(null);
    try {
      const res = await previewCarryForward({
        sourceAcademicYearId: sourceYearId,
        modules: modulesPayload(),
      });
      setPreview(res.data ?? []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Preview failed. Please try again.");
    } finally {
      setPreviewing(false);
    }
  };

  const handleExecute = async () => {
    setConfirming(false);
    setExecuting(true);
    setError(null);
    try {
      const res = await carryForward({
        sourceAcademicYearId: sourceYearId,
        targetAcademicYearId: targetYearId,
        modules: modulesPayload(),
      });
      setDone({
        success: res.status,
        message:
          res.message ??
          (res.status
            ? "Carry forward completed successfully!"
            : "Carry forward failed."),
      });
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Carry forward failed. Please try again.",
      );
    } finally {
      setExecuting(false);
    }
  };

  const sourceName = years.find((y) => y.id === sourceYearId)?.yearName ?? "";
  const targetName = years.find((y) => y.id === targetYearId)?.yearName ?? "";

  // ── Success / Error result state ──────────────────────────────────────────
  if (done) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-5">
        {done.success ? (
          <CheckCircle2 className="h-16 w-16 text-green-500" />
        ) : (
          <XCircle className="h-16 w-16 text-red-400" />
        )}
        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold text-gray-800">{done.message}</h2>
          <p className="text-sm text-gray-500">
            {done.success
              ? `Modules have been carried forward from ${sourceName} to ${targetName}.`
              : "Please review the details and try again."}
          </p>
        </div>
        <button
          onClick={() => {
            setDone(null);
            setPreview(null);
            setError(null);
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition"
        >
          <RotateCcw size={14} /> Start Over
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Academic Year Carry Forward</h1>
        <p className="mt-1 text-sm text-gray-500">
          Copy structure — classes, sections, subjects, and more — from one academic year to another.
        </p>
      </div>

      {/* Step 1 — Year selection */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Step 1 — Select Years</h2>

        {yearsLoading ? (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Loader2 size={14} className="animate-spin" /> Loading academic years…
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            <div className="flex-1 w-full">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                From Year
              </label>
              <select
                value={sourceYearId}
                onChange={(e) => {
                  setSourceYearId(e.target.value);
                  setPreview(null);
                  setError(null);
                }}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
              >
                <option value="">Select source year</option>
                {years.map((y) => (
                  <option key={y.id} value={y.id}>
                    {y.yearName}
                    {y.isActive || y.active ? " (Active)" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="hidden sm:flex items-center pb-3">
              <ArrowRight className="text-gray-400" size={18} />
            </div>

            <div className="flex-1 w-full">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                To Year
              </label>
              <select
                value={targetYearId}
                onChange={(e) => {
                  setTargetYearId(e.target.value);
                  setPreview(null);
                  setError(null);
                }}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
              >
                <option value="">Select target year</option>
                {years
                  .filter((y) => y.id !== sourceYearId)
                  .map((y) => (
                    <option key={y.id} value={y.id}>
                      {y.yearName}
                      {y.isActive || y.active ? " (Active)" : ""}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        )}

        {sourceYearId && targetYearId && sourceYearId === targetYearId && (
          <p className="text-xs text-red-500 flex items-center gap-1.5">
            <AlertCircle size={12} /> Source and target year must be different.
          </p>
        )}
      </div>

      {/* Step 2 — Module selection */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Step 2 — Select Modules</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {MODULES.map((m) => (
            <label
              key={m.key}
              className={`flex items-start gap-3 rounded-xl border p-3.5 cursor-pointer transition select-none ${
                modules[m.key]
                  ? "border-indigo-300 bg-indigo-50"
                  : "border-gray-200 bg-white hover:bg-gray-50"
              }`}
            >
              <input
                type="checkbox"
                checked={!!modules[m.key]}
                onChange={(e) => {
                  setModules((prev) => ({ ...prev, [m.key]: e.target.checked }));
                  setPreview(null);
                  setError(null);
                }}
                className="mt-0.5 h-4 w-4 accent-indigo-600 shrink-0"
              />
              <div>
                <p
                  className={`text-sm font-semibold ${
                    modules[m.key] ? "text-indigo-700" : "text-gray-700"
                  }`}
                >
                  {m.label}
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">{m.desc}</p>
              </div>
            </label>
          ))}
        </div>

        {activeModuleKeys.length === 0 && (
          <p className="text-xs text-amber-600 flex items-center gap-1.5">
            <AlertCircle size={12} /> Select at least one module to continue.
          </p>
        )}
      </div>

      {/* Step 3 — Preview & Execute */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Step 3 — Preview & Carry Forward</h2>
          <button
            onClick={handlePreview}
            disabled={!canPreview || previewing}
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {previewing ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <Eye size={12} />
            )}
            {previewing ? "Loading…" : "Preview Changes"}
          </button>
        </div>

        {!canPreview && !previewing && (
          <p className="text-xs text-gray-400">
            Complete steps 1 and 2 above to preview what will be carried forward.
          </p>
        )}

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 flex items-start gap-2">
            <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
            <p className="text-xs text-red-600">{error}</p>
          </div>
        )}

        {preview !== null &&
          (preview.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">
              No records found to carry forward for the selected modules.
            </p>
          ) : (
            <>
              <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        Module
                      </th>
                      <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        Records
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((row, i) => (
                      <tr
                        key={i}
                        className="border-t border-gray-50 hover:bg-gray-50/60 transition"
                      >
                        <td className="px-4 py-3 font-medium text-gray-800">{row.name}</td>
                        <td className="px-4 py-3 text-right font-bold text-indigo-600">
                          {row.count}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  onClick={() => setConfirming(true)}
                  disabled={executing}
                  className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {executing ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <ChevronRight size={14} />
                  )}
                  {executing ? "Processing…" : "Carry Forward Now"}
                </button>
              </div>
            </>
          ))}
      </div>

      {/* Confirmation dialog */}
      {confirming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Confirm Carry Forward</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              You are about to copy{" "}
              <strong>{activeModuleKeys.length} module{activeModuleKeys.length !== 1 ? "s" : ""}</strong>{" "}
              from{" "}
              <span className="font-semibold text-indigo-600">{sourceName}</span> to{" "}
              <span className="font-semibold text-indigo-600">{targetName}</span>.
            </p>
            <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-700">
              Existing records in the target year for selected modules may be skipped to avoid duplicates.
            </div>
            <div className="flex gap-3 justify-end pt-1">
              <button
                onClick={() => setConfirming(false)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleExecute}
                className="rounded-lg bg-green-600 px-5 py-2 text-sm font-bold text-white hover:bg-green-700 transition"
              >
                Yes, Carry Forward
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
