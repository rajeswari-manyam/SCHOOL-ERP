import { useState, useMemo, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { useAttendanceStore } from "../store";
import {
  useStaffList,
  useSubmitStaffAttendance,
  useCreateSingleStaffAttendance,
  useAllStaffAttendance,
  useUpdateStaffAttendance,
  useDeleteStaffAttendance,
} from "../hooks/useAttendance";
import type { StaffAttendanceStatus, CreateStaffAttendancePayload } from "../types/attendance.types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";

type DisplayStatus = StaffAttendanceStatus | "not_marked";

const STATUS_OPTIONS: { value: StaffAttendanceStatus; label: string; color: string }[] = [
  { value: "present", label: "Present",  color: "bg-emerald-100 text-emerald-800" },
  { value: "absent",  label: "Absent",   color: "bg-red-100 text-red-800"         },
  { value: "late",    label: "Late",     color: "bg-amber-100 text-amber-800"     },
  { value: "leave",   label: "On Leave", color: "bg-blue-100 text-blue-800"       },
  { value: "halfday", label: "Half Day", color: "bg-purple-100 text-purple-800"   },
];

const AVATAR_COLORS = [
  "bg-indigo-100 text-indigo-700", "bg-pink-100 text-pink-700",
  "bg-emerald-100 text-emerald-700", "bg-amber-100 text-amber-700",
  "bg-purple-100 text-purple-700", "bg-teal-100 text-teal-700",
  "bg-cyan-100 text-cyan-700", "bg-rose-100 text-rose-700",
  "bg-orange-100 text-orange-700", "bg-violet-100 text-violet-700",
  "bg-lime-100 text-lime-700", "bg-sky-100 text-sky-700",
  "bg-fuchsia-100 text-fuchsia-700", "bg-blue-100 text-blue-700",
];

interface StaffRow {
  staffId: string;
  name: string;
  initials: string;
  avatarColor: string;
  role: string;
  subject?: string;
  recordId?: string;            // set if already has attendance for the date
  currentStatus: DisplayStatus; // existing status from API
  selectedStatus: StaffAttendanceStatus; // what user has selected in UI
  isMarked: boolean;
}

const MarkStaffAttendanceModal = () => {
  const { showMarkStaffAttendanceModal, closeMarkStaffAttendance } = useAttendanceStore();

  const [date, setDate]     = useState(new Date().toISOString().slice(0, 10));
  const [rows, setRows]     = useState<StaffRow[]>([]);
  const [savingId, setSavingId] = useState<string | null>(null);

  const { data: staffData, isLoading: staffLoading, error: staffError } = useStaffList();
  const { data: allAttendanceData } = useAllStaffAttendance();

  const submitMutation     = useSubmitStaffAttendance();
  const singleMarkMutation = useCreateSingleStaffAttendance();
  const updateMutation     = useUpdateStaffAttendance();
  const deleteMutation     = useDeleteStaffAttendance();

  // Build attendance map for selected date: staffId → { recordId, status }
  const attendanceMap = useMemo(() => {
    const map = new Map<string, { recordId: string; status: StaffAttendanceStatus }>();
    if (allAttendanceData?.data) {
      for (const rec of allAttendanceData.data) {
        if (rec.date === date) {
          const s = rec.status as string;
          if (["present", "absent", "late", "leave", "halfday"].includes(s)) {
            map.set(rec.staff_id, { recordId: rec.id, status: s as StaffAttendanceStatus });
          }
        }
      }
    }
    return map;
  }, [allAttendanceData, date]);

  // Rebuild rows whenever staff or attendance map changes
  useEffect(() => {
    if (!staffData) return;
    const sorted = [...staffData].sort((a, b) => a.name.localeCompare(b.name));
    setRows(
      sorted.map((s, i) => {
        const att = attendanceMap.get(s.id);
        return {
          staffId:        s.id,
          name:           s.name,
          initials:       s.initials || s.name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase() || "NA",
          avatarColor:    AVATAR_COLORS[i % AVATAR_COLORS.length],
          role:           s.role,
          subject:        s.subjects?.[0],
          recordId:       att?.recordId,
          currentStatus:  att?.status ?? "not_marked",
          selectedStatus: att?.status ?? "present",
          isMarked:       !!att,
        };
      })
    );
  }, [staffData, attendanceMap]);

  const updateSelected = useCallback((staffId: string, status: StaffAttendanceStatus) => {
    setRows((prev) => prev.map((r) => r.staffId === staffId ? { ...r, selectedStatus: status } : r));
  }, []);

  const markAllUnmarked = useCallback((status: StaffAttendanceStatus) => {
    setRows((prev) => prev.map((r) => r.isMarked ? r : { ...r, selectedStatus: status }));
  }, []);

  // Update an already-marked row
  const handleUpdate = useCallback(async (row: StaffRow) => {
    if (!row.recordId) return;
    setSavingId(row.staffId);
    try {
      await updateMutation.mutateAsync({ id: row.recordId, payload: { status: row.selectedStatus } });
      toast.success(`Updated ${row.name}'s attendance to ${row.selectedStatus}`);
    } catch {
      toast.error(`Failed to update ${row.name}`);
    } finally {
      setSavingId(null);
    }
  }, [updateMutation]);

  // Delete an already-marked row
  const handleDelete = useCallback(async (row: StaffRow) => {
    if (!row.recordId) return;
    setSavingId(row.staffId);
    try {
      await deleteMutation.mutateAsync(row.recordId);
      toast.success(`Removed ${row.name}'s attendance record`);
    } catch {
      toast.error(`Failed to delete ${row.name}'s record`);
    } finally {
      setSavingId(null);
    }
  }, [deleteMutation]);

  // Mark a single not-yet-marked staff member (modal stays open)
  const handleMarkOne = useCallback((row: StaffRow) => {
    if (row.isMarked) return;
    setSavingId(row.staffId);
    const payload = {
      attendance_records: [{
        staff_id:    row.staffId,
        date,
        status:      row.selectedStatus as "present" | "absent" | "late" | "leave",
        working_day: true as const,
        remarks:     row.selectedStatus === "late" ? "Late arrival" : row.selectedStatus === "present" ? "On Time" : undefined,
      }],
    } satisfies CreateStaffAttendancePayload;

    singleMarkMutation.mutate(payload, {
      onSuccess: () => { toast.success(`Marked ${row.name} as ${row.selectedStatus}`); setSavingId(null); },
      onError:   (err: any) => { toast.error(err?.message ?? "Failed to mark"); setSavingId(null); },
    });
  }, [date, singleMarkMutation]);

  // Submit all not-yet-marked rows
  const handleSubmitNew = useCallback(() => {
    const unmarked = rows.filter((r) => !r.isMarked);
    if (!unmarked.length) { toast.info("All staff are already marked for this date"); return; }

    const payload = {
      attendance_records: unmarked.map((r) => ({
        staff_id:    r.staffId,
        date,
        status:      r.selectedStatus as "present" | "absent" | "late" | "leave",
        working_day: true as const,
        remarks:     r.selectedStatus === "late" ? "Late arrival" : r.selectedStatus === "present" ? "On Time" : undefined,
      })),
    } satisfies CreateStaffAttendancePayload;

    submitMutation.mutate(payload, {
      onSuccess: () => toast.success("Staff attendance submitted successfully"),
      onError:   (err: any) => toast.error(err?.message ?? "Failed to submit"),
    });
  }, [date, rows, submitMutation]);

  const summary = useMemo(() => ({
    total:      rows.length,
    marked:     rows.filter((r) => r.isMarked).length,
    notMarked:  rows.filter((r) => !r.isMarked).length,
  }), [rows]);

  if (!showMarkStaffAttendanceModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <Card className="w-full max-w-3xl mx-4 max-h-[90vh] flex flex-col overflow-hidden">

        {/* Header */}
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 border-b border-gray-100">
          <div>
            <CardTitle className="text-lg">Mark Staff Attendance</CardTitle>
            <CardDescription>
              <span className="text-emerald-600 font-semibold">{summary.marked} marked</span>
              {" · "}
              <span className="text-gray-400">{summary.notMarked} not marked</span>
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="h-10 w-10 rounded-full p-0 text-gray-400 hover:text-gray-600" onClick={closeMarkStaffAttendance}>
            <span className="text-2xl leading-none">&times;</span>
          </Button>
        </CardHeader>

        {/* Date + bulk actions */}
        <CardContent className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-4 flex-wrap">
            <div>
              <label className="uppercase tracking-wide text-xs text-gray-500">Date</label>
              <Input
                type="date"
                value={date}
                max={new Date().toISOString().split("T")[0]}
                onChange={(e) => setDate(e.target.value)}
                className="mt-2 w-48"
              />
            </div>
            <div className="flex-1" />
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => markAllUnmarked("present")} className="text-xs h-8">
                All Present
              </Button>
              <Button variant="outline" size="sm" onClick={() => markAllUnmarked("absent")} className="text-xs h-8">
                All Absent
              </Button>
            </div>
          </div>
        </CardContent>

        {/* Staff list */}
        <CardContent className="flex-1 overflow-y-auto min-h-[300px] p-0">
          {staffLoading ? (
            <div className="flex items-center justify-center h-40 gap-2 text-gray-500 text-sm">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Loading staff…
            </div>
          ) : staffError ? (
            <div className="flex items-center justify-center h-40 text-red-500 text-sm">
              Failed to load staff. Please try again.
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {/* Column headers */}
              <div className="flex items-center px-6 py-2 bg-gray-50 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                <span className="flex-1">Staff Member</span>
                <span className="w-64 text-center hidden sm:block">Status</span>
                <span className="w-24 text-right">Actions</span>
              </div>

              {rows.map((staff) => {
                const isSaving = savingId === staff.staffId;
                return (
                  <div key={staff.staffId} className={`flex items-center px-6 py-2.5 gap-3 hover:bg-gray-50 transition-colors ${isSaving ? "opacity-60 pointer-events-none" : ""}`}>

                    {/* Avatar + name */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${staff.avatarColor}`}>
                        {staff.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{staff.name}</p>
                        <p className="text-xs text-gray-400 truncate">
                          {staff.role}{staff.subject ? ` · ${staff.subject}` : ""}
                          {staff.isMarked && (
                            <span className="ml-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                              Marked
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Status buttons */}
                    <div className="flex items-center gap-1 flex-wrap justify-center">
                      {STATUS_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => updateSelected(staff.staffId, opt.value)}
                          className={[
                            "px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all",
                            staff.selectedStatus === opt.value
                              ? `${opt.color} ring-1 ring-current`
                              : "bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600",
                          ].join(" ")}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 shrink-0 w-28 justify-end">
                      {staff.isMarked ? (
                        <>
                          <button
                            onClick={() => handleUpdate(staff)}
                            disabled={isSaving}
                            className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-[11px] font-semibold hover:bg-indigo-700 transition-colors"
                          >
                            {isSaving ? "…" : "Update"}
                          </button>
                          <button
                            onClick={() => handleDelete(staff)}
                            disabled={isSaving}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                            title="Remove attendance"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleMarkOne(staff)}
                          disabled={isSaving}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50"
                        >
                          {isSaving ? "…" : "Mark"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>

        {/* Footer */}
        <CardFooter className="flex items-center justify-between gap-3 p-6 border-t border-gray-100">
          <p className="text-xs text-gray-400">{summary.notMarked} staff not yet marked</p>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={closeMarkStaffAttendance}>Cancel</Button>
            <Button
              onClick={handleSubmitNew}
              disabled={summary.notMarked === 0 || submitMutation.isPending}
            >
              {submitMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Submitting…
                </span>
              ) : (
                `Mark ${summary.notMarked} Staff`
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MarkStaffAttendanceModal;
