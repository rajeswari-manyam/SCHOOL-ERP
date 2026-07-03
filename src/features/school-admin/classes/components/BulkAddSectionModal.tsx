import { useState, useEffect } from "react";
import { X, Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAcademicYears } from "@/components/common/hooks/useAcademicYears";
import { getAllClasses } from "@/services/class.api";
import { getAllStaff } from "@/services/staff.api";
import { getAllSections } from "@/services/section.api";
import type { AddSectionPayload, BulkAddSectionsResponse } from "../types/classes.types";

interface Props {
  classId?: string;
  onClose: () => void;
  onSubmit: (sections: AddSectionPayload[]) => Promise<BulkAddSectionsResponse | void>;
}

interface Option {
  value: string;
  label: string;
}

interface SectionRow {
  id: string;
  sectionName: string;
  classId: string;
  academicYearId: string;
  totalStrength: string;
  classTeacherId: string;
}

let _rowId = 0;
const makeRow = (academicYearId = "", classId = "", classTeacherId = ""): SectionRow => ({
  id: `row_${++_rowId}`,
  sectionName: "",
  classId,
  academicYearId,
  totalStrength: "30",
  classTeacherId,
});

export const BulkAddSectionModal = ({ classId: preselectedClassId = "", onClose, onSubmit }: Props) => {
  const { years, loading: yearsLoading } = useAcademicYears();
  const [rows, setRows] = useState<SectionRow[]>([makeRow("", preselectedClassId)]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [classOptions, setClassOptions] = useState<Option[]>([]);
  const [teacherOptions, setTeacherOptions] = useState<Option[]>([]);
  const [loadingTeachers, setLoadingTeachers] = useState(true);

  useEffect(() => {
    getAllClasses().then((res) => {
      const opts = (res.data ?? []).map((c: any) => ({ value: c.id, label: c.class_name }));
      setClassOptions(opts);
    }).catch(() => {});

    setLoadingTeachers(true);
    Promise.all([
      getAllStaff(),
      getAllSections().catch(() => []),
    ]).then(([staffRes, sections]) => {
      const list = Array.isArray(staffRes.data) ? staffRes.data : [];
      const usedIds = new Set<string>();
      for (const s of Array.isArray(sections) ? sections : []) {
        const tid = s.classTeacherId || s.class_teacher_id;
        if (tid) usedIds.add(tid);
      }
      for (const t of list) {
        if (t.class_teacher_of) usedIds.add(t.id);
      }
      const opts = list
        .filter((s: any) => !usedIds.has(s.id))
        .map((s: any) => ({ value: s.id, label: s.name ?? s.id }));
      setTeacherOptions(opts);
    }).catch(() => {}).finally(() => setLoadingTeachers(false));
  }, []);

  /* When academic years load, auto-select the active one for all rows */
  useEffect(() => {
    if (years.length === 0) return;
    const active = years.find((y) => y.active) ?? years[0];
    setRows((prev) => prev.map((r) => r.academicYearId ? r : { ...r, academicYearId: active.id }));
  }, [years]);

  const addRow = () => {
    const last = rows[rows.length - 1];
    setRows((prev) => [
      ...prev,
      makeRow(last.academicYearId, last.classId, last.classTeacherId),
    ]);
  };

  const removeRow = (id: string) => {
    if (rows.length <= 1) return;
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const updateRow = (id: string, field: keyof SectionRow, value: string) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const handleSubmit = async () => {
    const valid = rows.filter((r) => r.sectionName.trim() && r.classId && r.academicYearId);
    if (valid.length === 0) {
      setError("Please fill in at least one section with name, class, and academic year.");
      return;
    }
    setError(null);
    setSaving(true);
    try {
      const res = await onSubmit(
        valid.map((r) => ({
          sectionName: r.sectionName.trim(),
          classId: r.classId,
          academicYearId: r.academicYearId,
          totalStrength: Number(r.totalStrength) || 0,
          classTeacherId: r.classTeacherId,
        })),
      );
      if (res && typeof res === "object") {
        if (res.inserted > 0 && res.skipped === 0) {
          toast.success(`${res.inserted} section${res.inserted !== 1 ? "s" : ""} created successfully`);
        } else if (res.inserted > 0 && res.skipped > 0) {
          toast.success(`${res.inserted} created, ${res.skipped} skipped`);
          const reasons = res.skippedRecords?.map((r) => `${r.sectionName}: ${r.reason}`).join("\n");
          if (reasons) toast.warning(reasons, { duration: 6000 });
        } else if (res.skipped > 0) {
          toast.warning(`All ${res.skipped} section${res.skipped !== 1 ? "s" : ""} skipped — ${res.skippedRecords?.[0]?.reason ?? "already exists"}`);
        }
      } else {
        toast.success("Sections created successfully");
      }
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create sections");
    } finally {
      setSaving(false);
    }
  };

  const getAvailableTeacherOptions = (currentRowId: string) => {
    const selectedInOtherRows = new Set(
      rows
        .filter((r) => r.id !== currentRowId && r.classTeacherId)
        .map((r) => r.classTeacherId),
    );
    return teacherOptions.filter((opt) => !selectedInOtherRows.has(opt.value));
  };

  const validCount = rows.filter((r) => r.sectionName.trim() && r.classId && r.academicYearId).length;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full sm:max-w-3xl rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">

        {/* Header */}
        <div className="flex items-start justify-between px-4 sm:px-6 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900">Bulk Add Sections</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Teacher and class carry forward automatically when you add a row
            </p>
          </div>
          <Button onClick={onClose} variant="ghost" size="sm" className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 shrink-0">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="px-4 sm:px-6 py-4 space-y-3 overflow-y-auto flex-1">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-[11px] text-red-600 font-mono whitespace-pre-wrap break-all leading-relaxed">{error}</p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Sections ({rows.length})
            </p>
            <button
              type="button"
              onClick={addRow}
              className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 transition"
            >
              <Plus size={12} /> Add Section
            </button>
          </div>

          {/* Column headers */}
          <div className="hidden sm:grid sm:grid-cols-[1fr_1.2fr_1.4fr_0.7fr_auto] gap-3 text-[10px] font-bold uppercase tracking-wide text-gray-400 px-1">
            <span>Section Name <span className="text-red-500">*</span></span>
            <span>Class <span className="text-red-500">*</span></span>
            <span>Teacher {loadingTeachers && <Loader2 className="inline w-2.5 h-2.5 animate-spin ml-0.5" />}</span>
            <span>Strength</span>
            <span className="w-10" />
          </div>

          {/* Rows */}
          {rows.map((row, idx) => (
            <div key={row.id} className="grid grid-cols-2 sm:grid-cols-[1fr_1.2fr_1.4fr_0.7fr_auto] gap-2 sm:gap-3 items-start p-3 rounded-xl border border-gray-100 bg-white">
              <div className="space-y-1 col-span-2 sm:col-span-1">
                <Label className="sm:hidden text-[10px] text-gray-400">Section Name <span className="text-red-500">*</span></Label>
                <Input
                  placeholder="e.g. A"
                  value={row.sectionName}
                  autoFocus={idx === rows.length - 1 && idx > 0}
                  onChange={(e) => updateRow(row.id, "sectionName", e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <Label className="sm:hidden text-[10px] text-gray-400">Class <span className="text-red-500">*</span></Label>
                <Select
                  value={row.classId}
                  onValueChange={(value) => updateRow(row.id, "classId", value)}
                  options={classOptions}
                  placeholder="Select class"
                />
              </div>

              <div className="space-y-1">
                <Label className="sm:hidden text-[10px] text-gray-400">Teacher</Label>
                <Select
                  value={row.classTeacherId}
                  onValueChange={(value) => updateRow(row.id, "classTeacherId", value)}
                  options={getAvailableTeacherOptions(row.id)}
                  placeholder={loadingTeachers ? "Loading…" : "Select teacher"}
                />
              </div>

              <div className="space-y-1">
                <Label className="sm:hidden text-[10px] text-gray-400">Strength</Label>
                <Input
                  type="number"
                  min={0}
                  placeholder="30"
                  value={row.totalStrength}
                  onChange={(e) => updateRow(row.id, "totalStrength", e.target.value)}
                />
              </div>

              <div className="flex items-end sm:pb-0">
                <button
                  type="button"
                  onClick={() => removeRow(row.id)}
                  disabled={rows.length <= 1}
                  className="rounded-lg border border-red-100 bg-red-50 p-2 text-red-500 hover:bg-red-100 transition disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Remove"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}

          {/* Academic year — applied to all rows */}
          <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
            <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">Academic Year (all rows): <span className="text-red-500">*</span></span>
            {yearsLoading ? (
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Loader2 size={12} className="animate-spin" /> Loading...
              </div>
            ) : (
              <select
                value={rows[0]?.academicYearId ?? ""}
                onChange={(e) => {
                  const v = e.target.value;
                  setRows((prev) => prev.map((r) => ({ ...r, academicYearId: v })));
                }}
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-slate-700 outline-none focus:border-indigo-500"
              >
                <option value="">Select year</option>
                {years.map((y) => (
                  <option key={y.id} value={y.id}>
                    {y.active ? `${y.yearName} (Active)` : y.yearName}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 px-4 sm:px-6 py-4 border-t border-gray-100 shrink-0">
          <Button type="button" onClick={onClose} variant="outline" className="w-full sm:w-auto" disabled={saving}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={saving || validCount === 0}
            className="w-full sm:w-auto bg-indigo-600 text-white"
          >
            {saving ? <><Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />Creating…</> : `Create ${validCount} Section${validCount !== 1 ? "s" : ""}`}
          </Button>
        </div>
      </div>
    </div>
  );
};
