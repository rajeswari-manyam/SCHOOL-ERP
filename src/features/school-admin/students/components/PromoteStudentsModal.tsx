import { useState, useEffect, useCallback } from "react";
import {
  X, Loader2, Search, CheckCircle2, AlertCircle, Users,
} from "lucide-react";
import {
  getAllAcademicYears,
  promoteStudents,
  type AcademicYearRecord,
} from "@/services/academicYear.api";
import { getAllClasses } from "@/services/class.api";
import {
  getSectionsByClassIdFromApi,
  getStudentsByClassSection,
  type SectionStudent,
} from "@/services/section.api";

// ── Types ─────────────────────────────────────────────────────────────────────

type PromotionAction = "PROMOTE" | "REPEAT" | "DROPOUT" | "TRANSFERRED" | "GRADUATED";

interface Option { value: string; label: string; }

interface PromotionRow {
  student: SectionStudent;
  action: PromotionAction;
  targetClassId: string;
  targetSectionId: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const ACTION_OPTIONS: { value: PromotionAction; label: string; color: string }[] = [
  { value: "PROMOTE",     label: "Promote",     color: "text-green-700 bg-green-50 border-green-200"    },
  { value: "REPEAT",      label: "Repeat Year", color: "text-amber-700 bg-amber-50 border-amber-200"    },
  { value: "DROPOUT",     label: "Dropout",     color: "text-red-700 bg-red-50 border-red-200"          },
  { value: "TRANSFERRED", label: "Transferred", color: "text-blue-700 bg-blue-50 border-blue-200"       },
  { value: "GRADUATED",   label: "Graduated",   color: "text-purple-700 bg-purple-50 border-purple-200" },
];

function actionColor(action: PromotionAction) {
  return ACTION_OPTIONS.find((a) => a.value === action)?.color ?? "";
}

const needsClassSelect = (a: PromotionAction) => a === "PROMOTE";
const disablesClass    = (a: PromotionAction) =>
  a === "DROPOUT" || a === "TRANSFERRED" || a === "GRADUATED";

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  onClose: () => void;
}

export default function PromoteStudentsModal({ onClose }: Props) {
  const [years,    setYears]   = useState<AcademicYearRecord[]>([]);
  const [classes,  setClasses] = useState<Option[]>([]);
  const [sections, setSections] = useState<Option[]>([]);

  const [sourceYearId, setSourceYearId] = useState("");
  const [targetYearId, setTargetYearId] = useState("");
  const [classId,   setClassId]   = useState("");
  const [sectionId, setSectionId] = useState("");

  const [rows,      setRows]     = useState<PromotionRow[]>([]);
  const [loading,   setLoading]  = useState(false);
  const [saving,    setSaving]   = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const [error,     setError]    = useState<string | null>(null);

  // Cache: classId → sections[]
  const [targetClasses,  setTargetClasses]  = useState<Option[]>([]);
  const [sectionsCache,  setSectionsCache]  = useState<Record<string, Option[]>>({});

  // ── Load years + classes on mount ─────────────────────────────────────────
  useEffect(() => {
    Promise.all([
      getAllAcademicYears().then((r) => r.data ?? []).catch((): AcademicYearRecord[] => []),
      getAllClasses()
        .then((r) =>
          (r.data ?? []).map((c: { id: string; class_name: string }) => ({ value: c.id, label: c.class_name }))
        )
        .catch((): Option[] => []),
    ]).then(([y, c]) => {
      setYears(y);
      setClasses(c);
      setTargetClasses(c);
      const active = y.find((yr) => yr.isActive || yr.active);
      if (active) setSourceYearId(active.id);
    });
  }, []);

  // ── Load sections when source class changes ────────────────────────────────
  useEffect(() => {
    if (!classId) { setSections([]); setSectionId(""); return; }
    getSectionsByClassIdFromApi(classId)
      .then((res) => {
        setSections(
          (res.data ?? []).map((s) => ({
            value: s.id,
            label: s.sectionName ?? (s as { section_name?: string }).section_name ?? s.id,
          }))
        );
      })
      .catch(() => setSections([]));
  }, [classId]);

  const ensureSectionsForClass = useCallback(
    async (cid: string) => {
      if (!cid || sectionsCache[cid]) return;
      try {
        const res = await getSectionsByClassIdFromApi(cid);
        const opts = (res.data ?? []).map((s) => ({
          value: s.id,
          label: s.sectionName ?? (s as { section_name?: string }).section_name ?? s.id,
        }));
        setSectionsCache((prev) => ({ ...prev, [cid]: opts }));
      } catch {
        setSectionsCache((prev) => ({ ...prev, [cid]: [] }));
      }
    },
    [sectionsCache]
  );

  const handleLoad = async () => {
    if (!classId || !sectionId) return;
    setLoading(true);
    setRows([]);
    setError(null);
    try {
      const list = await getStudentsByClassSection(classId, sectionId);
      setRows(list.map((s) => ({ student: s, action: "PROMOTE" as PromotionAction, targetClassId: "", targetSectionId: "" })));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load students.");
    } finally {
      setLoading(false);
    }
  };

  const updateRow = (id: string, patch: Partial<PromotionRow>) =>
    setRows((prev) => prev.map((r) => (r.student.id === id ? { ...r, ...patch } : r)));

  const setAllAction = (action: PromotionAction) =>
    setRows((prev) => prev.map((r) => ({ ...r, action, targetClassId: "", targetSectionId: "" })));

  const handleSave = async () => {
    if (!sourceYearId || !targetYearId || rows.length === 0) return;
    setConfirming(false);
    setSaving(true);
    setError(null);
    try {
      await promoteStudents({
        sourceAcademicYearId: sourceYearId,
        targetAcademicYearId: targetYearId,
        students: rows.map((r) => ({
          studentId: r.student.id,
          classId:   classId,
          sectionId: sectionId,
          action:    r.action,
        })),
      });
      setSavedCount((n) => n + 1);
      setRows([]);
      setSectionId("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save promotions.");
    } finally {
      setSaving(false);
    }
  };

  const currentClassName   = classes.find((c) => c.value === classId)?.label ?? "";
  const currentSectionName = sections.find((s) => s.value === sectionId)?.label ?? "";
  const canSave = !!sourceYearId && !!targetYearId && sourceYearId !== targetYearId && rows.length > 0;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="text-base font-bold text-gray-900">Promote Students</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Assign promotion actions per student. Load one class/section at a time.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">

          {savedCount > 0 && (
            <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-3 flex items-center gap-2">
              <CheckCircle2 size={14} className="text-green-600 shrink-0" />
              <span className="text-xs text-green-700 font-medium">
                {savedCount} batch{savedCount > 1 ? "es" : ""} saved. Load another class/section to continue.
              </span>
            </div>
          )}

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 bg-gray-50/50 rounded-xl p-4 border border-gray-100">
            {/* Source Year */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">From Year</label>
              <select
                value={sourceYearId}
                onChange={(e) => setSourceYearId(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-indigo-500"
              >
                <option value="">Select year</option>
                {years.map((y) => (
                  <option key={y.id} value={y.id}>{y.yearName}{(y.isActive || y.active) ? " (Active)" : ""}</option>
                ))}
              </select>
            </div>

            {/* Target Year */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">To Year</label>
              <select
                value={targetYearId}
                onChange={(e) => setTargetYearId(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-indigo-500"
              >
                <option value="">Select year</option>
                {years.filter((y) => y.id !== sourceYearId).map((y) => (
                  <option key={y.id} value={y.id}>{y.yearName}{(y.isActive || y.active) ? " (Active)" : ""}</option>
                ))}
              </select>
            </div>

            {/* Class */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Class</label>
              <select
                value={classId}
                onChange={(e) => { setClassId(e.target.value); setRows([]); }}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-indigo-500"
              >
                <option value="">Select class</option>
                {classes.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>

            {/* Section */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Section</label>
              <select
                value={sectionId}
                onChange={(e) => { setSectionId(e.target.value); setRows([]); }}
                disabled={!classId}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-indigo-500 disabled:opacity-50"
              >
                <option value="">Select section</option>
                {sections.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>

            {/* Load */}
            <div className="flex items-end">
              <button
                onClick={handleLoad}
                disabled={!classId || !sectionId || loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 size={13} className="animate-spin" /> : <Search size={13} />}
                {loading ? "Loading…" : "Load"}
              </button>
            </div>
          </div>

          {sourceYearId && targetYearId && sourceYearId === targetYearId && (
            <p className="text-xs text-red-500 flex items-center gap-1.5">
              <AlertCircle size={12} /> From and To year must be different.
            </p>
          )}

          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 flex items-start gap-2">
              <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-xs text-red-600">{error}</p>
            </div>
          )}

          {/* Student table */}
          {rows.length > 0 && (
            <div className="rounded-2xl border border-gray-100 overflow-hidden">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-2">
                  <Users size={15} className="text-indigo-500" />
                  <span className="text-sm font-semibold text-gray-700">
                    {rows.length} student{rows.length !== 1 ? "s" : ""} — {currentClassName} / {currentSectionName}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs text-gray-400">Set all:</span>
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

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Adm. No</th>
                      <th className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Student Name</th>
                      <th className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 hidden sm:table-cell">Class</th>
                      <th className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 hidden sm:table-cell">Section</th>
                      <th className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Action</th>
                      <th className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">New Class</th>
                      <th className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">New Section</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.student.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition">
                        <td className="px-4 py-2.5 text-xs text-gray-500 font-mono">{row.student.admission_number || "—"}</td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600 shrink-0">
                              {row.student.first_name?.[0]?.toUpperCase() ?? "?"}
                            </div>
                            <span className="font-medium text-gray-800 text-sm">
                              {row.student.first_name} {row.student.last_name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-2.5 text-sm text-gray-500 hidden sm:table-cell">{currentClassName}</td>
                        <td className="px-4 py-2.5 text-sm text-gray-500 hidden sm:table-cell">{currentSectionName}</td>
                        <td className="px-4 py-2.5">
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
                        <td className="px-4 py-2.5">
                          {needsClassSelect(row.action) ? (
                            <select
                              value={row.targetClassId}
                              onChange={(e) => {
                                const cid = e.target.value;
                                updateRow(row.student.id, { targetClassId: cid, targetSectionId: "" });
                                ensureSectionsForClass(cid);
                              }}
                              className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs text-gray-800 outline-none focus:border-indigo-400 min-w-[100px]"
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
                        <td className="px-4 py-2.5">
                          {needsClassSelect(row.action) && row.targetClassId ? (
                            <select
                              value={row.targetSectionId}
                              onChange={(e) => updateRow(row.student.id, { targetSectionId: e.target.value })}
                              className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs text-gray-800 outline-none focus:border-indigo-400 min-w-[100px]"
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
            </div>
          )}

          {!loading && rows.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
              <Users size={32} className="text-gray-300" />
              <p className="text-sm text-gray-400">Select class and section, then click Load.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex-shrink-0">
          <div className="flex flex-wrap gap-3 text-xs font-semibold">
            <span className="text-green-700">{rows.filter(r => r.action === "PROMOTE").length} Promote</span>
            <span className="text-amber-600">{rows.filter(r => r.action === "REPEAT").length} Repeat</span>
            <span className="text-red-600">{rows.filter(r => r.action === "DROPOUT").length} Dropout</span>
            <span className="text-blue-600">{rows.filter(r => r.action === "TRANSFERRED").length} Transferred</span>
            <span className="text-purple-600">{rows.filter(r => r.action === "GRADUATED").length} Graduated</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onClose}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
            >
              Close
            </button>
            <button
              onClick={() => setConfirming(true)}
              disabled={!canSave || saving}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-sm font-bold text-white hover:bg-indigo-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
              {saving ? "Saving…" : "Save Promotions"}
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation dialog */}
      {confirming && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Confirm Promotions</h3>
            <p className="text-sm text-gray-600">
              Save actions for <strong>{rows.length}</strong> student{rows.length !== 1 ? "s" : ""} in{" "}
              <span className="font-semibold text-indigo-600">{currentClassName} / {currentSectionName}</span>?
            </p>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-xl bg-green-50 border border-green-100 p-2">
                <p className="text-lg font-bold text-green-600">{rows.filter(r => r.action === "PROMOTE").length}</p>
                <p className="text-green-700">Promote</p>
              </div>
              <div className="rounded-xl bg-amber-50 border border-amber-100 p-2">
                <p className="text-lg font-bold text-amber-600">{rows.filter(r => r.action === "REPEAT").length}</p>
                <p className="text-amber-700">Repeat</p>
              </div>
              <div className="rounded-xl bg-red-50 border border-red-100 p-2">
                <p className="text-lg font-bold text-red-600">
                  {rows.filter(r => r.action === "DROPOUT" || r.action === "TRANSFERRED" || r.action === "GRADUATED").length}
                </p>
                <p className="text-red-700">Other</p>
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-1">
              <button onClick={() => setConfirming(false)} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
                Cancel
              </button>
              <button onClick={handleSave} className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-bold text-white hover:bg-indigo-700 transition">
                Confirm & Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
