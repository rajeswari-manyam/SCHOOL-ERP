import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AttendanceBanner from "./components/AttendanceBanner";
import TeacherStatCards from "./components/TeacherStatCards";
import TodayScheduleCard from "./components/TodayScheduleCard";
import QuickActionsCard from "./components/QuickActionsCard";
import HomeworkDueCard from "./components/HomeworkDueCard";
// import ClassOverviewCard from "./components/ClassOverviewCard";
import AssignHomeworkModal from "./components/AssignHomeworkModal";
import MarkAttendanceModal from "./components/MarkAttendanceModal";
import { ApplyLeaveModal, UploadMaterialModal } from "./components/TeacherModals";
import { useTeacherDashboard, useTeacherLeaveBalance } from "./hooks/useTeacherDashboard";
import { useAuthStore } from "../../../store/authStore";
import { format } from "date-fns";

// ── Mock fallback data ─────────────────────────────────────
const MOCK_BANNER = { status: "NOT_MARKED" as const, totalStudents: 42 };
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
  const { data: leaveBalances = [] } = useTeacherLeaveBalance(staffId);
  const [hwModal,            setHwModal]            = useState(false);
  const [attendanceModal,    setAttendanceModal]    = useState(false);
  const [leaveModal,         setLeaveModal]         = useState(false);
  const [uploadModal,        setUploadModal]        = useState(false);

  const banner   = data?.attendanceBanner ?? MOCK_BANNER;
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

      {/* Attendance banner */}
      <div className="flex flex-col gap-3">
        <AttendanceBanner banner={banner} />
      </div>

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
