import { useState, useMemo } from "react";
import { Search, Download, CheckCircle2, XCircle, Clock, CalendarDays, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useStaffList, useAllStaffAttendance } from "../hooks/useAttendance";
import { useAttendanceStore } from "../store";
import type { StaffAttendanceStatus } from "../types/attendance.types";

type Department = "all" | "teaching" | "non-teaching" | "admin";
type DisplayStatus = StaffAttendanceStatus | "not_marked";

interface StaffDisplay {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  role: string;
  department: "teaching" | "non-teaching" | "admin";
  subject?: string;
  status: DisplayStatus;
}

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

const PAGE_SIZE = 8;

const STATUS_CFG: Record<DisplayStatus, { label: string; bg: string; text: string; dot: string; Icon: React.ElementType }> = {
  not_marked: { label: "Not Marked", bg: "bg-gray-100",    text: "text-gray-500",    dot: "bg-gray-400",    Icon: Clock        },
  present:    { label: "Present",    bg: "bg-emerald-50",  text: "text-emerald-700", dot: "bg-emerald-500", Icon: CheckCircle2 },
  absent:     { label: "Absent",     bg: "bg-red-50",      text: "text-red-600",     dot: "bg-red-500",     Icon: XCircle      },
  late:       { label: "Late",       bg: "bg-amber-50",    text: "text-amber-700",   dot: "bg-amber-400",   Icon: Clock        },
  leave:      { label: "On Leave",   bg: "bg-blue-50",     text: "text-blue-600",    dot: "bg-blue-400",    Icon: CalendarDays },
  halfday:    { label: "Half Day",   bg: "bg-purple-50",   text: "text-purple-600",  dot: "bg-purple-400",  Icon: Clock        },
};

const DEPT_OPTIONS: { value: Department; label: string }[] = [
  { value: "all",          label: "All Departments" },
  { value: "teaching",     label: "Teaching"        },
  { value: "non-teaching", label: "Non-Teaching"    },
  { value: "admin",        label: "Admin"           },
];

const STATUS_OPTIONS: { value: DisplayStatus | "all"; label: string }[] = [
  { value: "all",        label: "All Status"  },
  { value: "not_marked", label: "Not Marked"  },
  { value: "present",    label: "Present"     },
  { value: "absent",     label: "Absent"      },
  { value: "late",       label: "Late"        },
  { value: "leave",      label: "On Leave"    },
  { value: "halfday",    label: "Half Day"    },
];

const toDateLabel = (dateStr: string) =>
  new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

const StatusBadge = ({ status }: { status: DisplayStatus }) => {
  const cfg = STATUS_CFG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} shrink-0`} />
      {cfg.label}
    </span>
  );
};

const selectCls = "h-9 pl-3 pr-8 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-colors appearance-none cursor-pointer";

const StaffAttendance = () => {
  const { openMarkStaffAttendance } = useAttendanceStore();
  const { data: staffData, isLoading, error } = useStaffList();
  const { data: allAttendanceData } = useAllStaffAttendance();

  const todayStr = new Date().toISOString().slice(0, 10);

  const [search,       setSearch]       = useState("");
  const [dept,         setDept]         = useState<Department>("all");
  const [page,         setPage]         = useState(1);
  const [statusFilter, setStatusFilter] = useState<DisplayStatus | "all">("all");
  const [selectedDate, setSelectedDate] = useState(todayStr);

  const attendanceMap = useMemo(() => {
    const map = new Map<string, StaffAttendanceStatus>();
    if (allAttendanceData?.data) {
      for (const rec of allAttendanceData.data) {
        if (rec.date === selectedDate) {
          const s = rec.status as string;
          if (["present", "absent", "late", "leave", "halfday"].includes(s)) {
            map.set(rec.staff_id, s as StaffAttendanceStatus);
          }
        }
      }
    }
    return map;
  }, [allAttendanceData, selectedDate]);

  const staffRows: StaffDisplay[] = useMemo(() => {
    if (!staffData) return [];
    return staffData.map((s, i) => {
      const department: "teaching" | "non-teaching" | "admin" = s.isTeaching
        ? "teaching"
        : s.departmentName?.toLowerCase().includes("admin")
        ? "admin"
        : "non-teaching";

      const att = attendanceMap.get(s.id);
      return {
        id: s.id,
        name: s.name,
        initials: s.initials || s.name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase() || "NA",
        avatarColor: AVATAR_COLORS[i % AVATAR_COLORS.length],
        role: s.role,
        department,
        subject: s.subjects?.[0],
        status: att ?? "not_marked",
      };
    });
  }, [staffData, attendanceMap]);

  const filtered = useMemo(() => {
    return staffRows.filter((s) => {
      const matchDept   = dept === "all" || s.department === dept;
      const matchStatus = statusFilter === "all" || s.status === statusFilter;
      const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
                          s.role.toLowerCase().includes(search.toLowerCase()) ||
                          (s.subject ?? "").toLowerCase().includes(search.toLowerCase());
      return matchDept && matchStatus && matchSearch;
    });
  }, [staffRows, dept, statusFilter, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const pageRows   = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const presentCount    = staffRows.filter((s) => s.status === "present").length;
  const absentCount     = staffRows.filter((s) => s.status === "absent").length;
  const lateCount       = staffRows.filter((s) => s.status === "late").length;
  const leaveCount      = staffRows.filter((s) => s.status === "leave").length;
  const notMarkedCount  = staffRows.filter((s) => s.status === "not_marked").length;

  const handlePageChange = (p: number) => { if (p >= 1 && p <= totalPages) setPage(p); };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading staff…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500 text-sm">
        Failed to load staff data. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* ── Summary cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Total Staff",  value: staffRows.length, sub: "Registered",   bg: "bg-white",       border: "border-gray-100",    valueColor: "text-gray-900"    },
          { label: "Not Marked",   value: notMarkedCount,   sub: "No record",    bg: "bg-gray-50",     border: "border-gray-200",    valueColor: "text-gray-500"    },
          { label: "Present",      value: presentCount,     sub: "On time",      bg: "bg-emerald-50",  border: "border-emerald-100", valueColor: "text-emerald-700" },
          { label: "Absent",       value: absentCount,      sub: "Not reported", bg: "bg-red-50",      border: "border-red-100",     valueColor: "text-red-600"     },
          { label: "Late",         value: lateCount,        sub: "After 9:00 AM",bg: "bg-amber-50",    border: "border-amber-100",   valueColor: "text-amber-700"   },
          { label: "On Leave",     value: leaveCount,       sub: "Approved",     bg: "bg-blue-50",     border: "border-blue-100",    valueColor: "text-blue-600"    },
        ].map((card) => (
          <div key={card.label} className={`${card.bg} border ${card.border} rounded-2xl p-4 shadow-sm`}>
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">{card.label}</p>
            <p className={`text-2xl font-bold mt-1 ${card.valueColor}`}>{card.value}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Table card ── */}
      <div className="border border-gray-100 rounded-2xl shadow-sm overflow-hidden">

        {/* Header */}
        <div className="px-5 py-3 flex items-center justify-between border-b border-gray-100 gap-3 flex-wrap">
          <h3 className="text-sm font-semibold text-gray-700 shrink-0">
            Staff List — {toDateLabel(selectedDate)}
          </h3>
          <div className="flex items-center gap-2 flex-wrap ml-auto">
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
            <button
              onClick={openMarkStaffAttendance}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              Mark Attendance
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="px-5 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3 border-b border-gray-50 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search staff…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-8 pr-3 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-colors"
            />
          </div>

          {/* Department dropdown */}
          <div className="relative">
            <select
              value={dept}
              onChange={(e) => { setDept(e.target.value as Department); setPage(1); }}
              className={selectCls}
            >
              {DEPT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <ChevronRight className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none rotate-90" />
          </div>

          {/* Status dropdown */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value as DisplayStatus | "all"); setPage(1); }}
              className={selectCls}
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <ChevronRight className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none rotate-90" />
          </div>

          {/* Date picker */}
          <input
            type="date"
            value={selectedDate}
            max={todayStr}
            onChange={(e) => { setSelectedDate(e.target.value); setPage(1); }}
            className="h-9 px-3 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-colors cursor-pointer"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[540px]">
            <thead>
              <tr className="border-b border-gray-100" style={{ background: '#EFF4FF' }}>
                {["Staff Member", "Role / Subject", "Department", "Status"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-sm text-gray-400">
                    No staff found for the selected filters.
                  </td>
                </tr>
              ) : (
                pageRows.map((staff) => (
                  <tr key={staff.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${staff.avatarColor}`}>
                          {staff.initials}
                        </div>
                        <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">{staff.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-sm text-gray-700 font-medium">{staff.role}</p>
                      {staff.subject && (
                        <p className="text-[10px] text-gray-400 mt-0.5">{staff.subject}</p>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={[
                        "inline-flex px-2.5 py-0.5 rounded-lg text-[11px] font-semibold capitalize",
                        staff.department === "teaching"     ? "bg-indigo-50 text-indigo-600" :
                        staff.department === "non-teaching" ? "bg-gray-100 text-gray-600"    :
                                                              "bg-purple-50 text-purple-600",
                      ].join(" ")}>
                        {staff.department === "non-teaching" ? "Non-Teaching" :
                         staff.department === "teaching"     ? "Teaching" : "Admin"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={staff.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-3.5 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(page - 1)} disabled={page === 1}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={[
                    "w-7 h-7 rounded-lg text-xs font-semibold transition-colors",
                    p === page ? "bg-indigo-600 text-white" : "text-gray-500 hover:bg-gray-100",
                  ].join(" ")}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffAttendance;
