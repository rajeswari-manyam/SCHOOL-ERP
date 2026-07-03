import React, { useState, useEffect } from "react";
import { Plus, Trash2, X, Loader2, Pencil, Check } from "lucide-react";
import { getCarryForwardStatus } from "@/services/academicYear.api";
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

interface BulkDeptRow { id: number; departmentName: string; academicYearId: string; }

let _bulkRowId = 0;
const newRow = (yearId = ""): BulkDeptRow => ({ id: ++_bulkRowId, departmentName: "", academicYearId: yearId });

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
  onUpdateAcademicYear: (id: string, payload: { startDate?: string; endDate?: string; yearName?: string }) => Promise<void>;
  onDeleteAcademicYear: (id: string) => Promise<void>;
  onAddDepartment: (payload: { departmentName: string; academicYearId: string }) => Promise<void>;
  onBulkAddDepartments: (items: { departmentName: string; academicYearId: string }[]) => Promise<unknown>;
  onEditDepartment: (id: string, departmentName: string) => Promise<void>;
  onDeleteDepartment: (id: string) => Promise<void>;
  onCreateWorkingDay: (payload: WorkingDayPayload) => Promise<void>;
  onUpdateWorkingDay: (id: string, payload: Partial<WorkingDayPayload>) => Promise<void>;
  onDeleteWorkingDay: (id: string) => Promise<void>;
  onCreateHoliday: (payload: CreateHolidayPayload) => Promise<void>;
  onBulkAddHolidays: (items: CreateHolidayPayload[]) => Promise<unknown>;
  onUpdateHoliday: (id: string, payload: UpdateHolidayPayload) => Promise<void>;
  onDeleteHoliday: (id: string) => Promise<void>;
  leaveAllocations: LeaveAllocation[];
  leaveAllocationsSaving: boolean;
  onCreateLeaveAllocations: (payload: CreateLeaveAllocationPayload) => Promise<void>;
  onUpdateLeaveAllocation: (id: string, payload: { allocated_days?: number; leave_type?: string }) => Promise<void>;
  onDeleteLeaveAllocation: (id: string) => Promise<void>;
}


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
  academicYears,
  departments, departmentsSaving,
  workingDays, workingDaysSaving,
  holidays, holidaysSaving,
  leaveAllocations, leaveAllocationsSaving,
  onCreateAcademicYear, onUpdateAcademicYear, onDeleteAcademicYear,
  onAddDepartment, onBulkAddDepartments, onEditDepartment, onDeleteDepartment,
  onCreateWorkingDay, onUpdateWorkingDay, onDeleteWorkingDay,
  onCreateHoliday, onBulkAddHolidays, onUpdateHoliday, onDeleteHoliday,
  onCreateLeaveAllocations, onUpdateLeaveAllocation, onDeleteLeaveAllocation,
}) => {
  const [cfStatuses, setCfStatuses] = useState<Record<string, boolean>>({});

  useEffect(() => {
    getCarryForwardStatus()
      .then((res) => {
        if (res.yearStatuses) setCfStatuses(res.yearStatuses);
      })
      .catch(() => {});
  }, []);

  const [showCreateYear, setShowCreateYear] = useState(false);
  const [editYearId, setEditYearId] = useState<string | null>(null);
  const [editYearName, setEditYearName] = useState("");
  const [editYearStart, setEditYearStart] = useState("");
  const [editYearEnd, setEditYearEnd] = useState("");
  const [editYearSaving, setEditYearSaving] = useState(false);
  const [editYearError, setEditYearError] = useState("");
  const [deletingYearId, setDeletingYearId] = useState<string | null>(null);
  const [wdForm, setWdForm] = useState(EMPTY_WD_FORM);
  const [wdEditId, setWdEditId] = useState<string | null>(null);
  const [deptName, setDeptName] = useState("");
  const [deptYearId, setDeptYearId] = useState("");
  const [deptPage, setDeptPage] = useState(1);
  const DEPTS_PER_PAGE = 5;
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [holidayName, setHolidayName]         = useState("");
  const [holidayFromDate, setHolidayFromDate] = useState("");
  const [holidayToDate, setHolidayToDate]     = useState("");
  const [holidayType, setHolidayType]         = useState("public");
  const [holidayNote, setHolidayNote] = useState("");
  const [holidayYearId, setHolidayYearId] = useState("");
  const [holidayEditId, setHolidayEditId] = useState<string | null>(null);
  const [holidaySuccess, setHolidaySuccess] = useState("");
  const [holidayError, setHolidayError] = useState("");
  const [holidayPage, setHolidayPage] = useState(1);
  const HOLIDAYS_PER_PAGE = 5;
  const [viewingDeptId, setViewingDeptId] = useState<string | null>(null);
  const [viewingDeptDetail, setViewingDeptDetail] = useState<DepartmentDetail | null>(null);
  const [viewingDeptLoading, setViewingDeptLoading] = useState(false);

  // Bulk add state
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkRows, setBulkRows] = useState<BulkDeptRow[]>([newRow()]);
  const [bulkSaving, setBulkSaving] = useState(false);
  const [bulkError, setBulkError] = useState("");
  const [bulkSuccess, setBulkSuccess] = useState("");

  // Bulk add holiday state
  const [showBulkHolidayModal, setShowBulkHolidayModal] = useState(false);
  const [bulkHolidayRows, setBulkHolidayRows] = useState<{ id: number; holidayname: string; from_date: string; to_date: string; type: string; note: string }[]>([{ id: 1, holidayname: "", from_date: "", to_date: "", type: "public", note: "" }]);
  const [bulkHolidaySaving, setBulkHolidaySaving] = useState(false);
  const [bulkHolidayError, setBulkHolidayError] = useState("");
  const [bulkHolidaySuccess, setBulkHolidaySuccess] = useState("");
  let _hRowId = 1;
  const newHRow = () => ({ id: ++_hRowId, holidayname: "", from_date: "", to_date: "", type: "public", note: "" });

  // Leave allocation state
  const [leaveYearId, setLeaveYearId] = useState("");
  const [leaveDays, setLeaveDays] = useState<Record<string, number>>({ casual: 12, sick: 10, emergency: 15 });
  const [leaveEditId, setLeaveEditId] = useState<string | null>(null);
  const [leaveEditDays, setLeaveEditDays] = useState<number>(0);
  const [leaveSuccess, setLeaveSuccess] = useState("");
  const [leaveError, setLeaveError] = useState("");

  const openEditYear = (year: AcademicYear) => {
    setEditYearId(year.id);
    setEditYearName(year.yearName ?? "");
    setEditYearStart((year as any).startDate ?? "");
    setEditYearEnd((year as any).endDate ?? "");
    setEditYearError("");
  };

  const handleSaveYear = async () => {
    if (!editYearId) return;
    setEditYearSaving(true);
    setEditYearError("");
    try {
      await onUpdateAcademicYear(editYearId, {
        yearName:  editYearName.trim() || undefined,
        startDate: editYearStart || undefined,
        endDate:   editYearEnd   || undefined,
      });
      setEditYearId(null);
    } catch (err: unknown) {
      setEditYearError(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setEditYearSaving(false);
    }
  };

  const handleDeleteYear = async (id: string) => {
    if (!window.confirm("Delete this academic year? This cannot be undone.")) return;
    setDeletingYearId(id);
    try {
      await onDeleteAcademicYear(id);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete academic year");
    } finally {
      setDeletingYearId(null);
    }
  };

  const handleAddDept = async () => {
    if (!deptName.trim() || !deptYearId) return;
    await onAddDepartment({ departmentName: deptName.trim(), academicYearId: deptYearId });
    setDeptName("");
    setDeptYearId("");
  };

  const openBulkModal = () => {
    setBulkRows([newRow(deptYearId)]);
    setBulkError("");
    setBulkSuccess("");
    setShowBulkModal(true);
  };

  const handleBulkSubmit = async () => {
    const valid = bulkRows.filter(r => r.departmentName.trim() && r.academicYearId);
    if (valid.length === 0) { setBulkError("Add at least one department name and select an academic year."); return; }

    // Detect duplicate names within the submission
    const names = valid.map(r => r.departmentName.trim().toLowerCase());
    const duplicates = names.filter((n, i) => names.indexOf(n) !== i);
    if (duplicates.length > 0) {
      const dupeList = [...new Set(duplicates)].map(n =>
        valid.find(r => r.departmentName.trim().toLowerCase() === n)!.departmentName.trim()
      );
      setBulkError(`Duplicate department name(s): ${dupeList.join(", ")}. Each department must be unique.`);
      return;
    }

    setBulkError("");
    setBulkSaving(true);
    try {
      const result = await onBulkAddDepartments(
        valid.map(r => ({ departmentName: r.departmentName.trim(), academicYearId: r.academicYearId }))
      ) as { count?: number };
      setBulkSuccess(`${result?.count ?? valid.length} department(s) added successfully.`);
      setBulkRows([newRow()]);
      setTimeout(() => { setShowBulkModal(false); setBulkSuccess(""); }, 1500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Bulk add failed";
      setBulkError(msg.includes("500") || msg.toLowerCase().includes("internal")
        ? "A department with this name may already exist. Check for duplicates and try again."
        : msg);
    } finally {
      setBulkSaving(false);
    }
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
    setHolidayFromDate("");
    setHolidayToDate("");
    setHolidayType("public");
    setHolidayNote("");
    setHolidayYearId("");
    setHolidayEditId(null);
  };

  const handleSaveHoliday = async () => {
    if (!holidayName.trim() || !holidayFromDate || !holidayToDate || !holidayYearId) return;
    setHolidayError("");
    const school_code =
      useAuthStore.getState().user?.schoolcode ??
      localStorage.getItem("schoolcode") ??
      "";
    try {
      if (holidayEditId) {
        await onUpdateHoliday(holidayEditId, {
          holidayname: holidayName.trim(),
          from_date: holidayFromDate,
          to_date: holidayToDate,
          type: holidayType,
          note: holidayNote.trim(),
        });
      } else {
        await onCreateHoliday({
          holidayname: holidayName.trim(),
          from_date: holidayFromDate,
          to_date: holidayToDate,
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
    setHolidayFromDate(h.from_date ?? "");
    setHolidayToDate(h.to_date ?? "");
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
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">
              Academic Year Configuration
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Manage the operational dates for the current academic session.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCreateYear(true)}
            className="flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 rounded-lg"
          >
            <span className="text-base leading-none">+</span> New Academic Year
          </Button>
        </div>

        {/* Year list with Edit / Delete actions */}
        <div className="flex flex-col gap-2 mb-4 sm:mb-5">
          {academicYears.length === 0 ? (
            <span className="text-sm text-gray-500">No academic year configured</span>
          ) : academicYears.map((year) => (
            <div key={year.id} className="flex items-center gap-2 group">
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  year.active ? "bg-indigo-50 ring-1 ring-indigo-300" : "bg-gray-100"
                }`}
                style={{ color: '#3525CD' }}
              >
                {year.yearName}
              </span>
              {year.active && (
                <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Active
                </span>
              )}
              {/* Carry-forward status badge */}
              {year.id in cfStatuses ? (
                cfStatuses[year.id] ? (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    <Check className="w-3 h-3" /> Carry Forward Done
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                    Carry Forward Pending
                  </span>
                )
              ) : null}
              {/* Actions */}
              <button
                onClick={() => openEditYear(year)}
                title="Edit academic year"
                className="ml-1 p-1 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDeleteYear(year.id)}
                disabled={deletingYearId === year.id}
                title="Delete academic year"
                className="p-1 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
              >
                {deletingYearId === year.id
                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  : <Trash2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          ))}
        </div>

        {/* Edit Academic Year Modal */}
        {editYearId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-900">Edit Academic Year</h3>
                <button onClick={() => setEditYearId(null)} className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="px-5 py-4 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Year Name</label>
                  <input
                    value={editYearName}
                    onChange={(e) => setEditYearName(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                    placeholder="e.g. 2026-2027"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={editYearStart}
                    onChange={(e) => setEditYearStart(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">End Date</label>
                  <input
                    type="date"
                    value={editYearEnd}
                    onChange={(e) => setEditYearEnd(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                  />
                </div>
                {editYearError && (
                  <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{editYearError}</p>
                )}
              </div>
              <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100">
                <Button variant="outline" size="sm" onClick={() => setEditYearId(null)} disabled={editYearSaving}>Cancel</Button>
                <Button size="sm" onClick={handleSaveYear} disabled={editYearSaving} className="bg-indigo-600 text-white min-w-[90px]">
                  {editYearSaving ? <><Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />Saving…</> : <><Check className="w-3.5 h-3.5 mr-1" />Save</>}
                </Button>
              </div>
            </div>
          </div>
        )}

        

      </div>

      {/* ── Department Configuration ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Department Configuration</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Add and manage departments</p>
          </div>
          <button
            onClick={openBulkModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-600 text-xs font-semibold hover:bg-indigo-100 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Bulk Add
          </button>
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
              onValueChange={(v) => { setDeptYearId(v); setDeptPage(1); }}
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
                {(() => {
                  const filteredDepts = deptYearId
                    ? departments.filter((d) => d.academicYearId === deptYearId)
                    : departments;
                  const totalPages = Math.ceil(filteredDepts.length / DEPTS_PER_PAGE);
                  const safePage = Math.min(deptPage, totalPages || 1);
                  const pagedDepts = filteredDepts.slice((safePage - 1) * DEPTS_PER_PAGE, safePage * DEPTS_PER_PAGE);
                  return (
                    <>
                      {filteredDepts.length === 0 && deptYearId ? (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center text-xs text-gray-400 py-4">
                            No departments found for this academic year.
                          </TableCell>
                        </TableRow>
                      ) : null}
                      {pagedDepts.map((d) => {
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
                      {totalPages > 1 && (
                        <TableRow>
                          <TableCell colSpan={3} className="px-0 py-0">
                            <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50/60 border-t border-gray-100">
                              <span className="text-xs text-gray-400">
                                {(safePage - 1) * DEPTS_PER_PAGE + 1}–{Math.min(safePage * DEPTS_PER_PAGE, filteredDepts.length)} of {filteredDepts.length} departments
                              </span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => setDeptPage(p => Math.max(1, p - 1))}
                                  disabled={safePage === 1}
                                  className="px-2.5 py-1 rounded-md text-xs font-semibold text-gray-600 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                >
                                  ‹ Prev
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pg => (
                                  <button
                                    key={pg}
                                    onClick={() => setDeptPage(pg)}
                                    className={`w-7 h-7 rounded-md text-xs font-semibold transition-colors ${
                                      pg === safePage ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-200"
                                    }`}
                                  >
                                    {pg}
                                  </button>
                                ))}
                                <button
                                  onClick={() => setDeptPage(p => Math.min(totalPages, p + 1))}
                                  disabled={safePage === totalPages}
                                  className="px-2.5 py-1 rounded-md text-xs font-semibold text-gray-600 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                >
                                  Next ›
                                </button>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  );
                })()}
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

      {/* ── Bulk Add Departments Modal ── */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">Bulk Add Departments</h3>
                <p className="text-xs text-gray-400 mt-0.5">Add multiple departments at once</p>
              </div>
              <button
                onClick={() => setShowBulkModal(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Rows */}
            <div className="px-5 py-4 space-y-2.5 max-h-[50vh] overflow-y-auto">
              {/* Column headers */}
              <div className="grid grid-cols-[1fr_1fr_32px] gap-2 px-1">
                <span className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Department Name</span>
                <span className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Academic Year</span>
                <span />
              </div>

              {bulkRows.map((row, idx) => (
                <div key={row.id} className="grid grid-cols-[1fr_1fr_32px] gap-2 items-center">
                  <Input
                    placeholder="e.g. Mathematics"
                    value={row.departmentName}
                    onChange={(e) => setBulkRows(prev => prev.map(r => r.id === row.id ? { ...r, departmentName: e.target.value } : r))}
                    inputSize="sm"
                    className="w-full"
                  />
                  <Select
                    options={[
                      { label: "Select year", value: "" },
                      ...academicYears.map(y => ({ label: y.yearName, value: y.id })),
                    ]}
                    value={row.academicYearId}
                    onValueChange={(val) => setBulkRows(prev => prev.map(r => r.id === row.id ? { ...r, academicYearId: val } : r))}
                    className="w-full"
                  />
                  <button
                    onClick={() => setBulkRows(prev => prev.length > 1 ? prev.filter(r => r.id !== row.id) : prev)}
                    disabled={bulkRows.length === 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title={`Remove row ${idx + 1}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              <button
                onClick={() => setBulkRows(prev => [...prev, newRow(prev[prev.length - 1]?.academicYearId ?? "")])}
                className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors mt-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Department
              </button>
            </div>

            {/* Feedback */}
            {bulkError && (
              <div className="mx-5 mb-2 px-3 py-2 rounded-lg bg-red-50 border border-red-100 text-xs text-red-600">{bulkError}</div>
            )}
            {bulkSuccess && (
              <div className="mx-5 mb-2 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-100 text-xs text-emerald-700 font-medium">{bulkSuccess}</div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                {bulkRows.filter(r => r.departmentName.trim() && r.academicYearId).length} of {bulkRows.length} rows valid
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowBulkModal(false)} disabled={bulkSaving}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleBulkSubmit}
                  disabled={bulkSaving || bulkRows.every(r => !r.departmentName.trim() || !r.academicYearId)}
                  className="bg-indigo-600 text-white min-w-[100px]"
                >
                  {bulkSaving ? (
                    <span className="flex items-center gap-1.5"><Loader2 className="w-3.5 h-3.5 animate-spin" />Saving…</span>
                  ) : "Add Departments"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Holiday Configuration ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Holiday Configuration</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              {holidayEditId ? "Edit holiday details below" : "Add and manage holidays in the school calendar"}
            </p>
          </div>
          {!holidayEditId && (
            <button
              onClick={() => { setBulkHolidayRows([newHRow(), newHRow(), newHRow()]); setBulkHolidayError(""); setBulkHolidaySuccess(""); setShowBulkHolidayModal(true); }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-600 text-xs font-semibold hover:bg-indigo-100 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Bulk Add
            </button>
          )}
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
              onValueChange={(v) => { setHolidayYearId(v); setHolidayPage(1); }}
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
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">From Date</label>
            <Input
              type="date"
              value={holidayFromDate}
              onChange={(e) => setHolidayFromDate(e.target.value)}
              inputSize="md"
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">To Date</label>
            <Input
              type="date"
              value={holidayToDate}
              min={holidayFromDate}
              onChange={(e) => setHolidayToDate(e.target.value)}
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
            disabled={!holidayName.trim() || !holidayFromDate || !holidayToDate || !holidayYearId || holidaysSaving}
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
        {holidays.length > 0 && (() => {
          const filteredHolidays = holidayYearId
            ? holidays.filter(h => h.academicYearId === holidayYearId)
            : holidays;
          const totalPages = Math.ceil(filteredHolidays.length / HOLIDAYS_PER_PAGE);
          const safePage = Math.min(holidayPage, totalPages || 1);
          const pagedHolidays = filteredHolidays.slice((safePage - 1) * HOLIDAYS_PER_PAGE, safePage * HOLIDAYS_PER_PAGE);
          return (
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
                  {filteredHolidays.length === 0 && holidayYearId ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-xs text-gray-400 py-4">
                        No holidays found for this academic year.
                      </TableCell>
                    </TableRow>
                  ) : null}
                  {pagedHolidays.map(h => (
                    <TableRow key={h.id} className={holidayEditId === h.id ? "bg-indigo-50" : undefined}>
                      <TableCell className="font-medium text-gray-800">{h.holidayname}</TableCell>
                      <TableCell className="text-gray-600">
                        {new Date(h.from_date ?? h.date ?? "").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        {h.to_date && h.to_date !== h.from_date && (
                          <> – {new Date(h.to_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</>
                        )}
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
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-100 bg-gray-50/60">
                  <span className="text-xs text-gray-400">
                    {(safePage - 1) * HOLIDAYS_PER_PAGE + 1}–{Math.min(safePage * HOLIDAYS_PER_PAGE, filteredHolidays.length)} of {filteredHolidays.length} holidays
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setHolidayPage(p => Math.max(1, p - 1))}
                      disabled={safePage === 1}
                      className="px-2.5 py-1 rounded-md text-xs font-semibold text-gray-600 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      ‹ Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pg => (
                      <button
                        key={pg}
                        onClick={() => setHolidayPage(pg)}
                        className={`w-7 h-7 rounded-md text-xs font-semibold transition-colors ${
                          pg === safePage
                            ? "bg-indigo-600 text-white"
                            : "text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {pg}
                      </button>
                    ))}
                    <button
                      onClick={() => setHolidayPage(p => Math.min(totalPages, p + 1))}
                      disabled={safePage === totalPages}
                      className="px-2.5 py-1 rounded-md text-xs font-semibold text-gray-600 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Next ›
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

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
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`rounded-full text-xs sm:text-sm px-4 sm:px-5 py-1.5 sm:py-2 font-semibold border active:scale-95 transition-all duration-150 select-none
                    ${active
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-300 scale-105"
                      : "bg-white text-gray-400 border-gray-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300"
                    }`}
                >
                  {day.slice(0, 3)}
                </button>
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
      {/* ── Bulk Add Holidays Modal ── */}
      {showBulkHolidayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
              <div>
                <h3 className="text-base font-bold text-gray-900">Bulk Add Holidays</h3>
                <p className="text-xs text-gray-400 mt-0.5">Add multiple holidays at once</p>
              </div>
              <button onClick={() => setShowBulkHolidayModal(false)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-5 pt-4 grid grid-cols-[2fr_1fr_1fr_1fr_1fr_32px] gap-2 shrink-0">
              {["Holiday Name", "From Date", "To Date", "Type", "Note", ""].map(h => (
                <span key={h} className="text-[10px] font-bold uppercase tracking-wide text-gray-400">{h}</span>
              ))}
            </div>

            <div className="px-5 py-3 space-y-2.5 overflow-y-auto flex-1">
              {bulkHolidayRows.map((row, idx) => (
                <div key={row.id} className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_32px] gap-2 items-center">
                  <Input
                    placeholder="e.g. Diwali"
                    value={row.holidayname}
                    onChange={e => setBulkHolidayRows(prev => prev.map(r => r.id === row.id ? { ...r, holidayname: e.target.value } : r))}
                    inputSize="sm"
                  />
                  <Input
                    type="date"
                    value={row.from_date}
                    onChange={e => setBulkHolidayRows(prev => prev.map(r => r.id === row.id ? { ...r, from_date: e.target.value, to_date: r.to_date || e.target.value } : r))}
                    inputSize="sm"
                  />
                  <Input
                    type="date"
                    value={row.to_date}
                    min={row.from_date || undefined}
                    onChange={e => setBulkHolidayRows(prev => prev.map(r => r.id === row.id ? { ...r, to_date: e.target.value } : r))}
                    inputSize="sm"
                  />
                  <Select
                    options={[
                      { label: "National", value: "national" },
                      { label: "Public",   value: "public"   },
                      { label: "Optional", value: "optional" },
                      { label: "School",   value: "school"   },
                    ]}
                    value={row.type}
                    onValueChange={val => setBulkHolidayRows(prev => prev.map(r => r.id === row.id ? { ...r, type: val } : r))}
                    className="w-full"
                  />
                  <Input
                    placeholder="Note"
                    value={row.note}
                    onChange={e => setBulkHolidayRows(prev => prev.map(r => r.id === row.id ? { ...r, note: e.target.value } : r))}
                    inputSize="sm"
                  />
                  <button
                    onClick={() => setBulkHolidayRows(prev => prev.length > 1 ? prev.filter(r => r.id !== row.id) : prev)}
                    disabled={bulkHolidayRows.length === 1}
                    title={`Remove row ${idx + 1}`}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => setBulkHolidayRows(prev => [...prev, newHRow()])}
                className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors mt-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Department
              </button>
            </div>

            {bulkHolidayError && (
              <div className="mx-5 mb-2 px-3 py-2 rounded-lg bg-red-50 border border-red-100 text-xs text-red-600">{bulkHolidayError}</div>
            )}
            {bulkHolidaySuccess && (
              <div className="mx-5 mb-2 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-100 text-xs text-emerald-700 font-medium">{bulkHolidaySuccess}</div>
            )}

            <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-gray-100 shrink-0">
              <p className="text-xs text-gray-400">
                {bulkHolidayRows.filter(r => r.holidayname.trim() && r.from_date && r.to_date).length} of {bulkHolidayRows.length} rows valid
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowBulkHolidayModal(false)} disabled={bulkHolidaySaving}>Cancel</Button>
                <Button
                  size="sm"
                  disabled={bulkHolidaySaving || bulkHolidayRows.every(r => !r.holidayname.trim() || !r.from_date || !r.to_date)}
                  className="bg-indigo-600 text-white min-w-[120px]"
                  onClick={async () => {
                    const schoolCode = import.meta.env.VITE_SCHOOL_CODE || localStorage.getItem("schoolcode") || "";
                    const activeYearId = academicYears.find(y => y.active)?.id ?? academicYears[0]?.id ?? "";
                    const valid = bulkHolidayRows.filter(r => r.holidayname.trim() && r.from_date && r.to_date);
                    if (!valid.length) { setBulkHolidayError("Fill at least one holiday name and both dates."); return; }
                    if (!activeYearId) { setBulkHolidayError("No active academic year found. Please create one first."); return; }
                    setBulkHolidayError("");
                    setBulkHolidaySaving(true);
                    try {
                      const result = await onBulkAddHolidays(
                        valid.map(r => ({ holidayname: r.holidayname.trim(), from_date: r.from_date, to_date: r.to_date, type: r.type, note: r.note.trim() || r.type, school_code: schoolCode, academicYearId: activeYearId }))
                      ) as { count?: number };
                      setBulkHolidaySuccess(`${result?.count ?? valid.length} holiday(s) added successfully.`);
                      setBulkHolidayRows([newHRow()]);
                      setTimeout(() => { setShowBulkHolidayModal(false); setBulkHolidaySuccess(""); }, 1400);
                    } catch (err: unknown) {
                      setBulkHolidayError(err instanceof Error ? err.message : "Bulk add failed");
                    } finally {
                      setBulkHolidaySaving(false);
                    }
                  }}
                >
                  {bulkHolidaySaving
                    ? <span className="flex items-center gap-1.5"><Loader2 className="w-3.5 h-3.5 animate-spin" />Saving…</span>
                    : "Add Holidays"
                  }
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={leaveDays[lt.value] === 0 ? "" : String(leaveDays[lt.value] ?? "")}
                  onChange={e => {
                    const digits = e.target.value.replace(/\D/g, "");
                    const val = digits === "" ? 0 : parseInt(digits, 10);
                    setLeaveDays(prev => ({ ...prev, [lt.value]: val }));
                  }}
                  placeholder="0"
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
          onSubmit={async (data) => { await onCreateAcademicYear(data); }}
        />
      )}
    </div>
  );
};