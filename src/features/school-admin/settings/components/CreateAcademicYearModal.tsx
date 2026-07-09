import { useEffect, useMemo, useState } from "react";
import { X, ArrowRight, Eye, CheckCircle2, AlertCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getPreviousAcademicYear } from "@/components/common/hooks/useAcademicYears";
import {
  previewCarryForward,
  carryForward,
  getCarryForwardStatus,
  DEFAULT_CARRY_FORWARD_MODULES,
  type CarryForwardPreviewItem,
} from "@/services/academicYear.api";
import type { AcademicYear, CreateAcademicYearPayload } from "../types/settings.types";

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
  const [preview, setPreview] = useState<CarryForwardPreviewItem[] | null>(null);
  const [previewing, setPreviewing] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [cfError, setCfError] = useState<string | null>(null);

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
      // Never open the carry-forward step on the backend's say-so alone being
      // absent — a previous year existing isn't enough; the backend must also
      // confirm carry-forward is actually eligible for this new year.
      const cfStatus = prevForNew
        ? await getCarryForwardStatus().catch(() => ({ canCarryForward: false }))
        : null;
      if (prevForNew && cfStatus?.canCarryForward) {
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
    if (!previousYear) return;
    setPreviewing(true);
    setPreview(null);
    setCfError(null);
    try {
      const res = await previewCarryForward({
        sourceAcademicYearId: previousYear.id,
        modules: DEFAULT_CARRY_FORWARD_MODULES,
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
    setExecuting(true);
    setCfError(null);
    try {
      const res = await carryForward({
        sourceAcademicYearId: previousYear.id,
        targetAcademicYearId: targetYear.id,
        modules: DEFAULT_CARRY_FORWARD_MODULES,
      });
      if (res.status) {
        setDone(true);
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

                <div className="flex items-center gap-2">
                  <Button
                    onClick={handlePreview}
                    disabled={previewing}
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
                    {executing ? "Processing…" : "Execute Carry Forward"}
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
