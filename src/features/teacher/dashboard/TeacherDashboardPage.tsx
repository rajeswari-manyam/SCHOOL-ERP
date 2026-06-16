import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import TeacherStatCards from "./components/TeacherStatCards";
import TodayScheduleCard from "./components/TodayScheduleCard";
import QuickActionsCard from "./components/QuickActionsCard";
import HomeworkDueCard from "./components/HomeworkDueCard";
// import ClassOverviewCard from "./components/ClassOverviewCard";
import AssignHomeworkModal from "./components/AssignHomeworkModal";
import MarkAttendanceModal from "./components/MarkAttendanceModal";
import { ApplyLeaveModal, UploadMaterialModal } from "./components/TeacherModals";
import { useTeacherDashboard, useTeacherLeaveBalance } from "./hooks/useTeacherDashboard";
import { useTodayAttendanceSummary } from "../attendance/hooks/useAttendance";
import { useAuthStore } from "../../../store/authStore";
import { format } from "date-fns";

// ── Mock fallback data ─────────────────────────────────────
const MOCK_STATS  = { classStrength: 42, homeworkPending: 3, attendanceThisMonth: 87, leaveBalance: 8 };
const MOCK_OVERVIEW = {
  monthlyAvgPct: 87,
  trend: [
    { date: "Mon", present: 39, absent: 3, total: 42 },
    { date: "Tue", present: 40, absent: 2, total: 42 },
    { date: "Wed", present: 35, absent: 7, total: 42 },
    { date: "Thu", present: 41, absent: 1, total: 42 },
    { date: "Fri", present: 38, absent: 4, total: 42 },
  ],
  chronicAbsentees: [
    { id: "ca1", name: "Ravi Teja", rollNo: "08", attendancePct: 52 },
    { id: "ca2", name: "Meena Kumari", rollNo: "19", attendancePct: 61 },
  ],
};

const TeacherDashboardPage = () => {
  const navigate = useNavigate();
  const staffId = useAuthStore((state) => state.user?.id ?? "");
  const teacherId = localStorage.getItem("teacherStaffId") || staffId;
  const { data } = useTeacherDashboard();
  const { data: todayAttendance } = useTodayAttendanceSummary(teacherId);
  const { data: leaveBalances = [] } = useTeacherLeaveBalance(staffId);
  const [hwModal,            setHwModal]            = useState(false);
  const [attendanceModal,    setAttendanceModal]    = useState(false);
  const [leaveModal,         setLeaveModal]         = useState(false);
  const [uploadModal,        setUploadModal]        = useState(false);

  const liveLeaveBalance = leaveBalances.reduce((sum, item) => sum + Number(item.remaining ?? 0), 0);
  const stats    = {
    ...(data?.stats ?? MOCK_STATS),
    leaveBalance: leaveBalances.length > 0 ? liveLeaveBalance : (data?.stats?.leaveBalance ?? MOCK_STATS.leaveBalance),
  };
  // const overview = data?.classOverview ?? MOCK_OVERVIEW;
  const teacher  = data?.teacher;

  return (
    <div className="flex flex-col gap-6 min-h-full">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Good {new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 17 ? "Afternoon" : "Evening"}{teacher ? `, ${teacher.name.split(" ")[0]}` : ""} 👋
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">{format(new Date(), "EEEE, d MMMM yyyy")} · {teacher?.classTeacherOf ?? "Class Teacher"}</p>
        </div>
        <p className="text-sm text-gray-500">{teacher?.schoolName ?? "School"}</p>
      </div>

      {/* Attendance not-marked banner */}
      {todayAttendance && !todayAttendance.isMarked && (
        <div
          className={[
            "flex flex-col gap-3 rounded-2xl border border-red-200 dark:border-red-800",
            "bg-red-50 dark:bg-red-950/40 px-4 py-4 sm:px-5",
            "sm:flex-row sm:items-center sm:justify-between sm:gap-4",
          ].join(" ")}
          role="alert"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50">
              <AlertCircle size={14} className="text-red-500 dark:text-red-400" strokeWidth={2.5} aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-bold text-red-700 dark:text-red-300 leading-tight">
                Attendance Not Marked Yet
              </p>
              <p className="text-xs text-red-400 dark:text-red-500 mt-0.5">
                Mark today's attendance to keep records up to date
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setAttendanceModal(true)}
            className={[
              "flex w-full items-center justify-center gap-2 sm:w-auto",
              "rounded-xl bg-red-600 hover:bg-red-700 active:scale-95",
              "px-5 py-2.5 text-sm font-semibold text-white",
              "transition-all duration-150 shadow-sm",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2",
            ].join(" ")}
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

      {/* Main grid: schedule + quick actions | homework + class overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Left col: schedule + quick actions */}
        <div className="flex flex-col gap-5">
          <TodayScheduleCard teacherId={teacherId} />
          {/* <QuickActionsCard
            onMarkAttendance={() => setAttendanceModal(true)}
            onAssignHomework={() => setHwModal(true)}
            onUploadMaterial={() => setUploadModal(true)}
            onApplyLeave={() => setLeaveModal(true)}
            onViewStudents={() => navigate("/teacher/students")}
          /> */}
        </div>

        {/* Middle col: homework */}
        <div>
          <HomeworkDueCard teacherId={teacherId} />
        </div>

        {/* Right col: class overview */}
        {/* <div>
          <ClassOverviewCard overview={overview} />
        </div> */}
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
