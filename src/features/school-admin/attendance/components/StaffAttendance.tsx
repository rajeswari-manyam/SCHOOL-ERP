import { useState, useMemo } from "react";
import { CalendarDays, CheckCircle2, XCircle, Plus, Loader2, AlertCircle } from "lucide-react";
import { useStaffList, useStaffAttendanceRange } from "../hooks/useAttendance";
import { useAttendanceStore } from "../store";
import type { StaffAttendanceStatusValue } from "../../../../services/attendance.api";

const selectCls = "h-9 pl-3 pr-3 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-colors cursor-pointer";
const dateCls = "h-9 px-3 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-colors cursor-pointer";

const STATUS_CFG: Record<StaffAttendanceStatusValue, { label: string; bg: string; text: string; dot: string }> = {
  present: { label: "Present",  bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  absent:  { label: "Absent",   bg: "bg-red-50",     text: "text-red-600",     dot: "bg-red-500"     },
  late:    { label: "Late",     bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-400"    },
  leave:   { label: "On Leave", bg: "bg-blue-50",    text: "text-blue-600",    dot: "bg-blue-400"     },
  halfday: { label: "Half Day", bg: "bg-purple-50",  text: "text-purple-600",  dot: "bg-purple-400"   },
};

const StatusBadge = ({ status }: { status: StaffAttendanceStatusValue }) => {
  const cfg = STATUS_CFG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} shrink-0`} />
      {cfg.label}
    </span>
  );
};

const fmt = (d: string) =>
  new Date(d + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });

const StaffAttendance = () => {
  const { openMarkStaffAttendance } = useAttendanceStore();
  const { data: staffData, isLoading: staffListLoading } = useStaffList();

  const todayStr = new Date().toISOString().slice(0, 10);

  const [staffId,   setStaffId]   = useState(""); // "" = All Staff
  const [startDate, setStartDate] = useState(todayStr);
  const [endDate,    setEndDate]   = useState(todayStr);
  const [searched,  setSearched]  = useState(false);

  const staffOptions = useMemo(
    () => [...(staffData ?? [])].sort((a, b) => a.name.localeCompare(b.name)),
    [staffData]
  );
  const staffNameMap = useMemo(
    () => new Map(staffOptions.map((s) => [s.id, s.name])),
    [staffOptions]
  );
  const selectedStaffName = staffOptions.find((s) => s.id === staffId)?.name ?? "";

  // Dates are optional too — only enforce ordering when both are present.
  const canSearch = !startDate || !endDate || startDate <= endDate;

  const { data, isLoading, isError, error } = useStaffAttendanceRange(staffId, startDate, endDate, searched && canSearch);

  const rows = useMemo(() => {
    if (!data?.records) return [];
    return [...data.records]
      .map((r) => ({
        id: r.id,
        staffName: staffNameMap.get(r.staff_id) ?? "Unknown",
        date: r.date,
        status: r.status,
        remarks: r.remarks,
        workingDay: r.working_day,
      }))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [data, staffNameMap]);

  const summary = data?.summary;

  const handleSearch = () => { if (canSearch) setSearched(true); };
  const resetSearchState = () => setSearched(false);

  return (
    <div className="space-y-5">
      {/* ── Summary cards — only once a search has been run ── */}
      {searched && summary && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: "Total Days",   value: summary.totalDays,   sub: "In range",     bg: "bg-white",       border: "border-gray-100",    valueColor: "text-gray-900"    },
            { label: "Working Days", value: summary.workingDays, sub: "Scheduled",    bg: "bg-gray-50",     border: "border-gray-200",    valueColor: "text-gray-500"    },
            { label: "Present",      value: summary.present,     sub: "On time",      bg: "bg-emerald-50",  border: "border-emerald-100", valueColor: "text-emerald-700" },
            { label: "Absent",       value: summary.absent,      sub: "Not reported", bg: "bg-red-50",      border: "border-red-100",     valueColor: "text-red-600"     },
            { label: "Half Day",     value: summary.halfday,     sub: "Partial",      bg: "bg-amber-50",    border: "border-amber-100",   valueColor: "text-amber-700"   },
            { label: "On Leave",     value: summary.leave,       sub: "Approved",     bg: "bg-blue-50",     border: "border-blue-100",    valueColor: "text-blue-600"    },
          ].map((card) => (
            <div key={card.label} className={`${card.bg} border ${card.border} rounded-2xl p-4 shadow-sm`}>
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">{card.label}</p>
              <p className={`text-2xl font-bold mt-1 ${card.valueColor}`}>{card.value}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{card.sub}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Table card ── */}
      <div className="border border-gray-100 rounded-2xl shadow-sm overflow-hidden">

        {/* Header */}
        <div className="px-5 py-3 flex items-center justify-between border-b border-gray-100 gap-3 flex-wrap">
          <h3 className="text-sm font-semibold text-gray-700 shrink-0">
            Staff Attendance{searched && staffId && selectedStaffName ? ` — ${selectedStaffName}` : ""}
          </h3>
          <button
            onClick={openMarkStaffAttendance}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Mark Attendance
          </button>
        </div>

        {/* Filters — staff and date range are both optional */}
        <div className="px-5 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3 border-b border-gray-50 flex-wrap">
          <select
            value={staffId}
            onChange={(e) => { setStaffId(e.target.value); resetSearchState(); }}
            disabled={staffListLoading}
            className={selectCls}
          >
            <option value="">{staffListLoading ? "Loading staff…" : "All Staff"}</option>
            {staffOptions.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <input
            type="date"
            value={startDate}
            max={endDate || undefined}
            onChange={(e) => { setStartDate(e.target.value); resetSearchState(); }}
            className={dateCls}
          />
          <input
            type="date"
            value={endDate}
            min={startDate || undefined}
            onChange={(e) => { setEndDate(e.target.value); resetSearchState(); }}
            className={dateCls}
          />

          <button
            onClick={handleSearch}
            disabled={!canSearch}
            className="h-9 px-4 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Search
          </button>
        </div>

        {/* Results */}
        {!searched ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2 text-gray-400">
            <CalendarDays size={28} className="text-gray-300" strokeWidth={1.5} />
            <p className="text-sm font-medium">Pick a staff and/or date range, then click Search</p>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center h-40 gap-2 text-gray-500 text-sm">
            <Loader2 size={18} className="animate-spin" />
            Loading attendance…
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center h-40 gap-2 text-red-500 text-sm">
            <AlertCircle size={22} className="text-red-300" />
            {(error as any)?.response?.data?.message ?? "Failed to load staff attendance. Please try again."}
          </div>
        ) : rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2 text-gray-400">
            <CheckCircle2 size={28} className="text-emerald-300" strokeWidth={1.5} />
            <p className="text-sm font-medium text-gray-500">No attendance records found</p>
            <p className="text-xs text-gray-400">
              {staffId ? `${selectedStaffName} has no attendance in this date range.` : "No staff have attendance in this date range."}
            </p>
          </div>
        ) : (
          <>
          {/* Card list (mobile only) — avoids horizontal scroll */}
          <div className="sm:hidden divide-y divide-gray-50">
            {rows.map((rec) => (
              <div key={`${rec.id}-card`} className="px-5 py-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-gray-900">{rec.staffName}</span>
                  <StatusBadge status={rec.status} />
                </div>
                <div className="flex items-center justify-between gap-2 mt-1.5">
                  <span className="text-xs text-gray-500">{fmt(rec.date)}</span>
                  {rec.workingDay ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                      <CheckCircle2 size={12} /> Working day
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-400">
                      <XCircle size={12} /> Non-working
                    </span>
                  )}
                </div>
                {rec.remarks && (
                  <p className="text-xs text-gray-500 capitalize mt-1">{rec.remarks}</p>
                )}
              </div>
            ))}
          </div>

          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full min-w-[560px]">
              <thead>
                <tr className="border-b border-gray-100" style={{ background: "#EFF4FF" }}>
                  {["Staff", "Date", "Status", "Remarks", "Working Day"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rows.map((rec) => (
                  <tr key={rec.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">{rec.staffName}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{fmt(rec.date)}</td>
                    <td className="px-4 py-3"><StatusBadge status={rec.status} /></td>
                    <td className="px-4 py-3 text-sm text-gray-600 capitalize">{rec.remarks || "—"}</td>
                    <td className="px-4 py-3">
                      {rec.workingDay ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                          <CheckCircle2 size={12} /> Working day
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-400">
                          <XCircle size={12} /> Non-working
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StaffAttendance;
