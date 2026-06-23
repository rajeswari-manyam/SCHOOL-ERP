import { useState, useMemo, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useAttendanceStore } from "../store";
import { useStaffList, useSubmitStaffAttendance } from "../hooks/useAttendance";
import type { StaffAttendanceStatus, CreateStaffAttendancePayload } from "../types/attendance.types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";

const STATUS_OPTIONS: { value: StaffAttendanceStatus; label: string; color: string }[] = [
  { value: "present", label: "Present", color: "bg-emerald-100 text-emerald-800" },
  { value: "absent", label: "Absent", color: "bg-red-100 text-red-800" },
  { value: "late", label: "Late", color: "bg-amber-100 text-amber-800" },
  { value: "leave", label: "On Leave", color: "bg-blue-100 text-blue-800" },
];

const AVATAR_COLORS = [
  "bg-indigo-100 text-indigo-700",
  "bg-pink-100 text-pink-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-purple-100 text-purple-700",
  "bg-teal-100 text-teal-700",
  "bg-cyan-100 text-cyan-700",
  "bg-rose-100 text-rose-700",
  "bg-orange-100 text-orange-700",
  "bg-violet-100 text-violet-700",
  "bg-lime-100 text-lime-700",
  "bg-sky-100 text-sky-700",
  "bg-fuchsia-100 text-fuchsia-700",
  "bg-blue-100 text-blue-700",
];

interface StaffRow {
  staffId: string;
  name: string;
  initials: string;
  avatarColor: string;
  role: string;
  department: "teaching" | "non-teaching" | "admin";
  subject?: string;
  status: StaffAttendanceStatus;
}

const MarkStaffAttendanceModal = () => {
  const { showMarkStaffAttendanceModal, closeMarkStaffAttendance } = useAttendanceStore();

  const [rows, setRows] = useState<StaffRow[]>([]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const { data: staffData, isLoading: staffLoading, error: staffError } = useStaffList();

  useEffect(() => {
    if (staffData) {
      const sorted = [...staffData].sort((a, b) => a.name.localeCompare(b.name));
      setRows(
        sorted.map((s, i) => ({
          staffId: s.id,
          name: s.name,
          initials: s.initials || s.name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase() || "NA",
          avatarColor: AVATAR_COLORS[i % AVATAR_COLORS.length],
          role: s.role,
          department: s.isTeaching ? "teaching" : s.departmentName?.toLowerCase().includes("admin") ? "admin" : "non-teaching",
          subject: s.subjects?.[0],
          status: "present" as StaffAttendanceStatus,
        }))
      );
    }
  }, [staffData]);

  const updateStatus = useCallback((staffId: string, status: StaffAttendanceStatus) => {
    setRows((prev) => prev.map((s) => (s.staffId === staffId ? { ...s, status } : s)));
  }, []);

  const markAll = useCallback((status: StaffAttendanceStatus) => {
    setRows((prev) => prev.map((s) => ({ ...s, status })));
  }, []);

  const summary = useMemo(() => {
    const present = rows.filter((s) => s.status === "present").length;
    const absent = rows.filter((s) => s.status === "absent").length;
    const late = rows.filter((s) => s.status === "late").length;
    const leave = rows.filter((s) => s.status === "leave").length;
    return { present, absent, late, leave, total: rows.length };
  }, [rows]);

  const submitMutation = useSubmitStaffAttendance();

  const handleSubmit = useCallback(() => {
    if (!rows.length) return;

    const payload: CreateStaffAttendancePayload = {
      attendance_records: rows.map((s) => ({
        staff_id: s.staffId,
        date,
        status: s.status,
        working_day: true,
        remarks: s.status === "late" ? "Late arrival" : s.status === "present" ? "On Time" : undefined,
      })),
    };

    submitMutation.mutate(payload, {
      onSuccess: () => toast.success("Staff attendance submitted successfully"),
      onError: (err: any) => toast.error(err?.message ?? "Failed to submit staff attendance"),
    });
  }, [date, rows, submitMutation]);

  if (!showMarkStaffAttendanceModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <Card className="w-full max-w-3xl mx-4 max-h-[90vh] flex flex-col overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 border-b border-gray-100">
          <div>
            <CardTitle className="text-lg">Mark Staff Attendance</CardTitle>
            <CardDescription>Mark attendance for all staff members</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-10 w-10 rounded-full p-0 text-gray-400 hover:text-gray-600"
            onClick={closeMarkStaffAttendance}
          >
            <span className="text-2xl leading-none">&times;</span>
          </Button>
        </CardHeader>

        <CardContent className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div>
              <label htmlFor="staff-att-date" className="uppercase tracking-wide text-xs text-gray-500">
                Date
              </label>
              <Input
                id="staff-att-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-2 w-48"
              />
            </div>
            <div className="flex-1" />
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => markAll("present")} className="text-xs h-8">
                All Present
              </Button>
              <Button variant="outline" size="sm" onClick={() => markAll("absent")} className="text-xs h-8">
                All Absent
              </Button>
            </div>
          </div>
        </CardContent>

        <CardContent className="flex-1 overflow-y-auto min-h-[300px]">
          {staffLoading ? (
            <div className="flex items-center justify-center h-40">
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Loading staff…
              </div>
            </div>
          ) : staffError ? (
            <div className="flex items-center justify-center h-40 text-red-500 text-sm">
              Failed to load staff. Please try again.
            </div>
          ) : rows.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
              No staff members found.
            </div>
          ) : (
            <>
              <div className="px-6 py-3 border-b border-gray-100 -mx-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900">
                    {summary.total} Staff Members
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      {summary.present} Present
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      {summary.absent} Absent
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      {summary.late} Late
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-blue-400" />
                      {summary.leave} Leave
                    </span>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-gray-50 -mx-6">
                {rows.map((staff) => (
                  <div
                    key={staff.staffId}
                    className="flex items-center justify-between px-6 py-2.5 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${staff.avatarColor}`}>
                        {staff.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{staff.name}</p>
                        <p className="text-xs text-gray-400 truncate">
                          {staff.role}{staff.subject ? ` · ${staff.subject}` : ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {STATUS_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => updateStatus(staff.staffId, opt.value)}
                          className={[
                            "px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all",
                            staff.status === opt.value
                              ? `${opt.color} ring-1 ring-current`
                              : "bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600",
                          ].join(" ")}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 p-6 border-t border-gray-100">
          <Button variant="ghost" onClick={closeMarkStaffAttendance} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={rows.length === 0 || submitMutation.isPending}
            className="w-full sm:w-auto"
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
              "Submit Attendance"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MarkStaffAttendanceModal;
