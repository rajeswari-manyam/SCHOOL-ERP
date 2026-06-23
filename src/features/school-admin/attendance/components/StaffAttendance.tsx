import { useState, useMemo } from "react";
import { Search, Download, CheckCircle2, XCircle, Clock, CalendarDays, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useStaffList, useAllStaffAttendance } from "../hooks/useAttendance";
import { useAttendanceStore } from "../store";
import type { StaffAttendanceStatus } from "../types/attendance.types";

type Department = "all" | "teaching" | "non-teaching" | "admin";

interface StaffDisplay {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  role: string;
  department: "teaching" | "non-teaching" | "admin";
  subject?: string;
  status: StaffAttendanceStatus;
  timeIn?: string;
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

const STATUS_CFG: Record<StaffAttendanceStatus, { label: string; bg: string; text: string; dot: string; Icon: React.ElementType }> = {
  present: { label: "Present", bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", Icon: CheckCircle2 },
  absent:  { label: "Absent",  bg: "bg-red-50",     text: "text-red-600",     dot: "bg-red-500",     Icon: XCircle      },
  late:    { label: "Late",    bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-400",   Icon: Clock        },
  leave:   { label: "On Leave",bg: "bg-blue-50",    text: "text-blue-600",    dot: "bg-blue-400",    Icon: CalendarDays },
  halfday: { label: "Half Day",bg: "bg-purple-50",  text: "text-purple-600",  dot: "bg-purple-400",  Icon: Clock        },
};

const DEPT_LABELS: Record<Department, string> = {
  all: "All Departments", teaching: "Teaching", "non-teaching": "Non-Teaching", admin: "Admin",
};

function getTodayLabel() {
  return new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

const StatusBadge = ({ status }: { status: StaffAttendanceStatus }) => {
  const cfg = STATUS_CFG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} shrink-0`} />
      {cfg.label}
    </span>
  );
};

const StaffAttendance = () => {
  const { openMarkStaffAttendance } = useAttendanceStore();
  const { data: staffData, isLoading, error } = useStaffList();
  const { data: allAttendanceData } = useAllStaffAttendance();

  const todayStr = new Date().toISOString().slice(0, 10);

  const [search, setSearch] = useState("");
  const [dept, setDept] = useState<Department>("all");
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<StaffAttendanceStatus | "all">("all");

  const todayAttendanceMap = useMemo(() => {
    const map = new Map<string, { status: StaffAttendanceStatus; timeIn?: string }>();
    if (allAttendanceData?.data) {
      for (const rec of allAttendanceData.data) {
        if (rec.date === todayStr) {
          map.set(rec.staff_id, {
            status: (["present", "absent", "late", "leave", "halfday"].includes(rec.status)
              ? rec.status
              : "present") as StaffAttendanceStatus,
            timeIn: rec.remarks ?? undefined,
          });
        }
      }
    }
    return map;
  }, [allAttendanceData, todayStr]);

  const staffRows: StaffDisplay[] = useMemo(() => {
    if (!staffData) return [];

    return staffData.map((s, i) => {
      const department: "teaching" | "non-teaching" | "admin" = s.isTeaching
        ? "teaching"
        : s.departmentName?.toLowerCase().includes("admin")
        ? "admin"
        : "non-teaching";

      const todayAtt = todayAttendanceMap.get(s.id);

      return {
        id: s.id,
        name: s.name,
        initials: s.initials || s.name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase() || "NA",
        avatarColor: AVATAR_COLORS[i % AVATAR_COLORS.length],
        role: s.role,
        department,
        subject: s.subjects?.[0],
        status: todayAtt?.status ?? ("absent" as StaffAttendanceStatus),
        timeIn: todayAtt?.timeIn,
      };
    });
  }, [staffData, todayAttendanceMap]);

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

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageRows   = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const presentCount = staffRows.filter((s) => s.status === "present").length;
  const absentCount  = staffRows.filter((s) => s.status === "absent").length;
  const lateCount    = staffRows.filter((s) => s.status === "late").length;
  const leaveCount   = staffRows.filter((s) => s.status === "leave").length;
  const markedCount  = presentCount + absentCount + lateCount + leaveCount;

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
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
        {[
          { label: "Total Staff",  value: staffRows.length, sub: "Registered",            bg: "bg-white",        border: "border-gray-100",    valueColor: "text-gray-900" },
          { label: "Present",      value: presentCount,     sub: "On time",               bg: "bg-emerald-50",   border: "border-emerald-100", valueColor: "text-emerald-700" },
          { label: "Absent",       value: absentCount,      sub: "Not reported",          bg: "bg-red-50",       border: "border-red-100",     valueColor: "text-red-600" },
          { label: "Late",         value: lateCount,        sub: "After 9:00 AM",         bg: "bg-amber-50",     border: "border-amber-100",   valueColor: "text-amber-700" },
          { label: "On Leave",     value: leaveCount,       sub: "Approved leave",        bg: "bg-blue-50",      border: "border-blue-100",    valueColor: "text-blue-600" },
        ].map((card) => (
          <div key={card.label} className={`${card.bg} border ${card.border} rounded-2xl p-4 shadow-sm`}>
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">{card.label}</p>
            <p className={`text-2xl font-bold mt-1 ${card.valueColor}`}>{card.value}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Progress bar + Mark Attendance button ── */}
      <div className="bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm flex items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-600">Attendance marked today</span>
            <span className="text-xs font-bold text-indigo-600">{markedCount} / {staffRows.length}</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-500"
              style={{ width: `${staffRows.length > 0 ? (markedCount / staffRows.length) * 100 : 0}%` }}
            />
          </div>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors shrink-0">
          <Download className="w-3.5 h-3.5" />
          Export
        </button>
      </div>

      {/* ── Filters ── */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-3 flex items-center justify-between border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700">Staff List — {getTodayLabel()}</h3>
          <button
            onClick={openMarkStaffAttendance}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Mark Attendance
          </button>
        </div>
        <div className="px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 border-b border-gray-50">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search staff…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-8 pr-3 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {(["all", "teaching", "non-teaching", "admin"] as Department[]).map((d) => (
              <button
                key={d}
                onClick={() => { setDept(d); setPage(1); }}
                className={[
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                  dept === d
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                ].join(" ")}
              >
                {DEPT_LABELS[d]}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 flex-wrap ml-auto">
            {(["all", "present", "absent", "late", "leave"] as const).map((s) => {
              const cfg = s !== "all" ? STATUS_CFG[s] : null;
              return (
                <button
                  key={s}
                  onClick={() => { setStatusFilter(s); setPage(1); }}
                  className={[
                    "px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1",
                    statusFilter === s
                      ? s === "all"
                        ? "bg-gray-800 text-white"
                        : `${cfg?.bg} ${cfg?.text} ring-1 ring-current`
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200",
                  ].join(" ")}
                >
                  {cfg && <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />}
                  {s === "all" ? "All" : s === "leave" ? "Leave" : cfg?.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Table ── */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Staff Member", "Role / Subject", "Department", "Status", "Time In", "Action"].map((h, i) => (
                  <th
                    key={h}
                    className={`px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 ${i === 5 ? "text-right" : ""}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-gray-400">
                    No staff found for the selected filters.
                  </td>
                </tr>
              ) : (
                pageRows.map((staff) => (
                  <tr key={staff.id} className="hover:bg-gray-50/60 transition-colors group">
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

                    <td className="px-4 py-3.5">
                      {staff.timeIn ? (
                        <span className="text-sm font-mono text-gray-700">{staff.timeIn}</span>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={openMarkStaffAttendance}
                        className="opacity-0 group-hover:opacity-100 px-3 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-600 text-xs font-semibold hover:bg-indigo-100 transition-all"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="px-5 py-3.5 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
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
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="text-[11px] text-gray-400 text-center">
        Showing attendance for today — {getTodayLabel()}
      </p>
    </div>
  );
};

export default StaffAttendance;
