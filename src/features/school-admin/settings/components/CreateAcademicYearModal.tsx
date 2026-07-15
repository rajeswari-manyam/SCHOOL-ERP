import { useEffect, useMemo, useState } from "react";
import { X, ArrowRight, Eye, CheckCircle2, AlertCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getPreviousAcademicYear } from "@/components/common/hooks/useAcademicYears";
import {
  previewCarryForward,
  carryForward,
  checkCarryForwardEligibility,
  markCarryForwardCompleted,
  DEFAULT_CARRY_FORWARD_MODULES,
  type CarryForwardModule,
  type CarryForwardPreviewItem,
} from "@/services/academicYear.api";
import type { AcademicYear, CreateAcademicYearPayload } from "../types/settings.types";

// Keys must match CarryForwardModule exactly — these are the only modules the backend supports.
const MODULES: { key: CarryForwardModule; label: string; desc: string }[] = [
  { key: "classes",            label: "Classes",             desc: "Class names and structure" },
  { key: "sections",           label: "Sections",            desc: "Sections and teacher assignments" },
  { key: "subjects",           label: "Subjects",            desc: "Subject definitions" },
  { key: "subjectAssignments", label: "Subject Assignments", desc: "Subject–section–teacher mappings" },
  { key: "staff",              label: "Staff",               desc: "Staff records and assignments" },
  { key: "departments",        label: "Departments",         desc: "Department structure" },
];

// All modules selected by default — admin can uncheck the ones they don't want copied.
const DEFAULT_MODULES_SELECTED = Object.fromEntries(
  DEFAULT_CARRY_FORWARD_MODULES.map((key) => [key, true]),
) as Record<CarryForwardModule, boolean>;

interface Props {
  onClose: () => void;
  /** Full list of academic years that exist before this modal's action runs. */
  academicYears: AcademicYear[];
  /** "create" opens the new-year form; "carryForward" jumps straight to the carry-forward step for `carryForwardTarget`. */
  mode?: "create" | "carryForward";
  /** Required when mode = "carryForward" — the year data will be copied into. */
  carryForwardTarget?: AcademicYear;
  /** Whether carry-forward has already run for `carryForwardTarget`. */
  carryForwardDone?: boolean;
  /** Only needed for mode = "create". */
  onSubmit?: (data: CreateAcademicYearPayload) => Promise<AcademicYear>;
  /** Notifies the caller once carry-forward finishes successfully for a target year. */
  onCarryForwardComplete?: (targetAcademicYearId: string) => void;
}

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{label}</label>
    {children}
  </div>
);

const getDefaultYearName = () => {
  const y = new Date().getFullYear();
  return `${y}-${y + 1}`;
};

export const CreateAcademicYearModal = ({
  onClose,
  academicYears,
  mode = "create",
  carryForwardTarget,
  carryForwardDone = false,
  onSubmit,
  onCarryForwardComplete,
}: Props) => {
  // Snapshot the years that exist right now — used to resolve "the immediately
  // previous academic year" without it shifting if the list refreshes mid-flow.
  const [baseYears] = useState<AcademicYear[]>(academicYears);

  const [step, setStep] = useState<"form" | "carryForward">(mode === "carryForward" ? "carryForward" : "form");
  const [targetYear, setTargetYear] = useState<AcademicYear | null>(mode === "carryForward" ? carryForwardTarget ?? null : null);
  const [done, setDone] = useState(mode === "carryForward" ? carryForwardDone : false);

  // ── Create-year form state ──────────────────────────────────────────────
  const [yearName, setYearName] = useState(getDefaultYearName());
  const now = new Date();
  const [startDate, setStartDate] = useState(`${now.getFullYear()}-06-01`);
  const [endDate, setEndDate] = useState(`${now.getFullYear() + 1}-03-31`);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Carry-forward step state ────────────────────────────────────────────
  const [modules, setModules] = useState<Record<CarryForwardModule, boolean>>(DEFAULT_MODULES_SELECTED);
  const [preview, setPreview] = useState<CarryForwardPreviewItem[] | null>(null);
  const [previewing, setPreviewing] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [cfError, setCfError] = useState<string | null>(null);

  const activeModuleKeys = (Object.keys(modules) as CarryForwardModule[]).filter((k) => modules[k]);

  const previousYear = useMemo(
    () => (targetYear ? getPreviousAcademicYear(baseYears, targetYear) : null),
    [targetYear, baseYears],
  );

  useEffect(() => {
    if (mode === "carryForward") setDone(carryForwardDone);
  }, [mode, carryForwardDone]);

  const handleSubmit = async () => {
    if (!yearName.trim() || !startDate || !endDate || !onSubmit) return;
    if (new Date(endDate) <= new Date(startDate)) return;
    setLoading(true);
    setError(null);
    try {
      const created = await onSubmit({ yearName: yearName.trim(), startDate, endDate });
      const prevForNew = getPreviousAcademicYear(baseYears, created);
      // Never open the carry-forward step on a previous year existing alone —
      // there also has to be something for it to actually copy.
      const eligible = prevForNew ? await checkCarryForwardEligibility(prevForNew.id) : false;
      if (prevForNew && eligible) {
        setTargetYear(created);
        setStep("carryForward");
      } else {
        onClose();
      }
    } catch (err: any) {
      setError(err?.message || "Failed to create academic year");
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = async () => {
    if (!previousYear || activeModuleKeys.length === 0) return;
    setPreviewing(true);
    setPreview(null);
    setCfError(null);
    try {
      const res = await previewCarryForward({
        sourceAcademicYearId: previousYear.id,
        modules: activeModuleKeys,
      });
      setPreview(res.data ?? []);
    } catch (err: any) {
      setCfError(err?.message ?? "Preview failed.");
    } finally {
      setPreviewing(false);
    }
  };

  const handleExecute = async () => {
    if (!previousYear || !targetYear) return;
    // Admin unchecked every module — nothing to copy, so just close without calling the backend.
    if (activeModuleKeys.length === 0) {
      onClose();
      return;
    }
    setExecuting(true);
    setCfError(null);
    try {
      const res = await carryForward({
        sourceAcademicYearId: previousYear.id,
        targetAcademicYearId: targetYear.id,
        modules: activeModuleKeys,
      });
      if (res.status) {
        setDone(true);
        markCarryForwardCompleted(targetYear.id, activeModuleKeys);
        onCarryForwardComplete?.(targetYear.id);
      } else {
        setCfError(res.message ?? "Carry forward failed.");
      }
    } catch (err: any) {
      setCfError(err?.message ?? "Carry forward failed.");
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        <div className="flex justify-center pt-3 sm:hidden shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        <div className="flex items-start justify-between px-4 sm:px-6 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              {step === "form" ? "Create Academic Year" : "Carry Forward Data"}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {step === "form" ? "Add a new academic session" : "Copy data from the previous academic year"}
            </p>
          </div>
          <Button onClick={onClose} variant="ghost" size="sm" className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 shrink-0">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* ── Step 1: Create year ── */}
        {step === "form" && (
          <>
            <div className="px-4 sm:px-6 py-4 space-y-4">
              <Field label="Year Name *">
                <Input placeholder="e.g. 2025-2026" value={yearName} onChange={(e) => setYearName(e.target.value)} />
              </Field>
              <Field label="Start Date *">
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </Field>
              <Field label="End Date *">
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </Field>
              {endDate && startDate && new Date(endDate) <= new Date(startDate) && (
                <p className="text-xs text-red-500">End date must be after start date</p>
              )}
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 px-4 sm:px-6 py-4 border-t border-gray-100 shrink-0">
              <Button onClick={onClose} variant="outline" className="w-full sm:w-auto">Cancel</Button>
              <Button
                onClick={handleSubmit}
                disabled={
                  loading ||
                  !yearName.trim() ||
                  !startDate ||
                  !endDate ||
                  new Date(endDate) <= new Date(startDate)
                }
                className="w-full sm:w-auto bg-indigo-600 text-white"
              >
                {loading ? "Creating..." : "Create Year"}
              </Button>
            </div>
            {error && (
              <div className="px-4 sm:px-6 pb-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-xs font-semibold text-red-700 flex items-center gap-1.5 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                    Failed to create academic year
                  </p>
                  <p className="text-[11px] text-red-600 font-mono whitespace-pre-wrap break-all leading-relaxed">
                    {error}
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── Step 2: Carry forward (only reachable when a previous year exists) ── */}
        {step === "carryForward" && targetYear && previousYear && (
          <div className="px-4 sm:px-6 py-4 space-y-4">
            <div className="flex items-center gap-3 text-sm bg-gray-50 rounded-xl border border-gray-100 px-4 py-3">
              <div className="flex-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Previous Academic Year</p>
                <p className="font-semibold text-gray-700">{previousYear.yearName}</p>
              </div>
              <ArrowRight size={14} className="text-gray-400 shrink-0" />
              <div className="flex-1 text-right">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Current Academic Year</p>
                <p className="font-semibold text-indigo-600">{targetYear.yearName}</p>
              </div>
            </div>

            {done ? (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <p className="text-xs font-semibold text-emerald-700">
                  Carry forward already completed for {targetYear.yearName}.
                </p>
              </div>
            ) : (
              <>
                {cfError && (
                  <div className="flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
                    <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-red-600">{cfError}</p>
                  </div>
                )}

                {preview !== null && (
                  preview.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-2">No records found to carry forward.</p>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-gray-100">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Module</th>
                            <th className="px-3 py-2 text-right text-[10px] font-bold uppercase tracking-widest text-gray-400">Records</th>
                          </tr>
                        </thead>
                        <tbody>
                          {preview.map((row, i) => (
                            <tr key={i} className="border-t border-gray-50">
                              <td className="px-3 py-2 font-medium text-gray-800 capitalize">{row.name}</td>
                              <td className="px-3 py-2 text-right font-bold text-indigo-600">{row.count}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                )}

                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Select Modules to Carry Forward</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {MODULES.map((m) => (
                      <label
                        key={m.key}
                        className={`flex items-start gap-2.5 rounded-xl border p-3 cursor-pointer transition select-none ${
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
                            setCfError(null);
                          }}
                          className="mt-0.5 h-4 w-4 accent-indigo-600 shrink-0"
                        />
                        <div>
                          <p className={`text-xs font-semibold ${modules[m.key] ? "text-indigo-700" : "text-gray-700"}`}>
                            {m.label}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-0.5">{m.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                  {activeModuleKeys.length === 0 && (
                    <p className="text-xs text-amber-600 flex items-center gap-1.5">
                      <AlertCircle size={12} /> No modules selected — nothing will be carried forward.
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={handlePreview}
                    disabled={previewing || activeModuleKeys.length === 0}
                    variant="outline"
                    className="flex-1 flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    {previewing ? "Loading…" : "Preview"}
                  </Button>
                  <Button
                    onClick={handleExecute}
                    disabled={executing}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-green-600 text-white"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                    {executing
                      ? "Processing…"
                      : activeModuleKeys.length === 0
                      ? "Skip Carry Forward"
                      : "Execute Carry Forward"}
                  </Button>
                </div>
              </>
            )}

            <div className="flex justify-end pt-1">
              <Button onClick={onClose} variant="outline" className="w-full sm:w-auto">
                {done ? "Close" : "Skip for now"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};