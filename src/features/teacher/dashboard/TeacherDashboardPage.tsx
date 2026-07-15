import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import TeacherStatCards from "./components/TeacherStatCards";
import TodayScheduleCard from "./components/TodayScheduleCard";
import QuickActionsCard from "./components/QuickActionsCard";
import HomeworkDueCard from "./components/HomeworkDueCard";
import AssignHomeworkModal from "./components/AssignHomeworkModal";
import MarkAttendanceModal from "./components/MarkAttendanceModal";
import { ApplyLeaveModal, UploadMaterialModal } from "./components/TeacherModals";
import { useTeacherDashboard, useTeacherLeaveBalance, usePendingHomeworkByTeacher, useTeacherMonthlyAttendance, useTeacherSections, useTeacherUpcomingExams } from "./hooks/useTeacherDashboard";
import { useTodayAttendanceSummary } from "../attendance/hooks/useAttendance";
import { useMyStudents } from "../students/hooks/useMyStudents";
import { useAuthStore } from "../../../store/authStore";
import { format } from "date-fns";

const MOCK_STATS = { homeworkPending: 3, attendanceThisMonth: 87, leaveBalance: 8 };

const TeacherDashboardPage = () => {
  const navigate = useNavigate();
  const staffId = useAuthStore((state) => state.user?.id ?? "");
  const teacherId = localStorage.getItem("teacherStaffId") || staffId;
  const { data } = useTeacherDashboard();
  const { data: todayAttendance } = useTodayAttendanceSummary(teacherId);
  const { data: sections = [] } = useTeacherSections(staffId);
  const { data: allHomework = [] } = usePendingHomeworkByTeacher(teacherId);
  const { students: myStudents } = useMyStudents();

  const academicYearId = sections[0]?.academicYearId ?? "";
  const { data: leaveResponse } = useTeacherLeaveBalance(staffId, academicYearId);

  const now = new Date();
  const { data: monthlyAttendance } = useTeacherMonthlyAttendance(staffId, now.getMonth() + 1, now.getFullYear());

  const liveAttendancePct = (() => {
    if (!monthlyAttendance) return null;           // not loaded yet → keep fallback
    const s = monthlyAttendance.summary;
    if (!s || s.workingDays === 0) return 0;       // loaded but no working days → 0%
    return Math.round((s.present / s.workingDays) * 100);
  })();

  const [hwModal,         setHwModal]         = useState(false);
  const [attendanceModal, setAttendanceModal] = useState(false);
  const [leaveModal,      setLeaveModal]      = useState(false);
  const [uploadModal,     setUploadModal]     = useState(false);

  const section        = sections[0];
  const leaveUsed      = leaveResponse?.totalUsed ?? 0;
  const leaveAllocated = leaveResponse?.totalAllocated ?? 0;

  const { data: upcomingExamsData } = useTeacherUpcomingExams(
    section?.classId ?? "",
    section?.id ?? ""
  );
  const nextExam = upcomingExamsData?.data?.[0] ?? null;

  const classStrength = myStudents.length;

  const stats = {
    currentStrength:     todayAttendance?.isMarked ? (todayAttendance.presentCount ?? 0) : classStrength,
    totalStrength:       classStrength,
    className:           section?.className,
    sectionName:         section?.sectionName,
    homeworkPending:     allHomework.length,
    attendanceThisMonth: liveAttendancePct != null ? liveAttendancePct : (data?.stats?.attendanceThisMonth ?? MOCK_STATS.attendanceThisMonth),
    leaveUsed,
    leaveAllocated,
  };
  const teacher = data?.teacher;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  return (
    <div className="flex flex-col gap-4 min-h-full px-6 pt-2 pb-6">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
        <div>
          <h1 className="text-sm font-semibold text-gray-900">
            {greeting}{teacher ? `, ${teacher.name.split(" ")[0]}` : ""} 👋
          </h1>
          <p className="text-[11px] text-gray-500">
            {format(new Date(), "EEEE, d MMMM yyyy")}
            {teacher?.classTeacherOf && ` · ${teacher.classTeacherOf}`}
          </p>
        </div>
        {teacher?.schoolName && (
          <p className="text-xs text-gray-500">{teacher.schoolName}</p>
        )}
      </div>

      {/* Attendance not-marked banner */}
      {todayAttendance && !todayAttendance.isMarked && (
        <div
          className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
          role="alert"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100">
              <AlertCircle size={14} className="text-red-500" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-sm font-medium text-red-700 leading-tight">Attendance Not Marked Yet</p>
              <p className="text-xs text-red-500 mt-0.5">Mark today's attendance to keep records up to date</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setAttendanceModal(true)}
            className="flex w-full items-center justify-center gap-2 sm:w-auto rounded-lg bg-red-600 hover:bg-red-700 px-4 py-2 text-sm font-medium text-white transition-colors"
          >
            Mark Attendance
          </button>
        </div>
      )}

      {/* Stat cards */}
      <TeacherStatCards
        currentStrength={stats.currentStrength}
        totalStrength={stats.totalStrength}
        className={stats.className}
        sectionName={stats.sectionName}
        homeworkPending={stats.homeworkPending}
        attendanceThisMonth={stats.attendanceThisMonth}
        leaveUsed={stats.leaveUsed}
        leaveAllocated={stats.leaveAllocated}
        nextExam={nextExam}
      />

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TodayScheduleCard teacherId={teacherId} />
        <HomeworkDueCard teacherId={teacherId} />
        <QuickActionsCard
          onMarkAttendance={() => setAttendanceModal(true)}
          onAssignHomework={() => setHwModal(true)}
          onUploadMaterial={() => setUploadModal(true)}
          onApplyLeave={() => setLeaveModal(true)}
          onViewStudents={() => navigate("/teacher/students")}
        />
      </div>

      {/* Modals */}
      <MarkAttendanceModal open={attendanceModal} onClose={() => setAttendanceModal(false)} totalStudents={stats.totalStrength} />
      <AssignHomeworkModal  open={hwModal}     onClose={() => setHwModal(false)} teacherId={teacherId} />
      <ApplyLeaveModal      open={leaveModal}  onClose={() => setLeaveModal(false)} />
      <UploadMaterialModal  open={uploadModal} onClose={() => setUploadModal(false)} />
    </div>
  );
};

export default TeacherDashboardPage;
