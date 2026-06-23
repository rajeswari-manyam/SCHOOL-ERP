import { useState, useEffect } from "react";
import { X, Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useAcademicYears } from "@/components/common/hooks/useAcademicYears";
import { getAllClasses } from "@/services/class.api";
import { getAllStaff } from "@/services/staff.api";
import type { AddSectionPayload } from "../types/classes.types";

interface Props {
  onClose: () => void;
  onSubmit: (sections: AddSectionPayload[]) => Promise<void>;
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
const makeRow = (academicYearId = ""): SectionRow => ({
  id: `row_${++_rowId}`,
  sectionName: "",
  classId: "",
  academicYearId,
  totalStrength: "30",
  classTeacherId: "",
});

export const BulkAddSectionModal = ({ onClose, onSubmit }: Props) => {
  const { years, loading: yearsLoading } = useAcademicYears();
  const [rows, setRows] = useState<SectionRow[]>([makeRow()]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [classOptions, setClassOptions] = useState<Option[]>([]);
  const [teacherOptions, setTeacherOptions] = useState<Option[]>([]);

  useEffect(() => {
    getAllClasses().then((res) => {
      const opts = (res.data ?? []).map((c: any) => ({ value: c.id, label: c.class_name }));
      setClassOptions(opts);
    }).catch(() => {});
    getAllStaff({ role: "teacher" }).then((res) => {
      const list = Array.isArray(res.data) ? res.data : [];
      const opts = list.map((s: any) => ({ value: s.id, label: s.name ?? s.id }));
      setTeacherOptions(opts);
    }).catch(() => {});
  }, []);

  const addRow = () => {
    const last = rows[rows.length - 1];
    setRows((prev) => [...prev, makeRow(last.academicYearId)]);
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
      await onSubmit(
        valid.map((r) => ({
          sectionName: r.sectionName.trim(),
          classId: r.classId,
          academicYearId: r.academicYearId,
          totalStrength: Number(r.totalStrength) || 0,
          classTeacherId: r.classTeacherId,
        })),
      );
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create sections");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between px-4 sm:px-6 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900">Bulk Add Sections</h2>
            <p className="text-xs text-gray-400 mt-0.5">Add multiple sections at once</p>
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
              <Plus size={12} /> Add Row
            </button>
          </div>

          {/* Header labels */}
          <div className="hidden sm:grid sm:grid-cols-[1fr_1.2fr_1fr_1fr_auto] gap-3 text-[10px] font-bold uppercase tracking-wide text-gray-400 px-1">
            <span>Section Name</span>
            <span>Class</span>
            <span>Teacher</span>
            <span>Strength</span>
            <span className="w-10" />
          </div>

          {/* Rows */}
          {rows.map((row) => (
            <div key={row.id} className="grid grid-cols-2 sm:grid-cols-[1fr_1.2fr_1fr_1fr_auto] gap-2 sm:gap-3 items-start p-3 rounded-xl border border-gray-100 bg-white">
              <div className="space-y-1 col-span-2 sm:col-span-1">
                <Label className="sm:hidden text-[10px] text-gray-400">Section Name</Label>
                <Input
                  placeholder="e.g. A"
                  value={row.sectionName}
                  onChange={(e) => updateRow(row.id, "sectionName", e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="sm:hidden text-[10px] text-gray-400">Class</Label>
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
                  options={teacherOptions}
                  placeholder="Select teacher"
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

          {/* Academic year selector */}
          <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
            <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">Academic Year:</span>
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
          <Button type="button" onClick={onClose} variant="outline" className="w-full sm:w-auto">Cancel</Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={saving || rows.every((r) => !r.sectionName.trim())}
            className="w-full sm:w-auto bg-indigo-600 text-white"
          >
            {saving ? "Creating..." : `Create ${rows.filter((r) => r.sectionName.trim()).length} Section(s)`}
          </Button>
        </div>
      </div>
    </div>
  );
};
