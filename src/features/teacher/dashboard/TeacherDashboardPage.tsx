import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AttendanceBanner from "./components/AttendanceBanner";
import TeacherStatCards from "./components/TeacherStatCards";
import TodayScheduleCard from "./components/TodayScheduleCard";
import QuickActionsCard from "./components/QuickActionsCard";
import HomeworkDueCard from "./components/HomeworkDueCard";
import ClassOverviewCard from "./components/ClassOverviewCard";
import AssignHomeworkModal from "./components/AssignHomeworkModal";
import { ApplyLeaveModal, UploadMaterialModal } from "./components/TeacherModals";
import { useTeacherDashboard } from "./hooks/useTeacherDashboard";
import { format } from "date-fns";

// ── Mock fallback data ─────────────────────────────────────
const MOCK_BANNER = { status: "NOT_MARKED" as const, totalStudents: 42 };
const MOCK_STATS  = { classStrength: 42, homeworkPending: 3, attendanceThisMonth: 87, leaveBalance: 8 };
const MOCK_SCHEDULE = [
  { id: "1", time: "8:00 – 8:45",  subject: "Mathematics",   class: "Class 8-A", room: "Room 12", status: "COMPLETED" as const },
  { id: "2", time: "8:45 – 9:30",  subject: "Mathematics",   class: "Class 9-B", room: "Room 7",  status: "CURRENT" as const },
  { id: "3", time: "9:45 – 10:30", subject: "Mathematics",   class: "Class 7-C", room: "Room 3",  status: "UPCOMING" as const },
  { id: "4", time: "11:00 – 11:45",subject: "Free Period",   class: "Staff Room",room: "—",        status: "UPCOMING" as const },
  { id: "5", time: "12:30 – 1:15", subject: "Mathematics",   class: "Class 8-B", room: "Room 11", status: "UPCOMING" as const },
];
const MOCK_HOMEWORK = [
  { id: "h1", subject: "Mathematics", class: "Class 8-A", dueDate: new Date().toISOString().slice(0,10), submittedCount: 28, totalCount: 42, title: "Chapter 5 – Exercise 5.2" },
  { id: "h2", subject: "Mathematics", class: "Class 9-B", dueDate: new Date(Date.now() + 86400000).toISOString().slice(0,10), submittedCount: 15, totalCount: 38, title: "Quadratic Equations Practice" },
  { id: "h3", subject: "Mathematics", class: "Class 7-C", dueDate: new Date(Date.now() + 172800000).toISOString().slice(0,10), submittedCount: 5,  totalCount: 35, title: "Fractions Revision Sheet" },
];
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
  const { data } = useTeacherDashboard();
  const [hwModal,     setHwModal]     = useState(false);
  const [leaveModal,  setLeaveModal]  = useState(false);
  const [uploadModal, setUploadModal] = useState(false);

  const banner   = data?.attendanceBanner ?? MOCK_BANNER;
  const stats    = data?.stats ?? MOCK_STATS;
  const schedule = data?.todaySchedule ?? MOCK_SCHEDULE;
  const homework = data?.homeworkDueThisWeek ?? MOCK_HOMEWORK;
  const overview = data?.classOverview ?? MOCK_OVERVIEW;
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
          <TodayScheduleCard periods={schedule} />
          <QuickActionsCard
            onMarkAttendance={() => {}}
            onAssignHomework={() => setHwModal(true)}
            onUploadMaterial={() => setUploadModal(true)}
            onApplyLeave={() => setLeaveModal(true)}
            onViewStudents={() => navigate("/teacher/students")}
          />
        </div>

        {/* Middle col: homework */}
        <div>
          <HomeworkDueCard items={homework} />
        </div>

        {/* Right col: class overview */}
        <div>
          <ClassOverviewCard overview={overview} />
        </div>
      </div>

      {/* Modals */}
      <AssignHomeworkModal  open={hwModal}     onClose={() => setHwModal(false)} />
      <ApplyLeaveModal      open={leaveModal}  onClose={() => setLeaveModal(false)} />
      <UploadMaterialModal  open={uploadModal} onClose={() => setUploadModal(false)} />
    </div>
  );
};

export default TeacherDashboardPage;
