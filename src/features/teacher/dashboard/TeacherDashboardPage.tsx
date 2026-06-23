import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import TeacherStatCards from "./components/TeacherStatCards";
import TodayScheduleCard from "./components/TodayScheduleCard";
import QuickActionsCard from "./components/QuickActionsCard";
import HomeworkDueCard from "./components/HomeworkDueCard";
import AssignHomeworkModal from "./components/AssignHomeworkModal";
import MarkAttendanceModal from "./components/MarkAttendanceModal";
import { ApplyLeaveModal, UploadMaterialModal } from "./components/TeacherModals";
import { useTeacherDashboard, useTeacherLeaveBalance, usePendingHomeworkByTeacher } from "./hooks/useTeacherDashboard";
import { useTodayAttendanceSummary, useTeacherAttendanceSummaryRange } from "../attendance/hooks/useAttendance";
import { useAuthStore } from "../../../store/authStore";
import { format, startOfMonth } from "date-fns";

const MOCK_STATS = { classStrength: 42, homeworkPending: 3, attendanceThisMonth: 87, leaveBalance: 8 };

const TeacherDashboardPage = () => {
  const navigate = useNavigate();
  const staffId = useAuthStore((state) => state.user?.id ?? "");
  const teacherId = localStorage.getItem("teacherStaffId") || staffId;
  const { data } = useTeacherDashboard();
  const { data: todayAttendance } = useTodayAttendanceSummary(teacherId);
  const { data: leaveBalances = [] } = useTeacherLeaveBalance(staffId);
  const { data: allHomework = [] } = usePendingHomeworkByTeacher(teacherId);

  const todayStr      = format(new Date(), "yyyy-MM-dd");
  const monthStartStr = format(startOfMonth(new Date()), "yyyy-MM-dd");
  const { data: monthlyRaw } = useTeacherAttendanceSummaryRange(teacherId, monthStartStr, todayStr);

  const liveAttendancePct = useMemo(() => {
    type DayData = { sections: { summary?: { present_count?: number; total_strength?: number }; total_strength?: number }[] };
    const days = (monthlyRaw as { data?: DayData[] } | null)?.data;
    if (!days?.length) return null;
    let totalPresent = 0, totalPossible = 0;
    for (const day of days) {
      for (const sec of day.sections) {
        totalPresent  += sec.summary?.present_count  ?? 0;
        totalPossible += sec.summary?.total_strength ?? sec.total_strength ?? 0;
      }
    }
    return totalPossible > 0 ? Math.round((totalPresent / totalPossible) * 100) : null;
  }, [monthlyRaw]);

  const [hwModal,         setHwModal]         = useState(false);
  const [attendanceModal, setAttendanceModal] = useState(false);
  const [leaveModal,      setLeaveModal]      = useState(false);
  const [uploadModal,     setUploadModal]     = useState(false);

  const liveLeaveBalance  = leaveBalances.reduce((sum, item) => sum + Number(item.remaining ?? 0), 0);
  const liveClassStrength = todayAttendance?.totalStudents ?? 0;

  const stats = {
    classStrength:       liveClassStrength > 0   ? liveClassStrength  : (data?.stats?.classStrength       ?? MOCK_STATS.classStrength),
    homeworkPending:     allHomework.length,
    attendanceThisMonth: liveAttendancePct != null ? liveAttendancePct : (data?.stats?.attendanceThisMonth ?? MOCK_STATS.attendanceThisMonth),
    leaveBalance:        leaveBalances.length > 0 ? liveLeaveBalance  : (data?.stats?.leaveBalance         ?? MOCK_STATS.leaveBalance),
  };
  const teacher = data?.teacher;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  return (
    <div className="flex flex-col gap-6 min-h-full p-6">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {greeting}{teacher ? `, ${teacher.name.split(" ")[0]}` : ""} 👋
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {format(new Date(), "EEEE, d MMMM yyyy")}
            {teacher?.classTeacherOf && ` · ${teacher.classTeacherOf}`}
          </p>
        </div>
        {teacher?.schoolName && (
          <p className="text-sm text-gray-500">{teacher.schoolName}</p>
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
        classStrength={stats.classStrength}
        homeworkPending={stats.homeworkPending}
        attendanceThisMonth={stats.attendanceThisMonth}
        leaveBalance={stats.leaveBalance}
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
      <MarkAttendanceModal open={attendanceModal} onClose={() => setAttendanceModal(false)} totalStudents={stats.classStrength} />
      <AssignHomeworkModal  open={hwModal}     onClose={() => setHwModal(false)} teacherId={teacherId} />
      <ApplyLeaveModal      open={leaveModal}  onClose={() => setLeaveModal(false)} />
      <UploadMaterialModal  open={uploadModal} onClose={() => setUploadModal(false)} />
    </div>
  );
};

export default TeacherDashboardPage;
