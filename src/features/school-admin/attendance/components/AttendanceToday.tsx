import { useState } from "react";
import {
  MessageCircle, X, Bell,
  ChevronLeft, ChevronRight, CheckCircle2,
} from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { useClassTodayAttendance } from "../hooks/useAttendance";
import type {
  GetAllClassesTodayAttendanceResponse,
  ClassTodayItem,
} from "../types/attendance.types";

interface AttendanceTodayProps {
  allClassesData?: GetAllClassesTodayAttendanceResponse;
  allClassesLoading?: boolean;
  allClassesError?: string | null;
  onSelectClass?: (classId: string, sectionId: string) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  "#6366F1","#10B981","#F59E0B","#EF4444",
  "#8B5CF6","#06B6D4","#EC4899","#14B8A6",
];
const avatarColor = (name: string) =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

const getInitials = (name: string) =>
  name.trim().split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");

// ─── Side Panel ───────────────────────────────────────────────────────────────
interface SidePanelProps {
  item: ClassTodayItem;
  onClose: () => void;
}

const SidePanel = ({ item, onClose }: SidePanelProps) => {
  const { data, isLoading, error } = useClassTodayAttendance(
    item.class.id,
    item.section.id
  );

  const teacherName = (item as any).teacher?.name;
  const isMarked    = item.attendance_status === "marked";
  const students    = data?.students ?? [];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-200">

        {/* Panel header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-start justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900">
              Class {item.class.name} — {new Date().toLocaleDateString("en-IN", {
                day: "numeric", month: "long", year: "numeric",
              })}
            </h2>
            {teacherName && (
              <p className="text-xs text-gray-500 mt-0.5">Teacher: {teacherName}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors mt-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Badges row */}
        <div className="px-5 py-2.5 border-b border-gray-100 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
            <MessageCircle className="w-3 h-3" />
            WhatsApp Delivery
          </span>
          {isMarked && data && (
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">
              <CheckCircle2 className="w-3 h-3" />
              Marked
            </span>
          )}
        </div>

        {/* Student list */}
        <div className="flex-1 overflow-y-auto">
          {isLoading && (
            <div className="p-5 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse flex-shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 bg-gray-100 rounded animate-pulse w-32" />
                    <div className="h-2.5 bg-gray-100 rounded animate-pulse w-20" />
                  </div>
                  <div className="w-16 h-6 bg-gray-100 rounded-full animate-pulse" />
                </div>
              ))}
            </div>
          )}

          {error && !isLoading && (
            <div className="p-6 text-center text-sm text-red-500">
              Failed to load student details.
            </div>
          )}

          {!isLoading && !error && students.length === 0 && (
            <div className="p-8 text-center text-sm text-gray-400">
              No students found for this class.
            </div>
          )}

          {!isLoading && !error && students.length > 0 && (
            <div className="divide-y divide-gray-50">
              {students.map((student) => {
                const isPresent = student.attendance_status === "present";
                const color     = avatarColor(student.student_name);
                const initials  = getInitials(student.student_name);

                return (
                  <div key={student.id} className="px-5 py-3.5 flex items-center gap-3">
                    {/* Avatar */}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ring-2 ring-white"
                      style={{ backgroundColor: color }}
                    >
                      {initials}
                    </div>

                    {/* Name + roll */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {student.student_name}
                      </p>
                      <p className="text-xs text-gray-400">
                        Roll: #{student.roll_no}
                      </p>
                    </div>

                    {/* Status badge */}
                    <div className="flex flex-col items-end gap-1">
                      <span
                        className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-bold ${
                          isPresent
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {isPresent ? "PRESENT" : "ABSENT"}
                      </span>
                      {/* Alert status placeholder — extend when alert API is available */}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Panel footer — summary */}
        {data && (
          <div className="px-5 py-3.5 border-t border-gray-100 bg-gray-50/60">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-lg font-bold text-gray-900">{data.total_students}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Total</p>
              </div>
              <div>
                <p className="text-lg font-bold text-green-600">{data.present_students}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Present</p>
              </div>
              <div>
                <p className="text-lg font-bold text-red-500">{data.absent_students}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Absent</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const CLASSES_PAGE_SIZE = 10;

const AttendanceToday = ({
  allClassesData,
  allClassesLoading,
  allClassesError,
  onSelectClass,
}: AttendanceTodayProps) => {
  const [panelItem, setPanelItem]             = useState<ClassTodayItem | null>(null);
  const [classPage, setClassPage]             = useState(1);

  if (allClassesLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 rounded-lg bg-gray-100 animate-pulse" />
          ))}
        </div>
        <div className="h-80 rounded-xl bg-gray-100 animate-pulse" />
      </div>
    );
  }

  if (allClassesError) {
    return (
      <div className="rounded-xl bg-red-50 border border-red-200 p-6 text-center">
        <p className="text-red-600 font-medium">Failed to load today's attendance</p>
        <p className="text-red-500 text-sm mt-1">{allClassesError}</p>
      </div>
    );
  }

  const classes       = allClassesData?.data ?? [];
  const totalPresent  = classes.reduce((s, c) => s + c.present_students, 0);
  const totalAbsent   = classes.reduce((s, c) => s + c.absent_students, 0);
  const classesMarked = classes.filter((c) => c.attendance_status === "marked").length;
  const classesTotal  = classes.length;

  const totalClassPages  = Math.max(1, Math.ceil(classes.length / CLASSES_PAGE_SIZE));
  const paginatedClasses = classes.slice(
    (classPage - 1) * CLASSES_PAGE_SIZE,
    classPage * CLASSES_PAGE_SIZE
  );

  const handleRowClick = (item: ClassTodayItem) => {
    setPanelItem(item);
    onSelectClass?.(item.class.id, item.section.id);
  };

  return (
    <>
      <div className="space-y-5">
        {/* WhatsApp banner commented out — API /tenant/whatsapp/connection removed */}
        {/*
        {!dismissedBanner && (
          <div className="flex items-start gap-3 bg-purple-50/80 rounded-xl p-3.5">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">
                Teachers mark attendance by sending WhatsApp to{" "}
                <span className="font-bold">+91 90000 12345</span>
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Format: 7A Absent: Student Name1, Student Name2
              </p>
            </div>
            <button
              className="text-gray-400 hover:text-gray-600 p-1"
              onClick={() => setDismissedBanner(true)}
            >
              <X size={16} />
            </button>
          </div>
        )}
        */}

        {/* Compact Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white rounded-lg px-4 py-3 border-l-4 border-l-green-500 shadow-sm flex items-center justify-between">
            <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">Total Present</p>
            <p className="text-xl font-bold text-green-600">{totalPresent}</p>
          </div>
          <div className="bg-white rounded-lg px-4 py-3 border-l-4 border-l-red-500 shadow-sm flex items-center justify-between">
            <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">Total Absent</p>
            <p className="text-xl font-bold text-red-500">{totalAbsent}</p>
          </div>
          <div className="bg-white rounded-lg px-4 py-3 border-l-4 border-l-indigo-500 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">Classes Marked</p>
              <div className="flex items-baseline gap-0.5">
                <span className="text-xl font-bold text-indigo-600">{classesMarked}</span>
                <span className="text-sm text-gray-400">/{classesTotal}</span>
              </div>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1 mt-2">
              <div
                className="bg-indigo-600 h-1 rounded-full transition-all"
                style={{ width: classesTotal > 0 ? `${(classesMarked / classesTotal) * 100}%` : "0%" }}
              />
            </div>
          </div>
          <div className="bg-white rounded-lg px-4 py-3 border-l-4 border-l-gray-300 shadow-sm flex items-center justify-between">
            <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">Alerts Sent</p>
            <div className="flex items-baseline gap-0.5">
              <span className="text-xl font-bold text-gray-900">0</span>
              <span className="text-sm text-gray-400">/{totalAbsent}</span>
            </div>
          </div>
        </div>

        {/* Class-wise Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-gray-900">Class-wise Attendance — Today</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {allClassesData?.date
                  ? new Date(allClassesData.date).toLocaleDateString("en-IN", {
                      day: "numeric", month: "long", year: "numeric",
                    })
                  : "—"}{" "}
                · ↻ Auto-refreshing every 60s
              </p>
            </div>
            <span className="text-xs text-gray-400">Click a row to view students</span>
          </div>

          {classes.length === 0 ? (
            <div className="p-10 text-center text-sm text-gray-400">
              No classes found for today.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px]">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      {["Class / Sec", "Teacher", "Total", "Present", "Absent", "Status"].map((h) => (
                        <th key={h} className="text-left px-5 py-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedClasses.map((item) => {
                      const isMarked    = item.attendance_status === "marked";
                      const teacherName = (item as any).teacher?.name ?? "—";
                      const initials    = teacherName !== "—"
                        ? teacherName.split(" ").slice(0, 2).map((w: string) => w[0]?.toUpperCase() ?? "").join("")
                        : "";
                      const isActive = panelItem?.class.id === item.class.id && panelItem?.section.id === item.section.id;

                      return (
                        <tr
                          key={`${item.class.id}-${item.section.id}`}
                          className={`border-b border-gray-50 transition-colors cursor-pointer ${
                            isActive
                              ? "bg-indigo-50/60"
                              : "hover:bg-indigo-50/30"
                          }`}
                          onClick={() => handleRowClick(item)}
                        >
                          <td className="px-5 py-3.5">
                            <span className="font-bold text-gray-900 text-sm">
                              {item.class.name}
                              <span className="text-indigo-600">{item.section.name}</span>
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            {teacherName !== "—" ? (
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
                                  style={{ backgroundColor: avatarColor(teacherName) }}
                                >
                                  {initials}
                                </div>
                                <span className="text-gray-700 text-sm">{teacherName}</span>
                              </div>
                            ) : (
                              <span className="text-gray-400 text-sm">—</span>
                            )}
                          </td>
                          <td className="px-5 py-3.5 text-sm text-gray-600">{item.total_students}</td>
                          <td className="px-5 py-3.5">
                            {isMarked
                              ? <span className="text-green-600 font-semibold text-sm">{item.present_students}</span>
                              : <span className="text-gray-300 text-sm">—</span>}
                          </td>
                          <td className="px-5 py-3.5">
                            {isMarked
                              ? <span className="text-red-500 font-medium text-sm">{item.absent_students}</span>
                              : <span className="text-gray-300 text-sm">—</span>}
                          </td>
                          <td className="px-5 py-3.5">
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              isMarked ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${isMarked ? "bg-green-500" : "bg-red-400"}`} />
                              {isMarked ? "Marked" : "Not Marked"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalClassPages > 1 && (
                <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    Showing {(classPage - 1) * CLASSES_PAGE_SIZE + 1}–{Math.min(classPage * CLASSES_PAGE_SIZE, classes.length)} of {classes.length} classes
                  </p>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setClassPage((p) => Math.max(1, p - 1))}
                      disabled={classPage === 1}
                      className="w-7 h-7 rounded-md flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    {Array.from({ length: totalClassPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setClassPage(p)}
                        className={`w-7 h-7 rounded-md text-xs font-medium transition-colors ${
                          p === classPage ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      onClick={() => setClassPage((p) => Math.min(totalClassPages, p + 1))}
                      disabled={classPage === totalClassPages}
                      className="w-7 h-7 rounded-md flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          <div className="p-4 border-t border-gray-100">
            <Button className="w-full flex items-center justify-center gap-2 bg-orange-400 hover:bg-orange-500 text-white text-sm font-medium py-2.5 rounded-xl transition-colors">
              <Bell className="w-4 h-4" />
              Send Reminder to All Unmarked Classes
            </Button>
          </div>
        </div>
      </div>

      {/* Side panel — renders outside the flow, fixed on screen */}
      {panelItem && (
        <SidePanel item={panelItem} onClose={() => setPanelItem(null)} />
      )}
    </>
  );
};

export default AttendanceToday;