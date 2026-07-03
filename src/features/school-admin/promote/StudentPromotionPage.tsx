import { useState, useEffect } from "react";
import {
  Loader2,
  Search,
  CheckCircle2,
  AlertCircle,
  Users,
  ArrowUp,
  RotateCcw,
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

type PromotionAction = "promote" | "repeat" | "dropout";

interface StudentRow {
  student: SectionStudent;
  action: PromotionAction;
}

interface Option {
  value: string;
  label: string;
}

const ACTION_OPTIONS: { value: PromotionAction; label: string; color: string }[] = [
  { value: "promote", label: "Promote Up",  color: "text-green-700 bg-green-50 border-green-200" },
  { value: "repeat",  label: "Repeat Year", color: "text-amber-700 bg-amber-50 border-amber-200" },
  { value: "dropout", label: "Dropout",     color: "text-red-700 bg-red-50 border-red-200" },
];

function actionStyle(action: PromotionAction): string {
  return ACTION_OPTIONS.find((a) => a.value === action)?.color ?? "";
}

export default function StudentPromotionPage() {
  const [years, setYears]         = useState<AcademicYearRecord[]>([]);
  const [classes, setClasses]     = useState<Option[]>([]);
  const [sections, setSections]   = useState<Option[]>([]);

  const [sourceYearId, setSourceYearId] = useState("");
  const [targetYearId, setTargetYearId] = useState("");
  const [classId, setClassId]           = useState("");
  const [sectionId, setSectionId]       = useState("");

  const [rows, setRows]       = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [done, setDone]       = useState<string | null>(null);
  const [error, setError]     = useState<string | null>(null);

  // Load years + classes on mount
  useEffect(() => {
    Promise.all([
      getAllAcademicYears().then((r) => r.data ?? []).catch((): AcademicYearRecord[] => []),
      getAllClasses()
        .then((r) =>
          (r.data ?? []).map((c: { id: string; class_name: string }) => ({
            value: c.id,
            label: c.class_name,
          })),
        )
        .catch((): Option[] => []),
    ]).then(([y, c]) => {
      setYears(y);
      setClasses(c);
      const active = y.find((yr) => yr.isActive || yr.active);
      if (active) setSourceYearId(active.id);
    });
  }, []);

  // Load sections when class changes
  useEffect(() => {
    if (!classId) {
      setSections([]);
      setSectionId("");
      return;
    }
    getSectionsByClassIdFromApi(classId)
      .then((res) => {
        const list = (res.data ?? []).map((s) => ({
          value: s.id,
          label: s.sectionName ?? (s as { section_name?: string }).section_name ?? s.id,
        }));
        setSections(list);
      })
      .catch(() => setSections([]));
  }, [classId]);

  const handleLoad = async () => {
    if (!classId || !sectionId) return;
    setLoading(true);
    setRows([]);
    setError(null);
    try {
      const list = await getStudentsByClassSection(classId, sectionId);
      setRows(list.map((s) => ({ student: s, action: "promote" })));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load students.");
    } finally {
      setLoading(false);
    }
  };

  const updateAction = (studentId: string, action: PromotionAction) => {
    setRows((prev) =>
      prev.map((r) => (r.student.id === studentId ? { ...r, action } : r)),
    );
  };

  const setAllAction = (action: PromotionAction) => {
    setRows((prev) => prev.map((r) => ({ ...r, action })));
  };

  const handleSave = async () => {
    if (!sourceYearId || !targetYearId || rows.length === 0) return;
    setConfirming(false);
    setSaving(true);
    setError(null);
    try {
      const res = await promoteStudents({
        sourceYearId,
        targetYearId,
        promotions: rows.map((r) => ({
          studentId: r.student.id,
          action: r.action,
        })),
      });
      setDone(
        res.message ??
          (res.status
            ? `${rows.length} student${rows.length !== 1 ? "s" : ""} processed successfully.`
            : "Promotion failed."),
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to process promotions.");
    } finally {
      setSaving(false);
    }
  };

  const promoted  = rows.filter((r) => r.action === "promote").length;
  const repeated  = rows.filter((r) => r.action === "repeat").length;
  const droppedOut = rows.filter((r) => r.action === "dropout").length;
  const canSave = !!sourceYearId && !!targetYearId && sourceYearId !== targetYearId && rows.length > 0;

  // ── Done state ──────────────────────────────────────────────────────────────
  if (done) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-5">
        <CheckCircle2 className="h-16 w-16 text-green-500" />
        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold text-gray-800">Promotions Saved</h2>
          <p className="text-sm text-gray-500">{done}</p>
        </div>
        <button
          onClick={() => {
            setDone(null);
            setRows([]);
            setError(null);
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition"
        >
          <RotateCcw size={14} /> Process Another Group
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Student Promotion</h1>
        <p className="mt-1 text-sm text-gray-500">
          Promote, hold back, or mark students as dropouts for the next academic year.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Source Year */}
          <div className="lg:col-span-1">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
              From Year
            </label>
            <select
              value={sourceYearId}
              onChange={(e) => setSourceYearId(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-indigo-500"
            >
              <option value="">Select year</option>
              {years.map((y) => (
                <option key={y.id} value={y.id}>
                  {y.yearName}{y.isActive || y.active ? " (Active)" : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Target Year */}
          <div className="lg:col-span-1">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
              To Year
            </label>
            <select
              value={targetYearId}
              onChange={(e) => setTargetYearId(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-indigo-500"
            >
              <option value="">Select year</option>
              {years
                .filter((y) => y.id !== sourceYearId)
                .map((y) => (
                  <option key={y.id} value={y.id}>
                    {y.yearName}{y.isActive || y.active ? " (Active)" : ""}
                  </option>
                ))}
            </select>
          </div>

          {/* Class */}
          <div className="lg:col-span-1">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
              Class
            </label>
            <select
              value={classId}
              onChange={(e) => { setClassId(e.target.value); setRows([]); }}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-indigo-500"
            >
              <option value="">Select class</option>
              {classes.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Section */}
          <div className="lg:col-span-1">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
              Section
            </label>
            <select
              value={sectionId}
              onChange={(e) => { setSectionId(e.target.value); setRows([]); }}
              disabled={!classId}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-indigo-500 disabled:opacity-50"
            >
              <option value="">Select section</option>
              {sections.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Load button */}
          <div className="flex items-end">
            <button
              onClick={handleLoad}
              disabled={!classId || !sectionId || loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Search size={14} />
              )}
              {loading ? "Loading…" : "Load Students"}
            </button>
          </div>
        </div>

        {sourceYearId && targetYearId && sourceYearId === targetYearId && (
          <p className="text-xs text-red-500 flex items-center gap-1.5 mt-3">
            <AlertCircle size={12} /> From and To year must be different.
          </p>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 flex items-start gap-2">
          <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      {/* Student table */}
      {rows.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Table toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-indigo-500" />
              <span className="text-sm font-semibold text-gray-700">
                {rows.length} Student{rows.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-medium">Set all:</span>
              {ACTION_OPTIONS.map((a) => (
                <button
                  key={a.value}
                  onClick={() => setAllAction(a.value)}
                  className={`rounded-lg border px-3 py-1 text-[11px] font-bold transition hover:opacity-80 ${a.color}`}
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
                  <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">#</th>
                  <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Student</th>
                  <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 hidden sm:table-cell">Roll No.</th>
                  <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 hidden md:table-cell">Admission No.</th>
                  <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr
                    key={row.student.id}
                    className="border-t border-gray-50 hover:bg-gray-50/50 transition"
                  >
                    <td className="px-5 py-3 text-xs text-gray-400 font-mono">{i + 1}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600 shrink-0">
                          {row.student.first_name?.[0]?.toUpperCase() ?? "?"}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">
                            {row.student.first_name} {row.student.last_name}
                          </p>
                          <p className="text-[11px] text-gray-400 sm:hidden">
                            Roll: {row.student.roll_number || "—"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-600 hidden sm:table-cell font-mono">
                      {row.student.roll_number || "—"}
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-600 hidden md:table-cell font-mono">
                      {row.student.admission_number || "—"}
                    </td>
                    <td className="px-5 py-3">
                      <select
                        value={row.action}
                        onChange={(e) =>
                          updateAction(row.student.id, e.target.value as PromotionAction)
                        }
                        className={`rounded-lg border px-3 py-1.5 text-xs font-semibold outline-none cursor-pointer transition ${actionStyle(row.action)}`}
                      >
                        {ACTION_OPTIONS.map((a) => (
                          <option key={a.value} value={a.value}>
                            {a.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary footer */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-5 py-4 border-t border-gray-100 bg-gray-50/50">
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="flex items-center gap-1.5 font-semibold text-green-700">
                <ArrowUp size={14} /> {promoted} Promote
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-amber-600">
                <RotateCcw size={14} /> {repeated} Repeat
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-red-600">
                <AlertCircle size={14} /> {droppedOut} Dropout
              </span>
            </div>
            <button
              onClick={() => setConfirming(true)}
              disabled={!canSave || saving}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 transition disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              {saving ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <CheckCircle2 size={14} />
              )}
              {saving ? "Saving…" : "Save Promotions"}
            </button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && rows.length === 0 && (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 shadow-sm flex flex-col items-center justify-center py-16 gap-3 text-center">
          <Users size={36} className="text-gray-300" />
          <p className="text-sm font-semibold text-gray-400">No students loaded</p>
          <p className="text-xs text-gray-300">
            Select a class and section above, then click Load Students.
          </p>
        </div>
      )}

      {/* Confirmation dialog */}
      {confirming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Confirm Promotions</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              You are about to process{" "}
              <strong>{rows.length} student{rows.length !== 1 ? "s" : ""}</strong>:
            </p>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl bg-green-50 border border-green-100 p-3">
                <p className="text-xl font-bold text-green-600">{promoted}</p>
                <p className="text-xs text-green-700 mt-0.5">Promote</p>
              </div>
              <div className="rounded-xl bg-amber-50 border border-amber-100 p-3">
                <p className="text-xl font-bold text-amber-600">{repeated}</p>
                <p className="text-xs text-amber-700 mt-0.5">Repeat</p>
              </div>
              <div className="rounded-xl bg-red-50 border border-red-100 p-3">
                <p className="text-xl font-bold text-red-600">{droppedOut}</p>
                <p className="text-xs text-red-700 mt-0.5">Dropout</p>
              </div>
            </div>
            <p className="text-xs text-gray-400">
              From:{" "}
              <span className="font-semibold text-gray-600">
                {years.find((y) => y.id === sourceYearId)?.yearName ?? sourceYearId}
              </span>{" "}
              → To:{" "}
              <span className="font-semibold text-gray-600">
                {years.find((y) => y.id === targetYearId)?.yearName ?? targetYearId}
              </span>
            </p>
            <div className="flex gap-3 justify-end pt-1">
              <button
                onClick={() => setConfirming(false)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
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
