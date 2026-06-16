import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import type { AcademicYear, CreateAcademicYearPayload, ClassSection, CreateClassPayload, Department } from "../types/settings.types";
import { CreateAcademicYearModal } from "./CreateAcademicYearModal";
import type { HolidayFromApi, CreateHolidayPayload, UpdateHolidayPayload } from "@/services/holidays.api";
import type { WorkingDayRecord, WorkingDayPayload } from "@/services/working-days.api";
import { getDepartmentById } from "@/services/department.api";
import type { DepartmentDetail } from "@/services/department.api";
import type { LeaveAllocation, CreateLeaveAllocationPayload } from "@/services/leave-allocation.api";
import { useAuthStore } from "@/store/authStore";

const ALL_WEEK_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

interface Props {
  classes: ClassSection[];
  academicYears: AcademicYear[];
  departments: Department[];
  departmentsSaving: boolean;
  workingDays: WorkingDayRecord[];
  workingDaysSaving: boolean;
  holidays: HolidayFromApi[];
  holidaysSaving: boolean;
  onAddClass: (data: CreateClassPayload) => void;
  onCreateAcademicYear: (data: CreateAcademicYearPayload) => Promise<AcademicYear>;
  onAddDepartment: (payload: { departmentName: string; academicYearId: string }) => Promise<void>;
  onEditDepartment: (id: string, departmentName: string) => Promise<void>;
  onDeleteDepartment: (id: string) => Promise<void>;
  onCreateWorkingDay: (payload: WorkingDayPayload) => Promise<void>;
  onUpdateWorkingDay: (id: string, payload: Partial<WorkingDayPayload>) => Promise<void>;
  onDeleteWorkingDay: (id: string) => Promise<void>;
  onCreateHoliday: (payload: CreateHolidayPayload) => Promise<void>;
  onUpdateHoliday: (id: string, payload: UpdateHolidayPayload) => Promise<void>;
  onDeleteHoliday: (id: string) => Promise<void>;
  leaveAllocations: LeaveAllocation[];
  leaveAllocationsSaving: boolean;
  onCreateLeaveAllocations: (payload: CreateLeaveAllocationPayload) => Promise<void>;
  onUpdateLeaveAllocation: (id: string, payload: { allocated_days?: number; leave_type?: string }) => Promise<void>;
  onDeleteLeaveAllocation: (id: string) => Promise<void>;
}

const DEFAULT_NEW_CLASS: CreateClassPayload = {
  class_name: "",
  section: "A",
  academic_year: String(new Date().getFullYear()) + "-" + String(new Date().getFullYear() + 1),
  class_teacher: "",
  capacity: 40,
  description: "",
  school_code: import.meta.env.VITE_SCHOOL_CODE ?? localStorage.getItem("schoolcode"),
};

const EMPTY_WD_FORM = {
  selected_days: [] as string[],
  start_time: "09:00",
  end_time: "16:00",
  no_of_periods: 7,
  duration_of_period: 45,
  academicYearId: "",
};

const HOLIDAY_TYPE_LABELS: Record<string, string> = {
  public: "Public",
  national: "National",
  school_event: "School Event",
  school_day: "School Day",
};

const HOLIDAY_TYPE_COLORS: Record<string, string> = {
  public: "bg-blue-100 text-blue-700",
  national: "bg-indigo-100 text-indigo-700",
  school_event: "bg-purple-100 text-purple-700",
  school_day: "bg-emerald-100 text-emerald-700",
};

const LEAVE_TYPES = [
  { value: "casual",    label: "Casual Leave",    color: "bg-blue-50 border-blue-200 text-blue-700" },
  { value: "sick",      label: "Sick Leave",      color: "bg-rose-50 border-rose-200 text-rose-700" },
  { value: "emergency", label: "Emergency Leave", color: "bg-amber-50 border-amber-200 text-amber-700" },
];

export const AcademicConfigTab: React.FC<Props> = ({
  classes, academicYears,
  departments, departmentsSaving,
  workingDays, workingDaysSaving,
  holidays, holidaysSaving,
  leaveAllocations, leaveAllocationsSaving,
  onAddClass, onCreateAcademicYear,
  onAddDepartment, onEditDepartment, onDeleteDepartment,
  onCreateWorkingDay, onUpdateWorkingDay, onDeleteWorkingDay,
  onCreateHoliday, onUpdateHoliday, onDeleteHoliday,
  onCreateLeaveAllocations, onUpdateLeaveAllocation, onDeleteLeaveAllocation,
}) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newClass, setNewClass] = useState<CreateClassPayload>(DEFAULT_NEW_CLASS);
  const [showCreateYear, setShowCreateYear] = useState(false);
  const [wdForm, setWdForm] = useState(EMPTY_WD_FORM);
  const [wdEditId, setWdEditId] = useState<string | null>(null);
  const [deptName, setDeptName] = useState("");
  const [deptYearId, setDeptYearId] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [holidayName, setHolidayName] = useState("");
  const [holidayDate, setHolidayDate] = useState("");
  const [holidayType, setHolidayType] = useState("public");
  const [holidayNote, setHolidayNote] = useState("");
  const [holidayYearId, setHolidayYearId] = useState("");
  const [holidayEditId, setHolidayEditId] = useState<string | null>(null);
  const [holidaySuccess, setHolidaySuccess] = useState("");
  const [holidayError, setHolidayError] = useState("");
  const [viewingDeptId, setViewingDeptId] = useState<string | null>(null);
  const [viewingDeptDetail, setViewingDeptDetail] = useState<DepartmentDetail | null>(null);
  const [viewingDeptLoading, setViewingDeptLoading] = useState(false);

  // Leave allocation state
  const [leaveYearId, setLeaveYearId] = useState("");
  const [leaveDays, setLeaveDays] = useState<Record<string, number>>({ casual: 12, sick: 10, emergency: 15 });
  const [leaveEditId, setLeaveEditId] = useState<string | null>(null);
  const [leaveEditDays, setLeaveEditDays] = useState<number>(0);
  const [leaveSuccess, setLeaveSuccess] = useState("");
  const [leaveError, setLeaveError] = useState("");

  const handleAddDept = async () => {
    if (!deptName.trim() || !deptYearId) return;
    await onAddDepartment({ departmentName: deptName.trim(), academicYearId: deptYearId });
    setDeptName("");
    setDeptYearId("");
  };

  const handleStartEdit = (dept: Department) => {
    setEditingId(dept.id);
    setEditingName(dept.departmentName);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editingName.trim()) return;
    await onEditDepartment(id, editingName.trim());
    setEditingId(null);
    setEditingName("");
  };

  const handleViewDept = async (id: string) => {
    if (viewingDeptId === id) { setViewingDeptId(null); setViewingDeptDetail(null); return; }
    setViewingDeptId(id);
    setViewingDeptDetail(null);
    setViewingDeptLoading(true);
    const detail = await getDepartmentById(id);
    setViewingDeptDetail(detail);
    setViewingDeptLoading(false);
  };

  const resetHolidayForm = () => {
    setHolidayName("");
    setHolidayDate("");
    setHolidayType("public");
    setHolidayNote("");
    setHolidayYearId("");
    setHolidayEditId(null);
  };

  const handleSaveHoliday = async () => {
    if (!holidayName.trim() || !holidayDate || !holidayYearId) return;
    setHolidayError("");
    const school_code =
      useAuthStore.getState().user?.schoolcode ??
      localStorage.getItem("schoolcode") ??
      "";
    try {
      if (holidayEditId) {
        await onUpdateHoliday(holidayEditId, {
          holidayname: holidayName.trim(),
          date: holidayDate,
          type: holidayType,
          note: holidayNote.trim(),
        });
      } else {
        await onCreateHoliday({
          holidayname: holidayName.trim(),
          date: holidayDate,
          type: holidayType,
          note: holidayNote.trim(),
          school_code,
          academicYearId: holidayYearId,
        });
        setHolidaySuccess("Holiday added!");
        setTimeout(() => setHolidaySuccess(""), 3000);
      }
      resetHolidayForm();
    } catch (err: any) {
      setHolidayError(err?.message ?? "Failed to save holiday. Please try again.");
      setTimeout(() => setHolidayError(""), 5000);
    }
  };

  const handleEditHoliday = (h: HolidayFromApi) => {
    setHolidayEditId(h.id);
    setHolidayName(h.holidayname);
    setHolidayDate(h.date);
    setHolidayType(h.type);
    setHolidayNote(h.note ?? "");
    setHolidayYearId(h.academicYearId ?? "");
  };

  const toggleDay = (day: string) => {
    setWdForm(prev => ({
      ...prev,
      selected_days: prev.selected_days.includes(day)
        ? prev.selected_days.filter(d => d !== day)
        : [...prev.selected_days, day],
    }));
  };

  const handleWdSave = async () => {
    if (!wdForm.academicYearId || wdForm.selected_days.length === 0) return;
    if (wdEditId) {
      await onUpdateWorkingDay(wdEditId, wdForm);
    } else {
      await onCreateWorkingDay(wdForm);
    }
    setWdForm(EMPTY_WD_FORM);
    setWdEditId(null);
  };

  const handleWdEdit = (record: WorkingDayRecord) => {
    setWdEditId(record.id);
    setWdForm({
      selected_days: record.selected_days,
      start_time: record.start_time,
      end_time: record.end_time,
      no_of_periods: record.no_of_periods,
      duration_of_period: record.duration_of_period,
      academicYearId: record.academicYearId,
    });
  };

  const handleAddClass = () => {
    onAddClass(newClass);
    setNewClass(DEFAULT_NEW_CLASS);
    setShowAdd(false);
  };

  const handleSaveLeaveAllocations = async () => {
    if (!leaveYearId) return;
    setLeaveError("");
    const school_code = useAuthStore.getState().user?.schoolcode ?? localStorage.getItem("schoolcode") ?? "";
    try {
      await onCreateLeaveAllocations({
        academicYearId: leaveYearId,
        school_code,
        allocations: LEAVE_TYPES.map(lt => ({ leave_type: lt.value, allocated_days: leaveDays[lt.value] ?? 0 })),
      });
      setLeaveSuccess("Allocations saved!");
      setTimeout(() => setLeaveSuccess(""), 3000);
      setLeaveYearId("");
    } catch (err: any) {
      setLeaveError(err?.message ?? "Failed to save allocations.");
      setTimeout(() => setLeaveError(""), 5000);
    }
  };

  const handleLeaveEdit = (alloc: LeaveAllocation) => {
    setLeaveEditId(alloc.id);
    setLeaveEditDays(alloc.allocated_days);
  };

  const handleLeaveEditSave = async (id: string) => {
    await onUpdateLeaveAllocation(id, { allocated_days: leaveEditDays });
    setLeaveEditId(null);
  };

  return (
    <div className="w-full space-y-4 sm:space-y-6">

      {/* ── Academic Year Configuration ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">
              Academic Year Configuration
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Manage the operational dates for the current academic session.
            </p>
          </div>
          <Button className="flex-shrink-0 rounded-lg text-sm font-medium active:scale-95 transition-all" size="sm">
            Save Changes
          </Button>
        </div>

        {/* Year badge + status */}
        <div className="flex items-center gap-3 mb-4 sm:mb-5 flex-wrap">
          {academicYears.length === 0 ? (
            <span className="text-sm text-gray-500">No academic year configured</span>
          ) : (academicYears.map((year) => (
            <div key={year.id} className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                year.active
                  ? "bg-indigo-100 text-indigo-700 ring-1 ring-indigo-300"
                  : "bg-gray-100 text-gray-600"
              }`}>
                {year.yearName}
              </span>
              {year.active && (
                <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" /> ACTIVE
                </span>
              )}
            </div>
          )))}
         
        </div>

        

        <Button
          variant="ghost"
          onClick={() => setShowCreateYear(true)}
          className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1 px-0"
        >
          <span className="text-lg leading-none">⊕</span> Create New Academic Year
        </Button>
      </div>

      {/* ── Department Configuration ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Department Configuration</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Add and manage departments</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Academic Year</label>
            <Select
              options={[
                { label: "Select academic year", value: "" },
                ...academicYears.map((y) => ({ label: y.yearName, value: y.id })),
              ]}
              value={deptYearId}
              onValueChange={setDeptYearId}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Department Name</label>
            <Input
              placeholder="e.g. Science, Mathematics"
              value={deptName}
              onChange={(e) => setDeptName(e.target.value)}
              inputSize="md"
              className="w-full"
            />
          </div>
          <div className="flex items-end">
            <Button
              onClick={handleAddDept}
              disabled={!deptName.trim() || !deptYearId || departmentsSaving}
              className="w-full rounded-lg text-sm font-medium active:scale-95 transition-all disabled:opacity-60"
              size="sm"
            >
              {departmentsSaving ? "Adding…" : "+ Add Department"}
            </Button>
          </div>
        </div>

        {departments.length > 0 && (
          <div className="border-t border-gray-100 pt-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department</TableHead>
                  <TableHead>Academic Year</TableHead>
                  <TableHead className="w-36 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departments.map((d) => {
                  const yearName = academicYears.find(y => y.id === d.academicYearId)?.yearName ?? d.academicYearId;
                  const isEditing = editingId === d.id;
                  return (
                    <TableRow key={d.id}>
                      <TableCell className="font-medium text-gray-800">
                        {isEditing ? (
                          <Input
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            inputSize="sm"
                            className="w-full"
                            autoFocus
                          />
                        ) : d.departmentName}
                      </TableCell>
                      <TableCell className="text-gray-500">{yearName}</TableCell>
                      <TableCell className="text-right space-x-3">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => handleSaveEdit(d.id)}
                              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="text-xs font-semibold text-gray-500 hover:text-gray-700 transition-colors"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleViewDept(d.id)}
                              className={`text-xs font-semibold transition-colors ${viewingDeptId === d.id ? "text-emerald-600 hover:text-emerald-800" : "text-emerald-500 hover:text-emerald-700"}`}
                            >
                              {viewingDeptId === d.id ? "Hide" : "View Staff"}
                            </button>
                            <button
                              onClick={() => handleStartEdit(d)}
                              className="text-xs font-semibold text-indigo-500 hover:text-indigo-700 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => onDeleteDepartment(d.id)}
                              className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}

        {/* ── Department staff panel ── */}
        {viewingDeptId && (
          <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50/40 p-4">
            {viewingDeptLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 animate-pulse flex-shrink-0" />
                    <div className="flex-1 space-y-1">
                      <div className="h-3 bg-emerald-100 rounded animate-pulse w-32" />
                      <div className="h-2.5 bg-emerald-100 rounded animate-pulse w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : viewingDeptDetail ? (
              <>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">{viewingDeptDetail.departmentName}</h3>
                    {viewingDeptDetail.academicYear && (
                      <span className="text-xs text-gray-500">{viewingDeptDetail.academicYear.yearName}</span>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    {viewingDeptDetail.staffs.length} staff member{viewingDeptDetail.staffs.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {viewingDeptDetail.staffs.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-3">No staff assigned to this department.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {viewingDeptDetail.staffs.map(s => (
                      <div key={s.id} className="bg-white rounded-lg border border-emerald-100 p-3 flex items-start gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm flex-shrink-0">
                          {s.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">{s.name}</p>
                          <p className="text-xs text-indigo-600 font-medium">{s.role}</p>
                          <p className="text-xs text-gray-400 truncate">{s.email}</p>
                          <p className="text-xs text-gray-400">{s.phone}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <p className="text-xs text-red-400 text-center py-2">Failed to load department details.</p>
            )}
          </div>
        )}
      </div>

      {/* ── Holiday Configuration ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Holiday Configuration</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              {holidayEditId ? "Edit holiday details below" : "Add and manage holidays in the school calendar"}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Academic Year</label>
            <Select
              options={[
                { label: "Select academic year", value: "" },
                ...academicYears.map(y => ({ label: y.yearName, value: y.id })),
              ]}
              value={holidayYearId}
              onValueChange={setHolidayYearId}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Holiday Name</label>
            <Input
              placeholder="e.g. Independence Day"
              value={holidayName}
              onChange={(e) => setHolidayName(e.target.value)}
              inputSize="md"
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Date</label>
            <Input
              type="date"
              value={holidayDate}
              onChange={(e) => setHolidayDate(e.target.value)}
              inputSize="md"
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Type</label>
            <Select
              options={[
                { label: "Public", value: "public" },
                { label: "National", value: "national" },
                { label: "School Event", value: "school_event" },
                { label: "School Day", value: "school_day" },
              ]}
              value={holidayType}
              onValueChange={setHolidayType}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Note</label>
            <Input
              placeholder="e.g. National Holiday"
              value={holidayNote}
              onChange={(e) => setHolidayNote(e.target.value)}
              inputSize="md"
              className="w-full"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 mb-5">
          <Button
            onClick={handleSaveHoliday}
            disabled={!holidayName.trim() || !holidayDate || !holidayYearId || holidaysSaving}
            className="rounded-lg text-sm font-medium active:scale-95 transition-all disabled:opacity-60"
            size="sm"
          >
            {holidaysSaving ? "Saving…" : holidayEditId ? "Update Holiday" : "+ Add Holiday"}
          </Button>
          {holidayEditId && (
            <Button
              variant="outline"
              size="sm"
              onClick={resetHolidayForm}
              className="rounded-lg text-sm"
            >
              Cancel
            </Button>
          )}
          {holidaySuccess && (
            <span className="text-sm text-green-600 font-medium">{holidaySuccess}</span>
          )}
          {holidayError && (
            <span className="text-sm text-red-500 font-medium">{holidayError}</span>
          )}
        </div>

        {/* Holidays list */}
        {holidays.length > 0 && (
          <div className="border border-gray-100 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Holiday Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Note</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {holidays.map(h => (
                  <TableRow key={h.id} className={holidayEditId === h.id ? "bg-indigo-50" : undefined}>
                    <TableCell className="font-medium text-gray-800">{h.holidayname}</TableCell>
                    <TableCell className="text-gray-600">
                      {new Date(h.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${HOLIDAY_TYPE_COLORS[h.type] ?? "bg-gray-100 text-gray-700"}`}>
                        {HOLIDAY_TYPE_LABELS[h.type] ?? h.type}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-500 text-sm">{h.note || "—"}</TableCell>
                    <TableCell className="text-right">
                      <button
                        onClick={() => handleEditHoliday(h)}
                        className="text-xs font-semibold text-indigo-500 hover:text-indigo-700 transition-colors mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDeleteHoliday(h.id)}
                        className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {holidays.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-4">No holidays added yet.</p>
        )}
      </div>

      {/* ── Working Days ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Working Days</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Configure school working schedule</p>
          </div>
          <Button
            onClick={handleWdSave}
            disabled={workingDaysSaving || !wdForm.academicYearId || wdForm.selected_days.length === 0}
            className="flex-shrink-0 rounded-lg text-sm font-medium active:scale-95 transition-all disabled:opacity-60"
            size="sm"
          >
            {workingDaysSaving ? "Saving…" : wdEditId ? "Update" : "Save"}
          </Button>
        </div>

        {/* Academic Year */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Academic Year</label>
          <Select
            options={[
              { label: "Select academic year", value: "" },
              ...academicYears.map(y => ({ label: y.yearName, value: y.id })),
            ]}
            value={wdForm.academicYearId}
            onValueChange={v => setWdForm(p => ({ ...p, academicYearId: v }))}
            className="w-full sm:w-64"
          />
        </div>

        {/* Day toggles */}
        <div className="mb-4 sm:mb-5">
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            Select Working Days
          </label>
          <div className="flex flex-wrap gap-2">
            {ALL_WEEK_DAYS.map((day) => {
              const active = wdForm.selected_days.includes(day);
              return (
                <Button
                  key={day}
                  variant={active ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleDay(day)}
                  className={`rounded-full text-xs sm:text-sm px-3 sm:px-4 active:scale-95 transition-all
                    ${active
                      ? "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700"
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                    }`}
                >
                  {day.slice(0, 3)}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Time / period fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {([
            { label: "Start Time",        key: "start_time",        type: "time"   },
            { label: "End Time",          key: "end_time",          type: "time"   },
            { label: "Period Duration (min)", key: "duration_of_period", type: "number" },
            { label: "Number of Periods", key: "no_of_periods",     type: "number" },
          ] as const).map(({ label, key, type }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{label}</label>
              <Input
                type={type}
                value={String(wdForm[key])}
                onChange={e => setWdForm(p => ({ ...p, [key]: type === "number" ? Number(e.target.value) : e.target.value }))}
                inputSize="md"
                className="w-full"
              />
            </div>
          ))}
        </div>

        {/* Existing records */}
        {workingDays.length > 0 && (
          <div className="border-t border-gray-100 mt-4 pt-3">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Saved Configurations</p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Academic Year</TableHead>
                  <TableHead>Days</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Periods</TableHead>
                  <TableHead className="w-28 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workingDays.map(w => (
                  <TableRow key={w.id}>
                    <TableCell className="text-sm text-gray-700">
                      {academicYears.find(y => y.id === w.academicYearId)?.yearName ?? w.academicYearId}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">{w.selected_days.map(d => d.slice(0, 3)).join(", ")}</TableCell>
                    <TableCell className="text-sm text-gray-600">{w.start_time} – {w.end_time}</TableCell>
                    <TableCell className="text-sm text-gray-600">{w.no_of_periods} × {w.duration_of_period}min</TableCell>
                    <TableCell className="text-right space-x-3">
                      <button onClick={() => handleWdEdit(w)} className="text-xs font-semibold text-indigo-500 hover:text-indigo-700 transition-colors">Edit</button>
                      <button onClick={() => onDeleteWorkingDay(w.id)} className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors">Delete</button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
      {/* ── Leave Allocation Configuration ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Leave Allocation</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Set annual leave days per type for an academic year
            </p>
          </div>
        </div>

        {/* Bulk create form */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Academic Year</label>
          <Select
            options={[
              { label: "Select academic year", value: "" },
              ...academicYears.map(y => ({ label: y.yearName, value: y.id })),
            ]}
            value={leaveYearId}
            onValueChange={setLeaveYearId}
            className="w-full sm:w-64"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          {LEAVE_TYPES.map(lt => (
            <div key={lt.value} className={`rounded-xl border p-4 ${lt.color}`}>
              <p className="text-xs font-bold uppercase tracking-wide mb-2">{lt.label}</p>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={0}
                  value={leaveDays[lt.value] ?? 0}
                  onChange={e => setLeaveDays(prev => ({ ...prev, [lt.value]: Number(e.target.value) }))}
                  inputSize="md"
                  className="w-full bg-white"
                />
                <span className="text-xs font-medium whitespace-nowrap">days</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 mb-5">
          <Button
            onClick={handleSaveLeaveAllocations}
            disabled={!leaveYearId || leaveAllocationsSaving}
            className="rounded-lg text-sm font-medium active:scale-95 transition-all disabled:opacity-60"
            size="sm"
          >
            {leaveAllocationsSaving ? "Saving…" : "Save Allocations"}
          </Button>
          {leaveSuccess && <span className="text-sm text-green-600 font-medium">{leaveSuccess}</span>}
          {leaveError   && <span className="text-sm text-red-500 font-medium">{leaveError}</span>}
        </div>

        {/* Existing allocations */}
        {leaveAllocations.length > 0 && (
          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Saved Allocations</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {leaveAllocations.map(a => {
                const lt = LEAVE_TYPES.find(l => l.value === a.leave_type);
                const yearName = academicYears.find(y => y.id === a.academicYearId)?.yearName ?? "—";
                return (
                  <div key={a.id} className={`rounded-xl border p-4 ${lt?.color ?? "bg-gray-50 border-gray-200 text-gray-700"}`}>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide">{lt?.label ?? a.leave_type}</p>
                        <p className="text-[11px] text-gray-500 mt-0.5">{yearName}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleLeaveEdit(a)}
                          className="text-[11px] font-semibold text-indigo-500 hover:text-indigo-700 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDeleteLeaveAllocation(a.id)}
                          className="text-[11px] font-semibold text-red-500 hover:text-red-700 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    {leaveEditId === a.id ? (
                      <div className="flex items-center gap-2 mt-2">
                        <Input
                          type="number"
                          min={0}
                          value={leaveEditDays}
                          onChange={e => setLeaveEditDays(Number(e.target.value))}
                          inputSize="sm"
                          className="w-20 bg-white"
                        />
                        <button onClick={() => handleLeaveEditSave(a.id)} className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800">Save</button>
                        <button onClick={() => setLeaveEditId(null)} className="text-[11px] font-semibold text-gray-500 hover:text-gray-700">Cancel</button>
                      </div>
                    ) : (
                      <p className="text-2xl font-extrabold mt-1">{a.allocated_days} <span className="text-sm font-medium">days</span></p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {leaveAllocations.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-3">No leave allocations configured yet.</p>
        )}
      </div>

      {showCreateYear && (
        <CreateAcademicYearModal
          onClose={() => setShowCreateYear(false)}
          onSubmit={onCreateAcademicYear}
        />
      )}
    </div>
  );
};