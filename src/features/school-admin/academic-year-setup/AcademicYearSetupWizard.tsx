import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Loader2, ArrowRight, Eye, CheckCircle2,
  AlertCircle, ChevronRight, GraduationCap, Search, Users,
} from "lucide-react";
import {
  getAllAcademicYears,
  previewCarryForward,
  carryForward,
  promoteStudents,
  markCarryForwardCompleted,
  type AcademicYearRecord,
  type CarryForwardPreviewItem,
  type CarryForwardModule,
} from "@/services/academicYear.api";
import { getAllClasses } from "@/services/class.api";
import {
  getSectionsByClassIdFromApi,
  getStudentsByClassSection,
  type SectionStudent,
} from "@/services/section.api";
import { useCarryForwardStore } from "@/store/carryForwardStore";
import { getPreviousAcademicYear } from "@/components/common/hooks/useAcademicYears";

// ── Types ─────────────────────────────────────────────────────────────────────

type Step = "year" | "modules" | "promotion" | "done";
type PromotionAction = "PROMOTE" | "REPEAT" | "DROPOUT" | "TRANSFERRED" | "GRADUATED";

interface Option { value: string; label: string; }

interface PromotionRow {
  student: SectionStudent;
  action: PromotionAction;
  targetClassId: string;
  targetSectionId: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────

// Keys must match backend module names exactly
const MODULES: { key: CarryForwardModule; label: string; desc: string; defaultOn: boolean }[] = [
  { key: "classes",            label: "Classes",             desc: "Class names and structure",        defaultOn: true  },
  { key: "sections",           label: "Sections",            desc: "Sections and teacher assignments", defaultOn: true  },
  { key: "subjects",           label: "Subjects",            desc: "Subject definitions",              defaultOn: true  },
  { key: "subjectAssignments", label: "Subject Assignments", desc: "Subject–section–teacher mappings", defaultOn: true  },
  { key: "staff",              label: "Staff",               desc: "Staff records and assignments",    defaultOn: false },
  { key: "departments",        label: "Departments",         desc: "Department structure",             defaultOn: false },
];

const ACTION_OPTIONS: { value: PromotionAction; label: string; color: string }[] = [
  { value: "PROMOTE",     label: "Promote",     color: "text-green-700 bg-green-50 border-green-200"    },
  { value: "REPEAT",      label: "Repeat Year", color: "text-amber-700 bg-amber-50 border-amber-200"    },
  { value: "DROPOUT",     label: "Dropout",     color: "text-red-700 bg-red-50 border-red-200"          },
  { value: "TRANSFERRED", label: "Transferred", color: "text-blue-700 bg-blue-50 border-blue-200"       },
  { value: "GRADUATED",   label: "Graduated",   color: "text-purple-700 bg-purple-50 border-purple-200" },
];

const DEFAULT_MODULES = Object.fromEntries(
  MODULES.map((m) => [m.key, m.defaultOn])
) as Record<CarryForwardModule, boolean>;

function actionColor(action: PromotionAction): string {
  return ACTION_OPTIONS.find((a) => a.value === action)?.color ?? "";
}

const needsClassSelect = (action: PromotionAction) => action === "PROMOTE";
const disablesClass    = (action: PromotionAction) =>
  action === "DROPOUT" || action === "TRANSFERRED" || action === "GRADUATED";

// ── Step indicator ────────────────────────────────────────────────────────────

interface StepDotProps { num: number; label: string; active: boolean; done: boolean; }
function StepDot({ num, label, active, done }: StepDotProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
          done
            ? "bg-green-500 border-green-500 text-white"
            : active
            ? "bg-indigo-600 border-indigo-600 text-white"
            : "bg-white border-gray-200 text-gray-400"
        }`}
      >
        {done ? <CheckCircle2 size={14} /> : num}
      </div>
      <span className={`text-[10px] font-semibold uppercase tracking-wide ${active ? "text-indigo-600" : done ? "text-green-600" : "text-gray-400"}`}>
        {label}
      </span>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function AcademicYearSetupWizard() {
  const navigate = useNavigate();
  const { setStatus } = useCarryForwardStore();

  // ── Year step ──────────────────────────────────────────────────────────────
  const [years, setYears]               = useState<AcademicYearRecord[]>([]);
  const [yearsLoading, setYearsLoading] = useState(true);
  const [sourceYearId, setSourceYearId] = useState("");
  const [targetYearId, setTargetYearId] = useState("");

  // ── Module step ────────────────────────────────────────────────────────────
  const [modules, setModules]           = useState<Record<CarryForwardModule, boolean>>(DEFAULT_MODULES);
  const [includeStudentPromotion, setIncludeStudentPromotion] = useState(false);
  const [preview, setPreview]           = useState<CarryForwardPreviewItem[] | null>(null);
  const [previewing, setPreviewing]     = useState(false);
  const [executing, setExecuting]       = useState(false);
  const [cfError, setCfError]           = useState<string | null>(null);

  // ── Promotion step ─────────────────────────────────────────────────────────
  const [promoClasses,  setPromoClasses]  = useState<Option[]>([]);
  const [promoSections, setPromoSections] = useState<Option[]>([]);
  const [promoClassId,  setPromoClassId]  = useState("");
  const [promoSectionId,setPromoSectionId]= useState("");
  const [promoRows, setPromoRows] = useState<PromotionRow[]>([]);
  const [promoLoading,  setPromoLoading]  = useState(false);
  const [promoSaving,   setPromoSaving]   = useState(false);
  const [promoError,    setPromoError]    = useState<string | null>(null);
  const [promoSaved,    setPromoSaved]    = useState(0); // batches saved
  const [promoConfirm,  setPromoConfirm]  = useState(false);
  // Cache: targetClassId → sections[]
  const [sectionsCache, setSectionsCache] = useState<Record<string, Option[]>>({});
  // All target classes pre-loaded for "New Class" selects
  const [targetClasses, setTargetClasses] = useState<Option[]>([]);

  // ── Wizard step ────────────────────────────────────────────────────────────
  const [step, setStep] = useState<Step>("year");

  // ── Load years on mount ────────────────────────────────────────────────────
  // Target is always the newly created / active year; source is always the one
  // immediately before it — neither is user-selectable, so older years can
  // never be picked as the carry-forward source.
  useEffect(() => {
    getAllAcademicYears()
      .then((res) => {
        const list = res.data ?? [];
        setYears(list);
        const active = list.find((y) => y.isActive || y.active) ?? null;
        if (active) {
          setTargetYearId(active.id);
          const previous = getPreviousAcademicYear(list, active);
          if (previous) setSourceYearId(previous.id);
        }
      })
      .catch(() => {})
      .finally(() => setYearsLoading(false));
  }, []);

  // ── Safety net: this wizard only makes sense when a previous year exists ──
  // (the router guard already checks this before navigating here, but bail
  // out to the Dashboard too if this route is ever reached without one).
  useEffect(() => {
    if (yearsLoading) return;
    if (!targetYearId || !sourceYearId) {
      setStatus(true);
      navigate("/schooladmin/dashboard", { replace: true });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yearsLoading, targetYearId, sourceYearId]);

  // ── Load promotion classes when entering promotion step ────────────────────
  useEffect(() => {
    if (step !== "promotion") return;
    getAllClasses()
      .then((res) =>
        (res.data ?? []).map((c: { id: string; class_name: string }) => ({
          value: c.id,
          label: c.class_name,
        }))
      )
      .then((opts) => {
        setPromoClasses(opts);
        setTargetClasses(opts);
      })
      .catch(() => {});
  }, [step]);

  // ── Load source sections when promo class changes ──────────────────────────
  useEffect(() => {
    if (!promoClassId) { setPromoSections([]); setPromoSectionId(""); return; }
    getSectionsByClassIdFromApi(promoClassId)
      .then((res) => {
        const opts = (res.data ?? []).map((s) => ({
          value: s.id,
          label: s.sectionName ?? (s as { section_name?: string }).section_name ?? s.id,
        }));
        setPromoSections(opts);
      })
      .catch(() => setPromoSections([]));
  }, [promoClassId]);

  // ── Helpers ────────────────────────────────────────────────────────────────

  const activeModuleKeys = (Object.keys(modules) as CarryForwardModule[]).filter((k) => modules[k]);
  const studentsIncluded = includeStudentPromotion;

  const canPreview =
    !!sourceYearId &&
    !!targetYearId &&
    sourceYearId !== targetYearId &&
    activeModuleKeys.length > 0;

  const sourceName = years.find((y) => y.id === sourceYearId)?.yearName ?? "";
  const targetName = years.find((y) => y.id === targetYearId)?.yearName ?? "";

  // ── Preview ────────────────────────────────────────────────────────────────

  const handlePreview = async () => {
    if (!canPreview) return;
    setPreviewing(true);
    setPreview(null);
    setCfError(null);
    try {
      const res = await previewCarryForward({
        sourceAcademicYearId: sourceYearId,
        modules: activeModuleKeys,
      });
      setPreview(res.data ?? []);
    } catch (err: unknown) {
      setCfError(err instanceof Error ? err.message : "Preview failed.");
    } finally {
      setPreviewing(false);
    }
  };

  // ── Execute carry-forward ──────────────────────────────────────────────────

  const handleExecute = async () => {
    setExecuting(true);
    setCfError(null);
    try {
      const res = await carryForward({
        sourceAcademicYearId: sourceYearId,
        targetAcademicYearId: targetYearId,
        modules: activeModuleKeys,
      });
      if (res.status) {
        markCarryForwardCompleted(targetYearId, activeModuleKeys);
        if (studentsIncluded) {
          setStep("promotion");
        } else {
          setStatus(true);
          setStep("done");
        }
      } else {
        setCfError(res.message ?? "Carry forward failed.");
      }
    } catch (err: unknown) {
      setCfError(err instanceof Error ? err.message : "Carry forward failed.");
    } finally {
      setExecuting(false);
    }
  };

  // ── Load promotion students ────────────────────────────────────────────────

  const handleLoadStudents = async () => {
    if (!promoClassId || !promoSectionId) return;
    setPromoLoading(true);
    setPromoRows([]);
    setPromoError(null);
    try {
      const list = await getStudentsByClassSection(promoClassId, promoSectionId);
      setPromoRows(
        list.map((s) => ({ student: s, action: "PROMOTE" as PromotionAction, targetClassId: "", targetSectionId: "" }))
      );
    } catch (err: unknown) {
      setPromoError(err instanceof Error ? err.message : "Failed to load students.");
    } finally {
      setPromoLoading(false);
    }
  };

  // ── Update a single row's action ───────────────────────────────────────────

  const updateRow = (id: string, patch: Partial<PromotionRow>) => {
    setPromoRows((prev) =>
      prev.map((r) => (r.student.id === id ? { ...r, ...patch } : r))
    );
  };

  // ── Load sections into cache when a new target class is selected ───────────

  const ensureSectionsForClass = useCallback(
    async (classId: string) => {
      if (!classId || sectionsCache[classId]) return;
      try {
        const res = await getSectionsByClassIdFromApi(classId);
        const opts = (res.data ?? []).map((s) => ({
          value: s.id,
          label: s.sectionName ?? (s as { section_name?: string }).section_name ?? s.id,
        }));
        setSectionsCache((prev) => ({ ...prev, [classId]: opts }));
      } catch {
        setSectionsCache((prev) => ({ ...prev, [classId]: [] }));
      }
    },
    [sectionsCache]
  );

  // ── Bulk action ────────────────────────────────────────────────────────────

  const setAllAction = (action: PromotionAction) => {
    setPromoRows((prev) =>
      prev.map((r) => ({ ...r, action, targetClassId: "", targetSectionId: "" }))
    );
  };

  // ── Save promotion batch ───────────────────────────────────────────────────

  const handleSaveBatch = async () => {
    if (!sourceYearId || !targetYearId || promoRows.length === 0) return;
    setPromoConfirm(false);
    setPromoSaving(true);
    setPromoError(null);
    try {
      await promoteStudents({
        sourceAcademicYearId: sourceYearId,
        targetAcademicYearId: targetYearId,
        students: promoRows.map((r) => ({
          studentId: r.student.id,
          classId:   promoClassId,
          sectionId: promoSectionId,
          action:    r.action,
        })),
      });
      setPromoSaved((n) => n + 1);
      setPromoRows([]);
      setPromoSectionId("");
    } catch (err: unknown) {
      setPromoError(err instanceof Error ? err.message : "Failed to save promotions.");
    } finally {
      setPromoSaving(false);
    }
  };

  // ── Complete setup ─────────────────────────────────────────────────────────

  const handleCompleteSetup = () => {
    setStatus(true);
    setStep("done");
  };

  const currentClassName  = promoClasses.find((c) => c.value === promoClassId)?.label  ?? "";
  const currentSectionName = promoSections.find((s) => s.value === promoSectionId)?.label ?? "";

  // ── Step labels ────────────────────────────────────────────────────────────

  const stepIndex: Record<Step, number> = { year: 1, modules: 2, promotion: 3, done: 4 };
  const si = stepIndex[step];

  // ═══════════════════════════════════════════════════════════════════════════
  // Render
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex flex-col">

      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <GraduationCap size={18} className="text-white" />
          </div>
          <span className="text-base font-bold text-slate-900">
            Vidya<span className="text-indigo-600">Tracker</span>
          </span>
        </div>
        <span className="text-sm font-semibold text-gray-500">Academic Year Setup</span>
      </div>

      {/* ── Step indicator ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-center gap-3 py-6">
        <StepDot num={1} label="Years"     active={si === 1} done={si > 1} />
        <div className={`h-0.5 w-10 rounded-full transition-colors ${si > 1 ? "bg-green-400" : "bg-gray-200"}`} />
        <StepDot num={2} label="Modules"   active={si === 2} done={si > 2} />
        <div className={`h-0.5 w-10 rounded-full transition-colors ${si > 2 ? "bg-green-400" : "bg-gray-200"}`} />
        {studentsIncluded ? (
          <>
            <StepDot num={3} label="Promotion" active={si === 3} done={si > 3} />
            <div className={`h-0.5 w-10 rounded-full transition-colors ${si > 3 ? "bg-green-400" : "bg-gray-200"}`} />
            <StepDot num={4} label="Done"      active={si === 4} done={false} />
          </>
        ) : (
          <StepDot num={3} label="Done"      active={si === 4} done={false} />
        )}
      </div>

      {/* ── Content ─────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center px-4 pb-12">
        <div className="w-full max-w-2xl space-y-5">

          {/* ══════════════════════════ STEP 1: Year Selection ══════════════ */}
          {step === "year" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Select Academic Years</h2>
                <p className="text-sm text-gray-500 mt-1">
                  The previous academic year is carried forward into the new one automatically.
                </p>
              </div>

              {yearsLoading ? (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Loader2 size={14} className="animate-spin" /> Loading academic years…
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
                  <div className="flex-1 w-full">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                      From Year (Source)
                    </label>
                    <select
                      value={sourceYearId}
                      disabled
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-600 outline-none cursor-not-allowed"
                    >
                      {sourceYearId ? (
                        years.filter((y) => y.id === sourceYearId).map((y) => (
                          <option key={y.id} value={y.id}>{y.yearName}</option>
                        ))
                      ) : (
                        <option value="">No previous academic year</option>
                      )}
                    </select>
                  </div>

                  <div className="hidden sm:flex items-center pb-3">
                    <ArrowRight className="text-gray-400" size={18} />
                  </div>

                  <div className="flex-1 w-full">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                      To Year (Target)
                    </label>
                    <select
                      value={targetYearId}
                      disabled
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-600 outline-none cursor-not-allowed"
                    >
                      {targetYearId ? (
                        years.filter((y) => y.id === targetYearId).map((y) => (
                          <option key={y.id} value={y.id}>{y.yearName}{(y.isActive || y.active) ? " (Active)" : ""}</option>
                        ))
                      ) : (
                        <option value="">No academic year selected</option>
                      )}
                    </select>
                  </div>
                </div>
              )}

              {!yearsLoading && !sourceYearId && (
                <p className="text-xs text-red-500 flex items-center gap-1.5">
                  <AlertCircle size={12} /> No previous academic year found — nothing to carry forward from.
                </p>
              )}

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setStep("modules")}
                  disabled={!sourceYearId || !targetYearId}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next: Select Modules <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* ══════════════════════════ STEP 2: Modules + Preview + Execute ═ */}
          {step === "modules" && (
            <>
              {/* Year summary */}
              <div className="flex items-center gap-3 text-sm text-gray-600 bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3">
                <span className="font-semibold text-indigo-600">{sourceName}</span>
                <ArrowRight size={14} className="text-gray-400" />
                <span className="font-semibold text-indigo-600">{targetName}</span>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Select Modules to Carry Forward</h2>
                  <p className="text-sm text-gray-500 mt-1">Check every data type you want to copy into the new year.</p>
                </div>

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
                          setCfError(null);
                        }}
                        className="mt-0.5 h-4 w-4 accent-indigo-600 shrink-0"
                      />
                      <div>
                        <p className={`text-sm font-semibold ${modules[m.key] ? "text-indigo-700" : "text-gray-700"}`}>
                          {m.label}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{m.desc}</p>
                      </div>
                    </label>
                  ))}

                  {/* Student promotion — separate step, not a carry-forward module */}
                  <label
                    className={`flex items-start gap-3 rounded-xl border p-3.5 cursor-pointer transition select-none sm:col-span-2 ${
                      includeStudentPromotion
                        ? "border-purple-300 bg-purple-50"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={includeStudentPromotion}
                      onChange={(e) => setIncludeStudentPromotion(e.target.checked)}
                      className="mt-0.5 h-4 w-4 accent-purple-600 shrink-0"
                    />
                    <div>
                      <p className={`text-sm font-semibold ${includeStudentPromotion ? "text-purple-700" : "text-gray-700"}`}>
                        Students — Promote / Repeat / Dropout
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        After carry-forward, assign a promotion action to each student (adds Step 3 to this wizard)
                      </p>
                    </div>
                  </label>
                </div>

                {activeModuleKeys.length === 0 && (
                  <p className="text-xs text-amber-600 flex items-center gap-1.5">
                    <AlertCircle size={12} /> Select at least one module to continue.
                  </p>
                )}
              </div>

              {/* Preview section */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-gray-900">Preview Changes</h2>
                  <button
                    onClick={handlePreview}
                    disabled={!canPreview || previewing}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {previewing ? <Loader2 size={12} className="animate-spin" /> : <Eye size={12} />}
                    {previewing ? "Loading…" : "Preview"}
                  </button>
                </div>

                {!preview && !cfError && !previewing && (
                  <p className="text-xs text-gray-400">
                    Click Preview to see exactly what will be copied before committing.
                  </p>
                )}

                {cfError && (
                  <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 flex items-start gap-2">
                    <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-red-600">{cfError}</p>
                  </div>
                )}

                {preview !== null && (
                  preview.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-4">
                      No records found for the selected modules.
                    </p>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-gray-100">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Module</th>
                            <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-widest text-gray-400">Records to copy</th>
                          </tr>
                        </thead>
                        <tbody>
                          {preview.map((row, i) => (
                            <tr key={i} className="border-t border-gray-50 hover:bg-gray-50/60 transition">
                              <td className="px-4 py-3 font-medium text-gray-800 capitalize">{row.name}</td>
                              <td className="px-4 py-3 text-right font-bold text-indigo-600">{row.count}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                )}

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => setStep("year")}
                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleExecute}
                    disabled={!canPreview || executing}
                    className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-green-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {executing ? <Loader2 size={14} className="animate-spin" /> : <ChevronRight size={14} />}
                    {executing ? "Processing…" : "Carry Forward Now"}
                  </button>
                </div>

                <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-700">
                  Existing records in the target year for selected modules will be skipped to avoid duplicates.
                </div>
              </div>
            </>
          )}

          {/* ══════════════════════════ STEP 3: Student Promotion ═══════════ */}
          {step === "promotion" && (
            <>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-1">
                <h2 className="text-lg font-bold text-gray-900">Student Promotion</h2>
                <p className="text-sm text-gray-500">
                  Assign a promotion action to each student. Load one class/section at a time, save, then repeat.
                </p>
              </div>

              {promoSaved > 0 && (
                <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-3 flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-green-600 shrink-0" />
                  <span className="text-xs text-green-700 font-medium">
                    {promoSaved} batch{promoSaved > 1 ? "es" : ""} saved successfully. Load another class/section or complete setup.
                  </span>
                </div>
              )}

              {/* Filters */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Class</label>
                    <select
                      value={promoClassId}
                      onChange={(e) => { setPromoClassId(e.target.value); setPromoRows([]); }}
                      className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-indigo-500"
                    >
                      <option value="">Select class</option>
                      {promoClasses.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Section</label>
                    <select
                      value={promoSectionId}
                      onChange={(e) => { setPromoSectionId(e.target.value); setPromoRows([]); }}
                      disabled={!promoClassId}
                      className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-indigo-500 disabled:opacity-50"
                    >
                      <option value="">Select section</option>
                      {promoSections.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleLoadStudents}
                      disabled={!promoClassId || !promoSectionId || promoLoading}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {promoLoading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
                      {promoLoading ? "Loading…" : "Load Students"}
                    </button>
                  </div>
                </div>

                {promoError && (
                  <div className="mt-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3 flex items-start gap-2">
                    <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-red-600">{promoError}</p>
                  </div>
                )}
              </div>

              {/* Student table */}
              {promoRows.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  {/* Toolbar */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-indigo-500" />
                      <span className="text-sm font-semibold text-gray-700">
                        {promoRows.length} student{promoRows.length !== 1 ? "s" : ""} — {currentClassName} / {currentSectionName}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-gray-400 font-medium">Set all:</span>
                      {ACTION_OPTIONS.map((a) => (
                        <button
                          key={a.value}
                          onClick={() => setAllAction(a.value)}
                          className={`rounded-lg border px-2.5 py-0.5 text-[11px] font-bold transition hover:opacity-80 ${a.color}`}
                        >
                          {a.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                          <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Adm. No</th>
                          <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Student</th>
                          <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 hidden sm:table-cell">Current Class</th>
                          <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 hidden sm:table-cell">Section</th>
                          <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Action</th>
                          <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">New Class</th>
                          <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">New Section</th>
                        </tr>
                      </thead>
                      <tbody>
                        {promoRows.map((row) => (
                          <tr key={row.student.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition">
                            <td className="px-4 py-3 text-xs text-gray-500 font-mono">
                              {row.student.admission_number || "—"}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="h-7 w-7 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600 shrink-0">
                                  {row.student.first_name?.[0]?.toUpperCase() ?? "?"}
                                </div>
                                <span className="font-medium text-gray-800 text-sm">
                                  {row.student.first_name} {row.student.last_name}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600 hidden sm:table-cell">{currentClassName}</td>
                            <td className="px-4 py-3 text-sm text-gray-600 hidden sm:table-cell">{currentSectionName}</td>
                            <td className="px-4 py-3">
                              <select
                                value={row.action}
                                onChange={(e) => {
                                  const action = e.target.value as PromotionAction;
                                  updateRow(row.student.id, { action, targetClassId: "", targetSectionId: "" });
                                }}
                                className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold outline-none cursor-pointer transition ${actionColor(row.action)}`}
                              >
                                {ACTION_OPTIONS.map((a) => (
                                  <option key={a.value} value={a.value}>{a.label}</option>
                                ))}
                              </select>
                            </td>
                            <td className="px-4 py-3">
                              {needsClassSelect(row.action) ? (
                                <select
                                  value={row.targetClassId}
                                  onChange={(e) => {
                                    const cid = e.target.value;
                                    updateRow(row.student.id, { targetClassId: cid, targetSectionId: "" });
                                    ensureSectionsForClass(cid);
                                  }}
                                  className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs text-gray-800 outline-none focus:border-indigo-400 min-w-[110px]"
                                >
                                  <option value="">Select class</option>
                                  {targetClasses.map((c) => (
                                    <option key={c.value} value={c.value}>{c.label}</option>
                                  ))}
                                </select>
                              ) : (
                                <span className="text-xs text-gray-400 italic">
                                  {disablesClass(row.action) ? "N/A" : "Current"}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              {needsClassSelect(row.action) && row.targetClassId ? (
                                <select
                                  value={row.targetSectionId}
                                  onChange={(e) =>
                                    updateRow(row.student.id, { targetSectionId: e.target.value })
                                  }
                                  className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs text-gray-800 outline-none focus:border-indigo-400 min-w-[110px]"
                                >
                                  <option value="">Select section</option>
                                  {(sectionsCache[row.targetClassId] ?? []).map((s) => (
                                    <option key={s.value} value={s.value}>{s.label}</option>
                                  ))}
                                </select>
                              ) : (
                                <span className="text-xs text-gray-400 italic">
                                  {needsClassSelect(row.action) ? "Pick class first" : "N/A"}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between gap-4 px-5 py-4 border-t border-gray-100 bg-gray-50/50">
                    <div className="flex flex-wrap gap-3 text-xs font-semibold">
                      <span className="text-green-700">{promoRows.filter(r => r.action === "PROMOTE").length} Promote</span>
                      <span className="text-amber-600">{promoRows.filter(r => r.action === "REPEAT").length} Repeat</span>
                      <span className="text-red-600">{promoRows.filter(r => r.action === "DROPOUT").length} Dropout</span>
                      <span className="text-blue-600">{promoRows.filter(r => r.action === "TRANSFERRED").length} Transferred</span>
                      <span className="text-purple-600">{promoRows.filter(r => r.action === "GRADUATED").length} Graduated</span>
                    </div>
                    <button
                      onClick={() => setPromoConfirm(true)}
                      disabled={promoSaving || promoRows.length === 0}
                      className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-sm font-bold text-white hover:bg-indigo-700 transition disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                    >
                      {promoSaving ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                      {promoSaving ? "Saving…" : "Save This Batch"}
                    </button>
                  </div>
                </div>
              )}

              {/* Empty state */}
              {!promoLoading && promoRows.length === 0 && (
                <div className="bg-white rounded-2xl border border-dashed border-gray-200 shadow-sm flex flex-col items-center justify-center py-12 gap-3 text-center">
                  <Users size={32} className="text-gray-300" />
                  <p className="text-sm font-semibold text-gray-400">Select class and section, then click Load Students</p>
                </div>
              )}

              {/* Complete setup */}
              <div className="flex justify-end">
                <button
                  onClick={handleCompleteSetup}
                  className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-green-700 transition"
                >
                  <CheckCircle2 size={15} /> Complete Setup
                </button>
              </div>
            </>
          )}

          {/* ══════════════════════════ STEP 4: Done ════════════════════════ */}
          {step === "done" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 flex flex-col items-center text-center space-y-5">
              <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-green-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Setup Completed!</h2>
                <p className="text-sm text-gray-500 mt-2">
                  Data has been carried forward from{" "}
                  <span className="font-semibold text-indigo-600">{sourceName}</span> to{" "}
                  <span className="font-semibold text-indigo-600">{targetName}</span>.
                </p>
              </div>
              <button
                onClick={() => navigate("/schooladmin/dashboard", { replace: true })}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3 text-sm font-bold text-white hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
              >
                Go to Dashboard <ChevronRight size={15} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Promotion confirmation dialog ────────────────────────────────────── */}
      {promoConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Confirm Promotions</h3>
            <p className="text-sm text-gray-600">
              Save actions for <strong>{promoRows.length}</strong> student{promoRows.length !== 1 ? "s" : ""} in{" "}
              <span className="font-semibold text-indigo-600">{currentClassName} / {currentSectionName}</span>?
            </p>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-xl bg-green-50 border border-green-100 p-2">
                <p className="text-lg font-bold text-green-600">{promoRows.filter(r => r.action === "PROMOTE").length}</p>
                <p className="text-green-700">Promote</p>
              </div>
              <div className="rounded-xl bg-amber-50 border border-amber-100 p-2">
                <p className="text-lg font-bold text-amber-600">{promoRows.filter(r => r.action === "REPEAT").length}</p>
                <p className="text-amber-700">Repeat</p>
              </div>
              <div className="rounded-xl bg-red-50 border border-red-100 p-2">
                <p className="text-lg font-bold text-red-600">
                  {promoRows.filter(r => r.action === "DROPOUT" || r.action === "TRANSFERRED" || r.action === "GRADUATED").length}
                </p>
                <p className="text-red-700">Other</p>
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-1">
              <button
                onClick={() => setPromoConfirm(false)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveBatch}
                className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-bold text-white hover:bg-indigo-700 transition"
              >
                Confirm & Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
