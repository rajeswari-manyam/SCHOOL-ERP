import { useState } from "react";
import { X, Plus, Trash2, Loader2 } from "lucide-react";
import { bulkAddHolidays } from "../../../../services/holidays.api";
import { useQueryClient } from "@tanstack/react-query";
import { attendanceKeys } from "../hooks/useAttendance";
import { useAcademicYears } from "../../../../components/common/hooks/useAcademicYears";
import { Input } from "../../../../components/ui/input";
import { Select } from "../../../../components/ui/select";
import { Button } from "../../../../components/ui/button";

const HOLIDAY_TYPES = [
  { label: "Public",     value: "public"     },
  { label: "Optional",   value: "optional"   },
  { label: "Restricted", value: "restricted" },
];

interface BulkRow {
  id: number;
  holidayname: string;
  from_date: string;
  to_date: string;
  type: string;
  note: string;
}

let _rid = 0;
const newRow = (): BulkRow => ({ id: ++_rid, holidayname: "", from_date: "", to_date: "", type: "public", note: "" });

// Native <input type="date"> only accepts min/max in exact "yyyy-mm-dd"
// form — the API's startDate/endDate may come back as a full ISO timestamp
// (e.g. "2025-06-01T00:00:00.000Z"), so slice down to the date portion.
const toDateInputValue = (value?: string | null): string | undefined =>
  value ? value.slice(0, 10) : undefined;

interface Props {
  onClose: () => void;
}

const BulkAddHolidayModal = ({ onClose }: Props) => {
  const queryClient = useQueryClient();
  const { activeYear, loading: yearsLoading } = useAcademicYears();
  const yearMin = toDateInputValue(activeYear?.startDate);
  const yearMax = toDateInputValue(activeYear?.endDate);
  const [rows, setRows] = useState<BulkRow[]>([newRow(), newRow(), newRow()]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const schoolCode = import.meta.env.VITE_SCHOOL_CODE || localStorage.getItem("schoolcode") || "";

  const updateRow = (id: number, field: keyof BulkRow, value: string) =>
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));

  const removeRow = (id: number) =>
    setRows(prev => prev.length > 1 ? prev.filter(r => r.id !== id) : prev);

  const validRows = rows.filter(r => r.holidayname.trim() && r.from_date && r.to_date);

  const handleSubmit = async () => {
    if (validRows.length === 0) { setError("Fill at least one holiday name and both dates."); return; }
    if (!schoolCode) { setError("School code not found. Please log in again."); return; }
    if (!activeYear?.id) { setError("Academic year not loaded. Please refresh the page."); return; }
    setError("");
    setSaving(true);
    try {
      const payload = validRows.map(r => ({
        holidayname: r.holidayname.trim(),
        from_date: r.from_date,
        to_date: r.to_date,
        type: r.type,
        note: r.note.trim() || r.type,
        school_code: schoolCode,
        academicYearId: activeYear.id,
      }));
      const res = await bulkAddHolidays(payload);
      queryClient.invalidateQueries({ queryKey: attendanceKeys.all, refetchType: "all" });
      setSuccess(`${res.count} holiday(s) added successfully.`);
      setTimeout(() => { onClose(); }, 1400);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Bulk add failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h3 className="text-base font-bold text-gray-900">Bulk Add Holidays</h3>
            <p className="text-xs text-gray-400 mt-0.5">Add multiple holidays at once</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Column headers */}
        <div className="px-5 pt-4 grid grid-cols-[2fr_1fr_1fr_1fr_1fr_32px] gap-2">
          {["Holiday Name", "From Date", "To Date", "Type", "Note", ""].map(h => (
            <span key={h} className="text-[10px] font-bold uppercase tracking-wide text-gray-400">{h}</span>
          ))}
        </div>

        {/* Rows */}
        <div className="px-5 py-3 space-y-2.5 overflow-y-auto flex-1">
          {rows.map((row, idx) => (
            <div key={row.id} className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_32px] gap-2 items-center">
              <Input
                placeholder={`e.g. Diwali`}
                value={row.holidayname}
                onChange={e => updateRow(row.id, "holidayname", e.target.value)}
                inputSize="sm"
              />
              <Input
                type="date"
                value={row.from_date}
                min={yearMin}
                max={yearMax}
                onChange={e => updateRow(row.id, "from_date", e.target.value)}
                inputSize="sm"
              />
              <Input
                type="date"
                value={row.to_date}
                min={row.from_date || yearMin}
                max={yearMax}
                onChange={e => updateRow(row.id, "to_date", e.target.value)}
                inputSize="sm"
              />
              <Select
                options={HOLIDAY_TYPES}
                value={row.type}
                onValueChange={val => updateRow(row.id, "type", val)}
                className="w-full"
              />
              <Input
                placeholder="Note"
                value={row.note}
                onChange={e => updateRow(row.id, "note", e.target.value)}
                inputSize="sm"
              />
              <button
                onClick={() => removeRow(row.id)}
                disabled={rows.length === 1}
                title={`Remove row ${idx + 1}`}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          <button
            onClick={() => setRows(prev => [...prev, newRow()])}
            className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors mt-1"
          >
            <Plus className="w-3.5 h-3.5" />
            Add another row
          </button>
        </div>

        {/* Feedback */}
        {error && (
          <div className="mx-5 mb-2 px-3 py-2 rounded-lg bg-red-50 border border-red-100 text-xs text-red-600">{error}</div>
        )}
        {success && (
          <div className="mx-5 mb-2 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-100 text-xs text-emerald-700 font-medium">{success}</div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-gray-100 shrink-0">
          <p className="text-xs text-gray-400">
            {validRows.length} of {rows.length} rows valid
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose} disabled={saving}>Cancel</Button>
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={saving || yearsLoading || validRows.length === 0}
              className="bg-indigo-600 text-white min-w-[120px]"
            >
              {saving || yearsLoading
                ? <span className="flex items-center gap-1.5"><Loader2 className="w-3.5 h-3.5 animate-spin" />{yearsLoading ? "Loading…" : "Saving…"}</span>
                : "Add Holidays"
              }
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkAddHolidayModal;
