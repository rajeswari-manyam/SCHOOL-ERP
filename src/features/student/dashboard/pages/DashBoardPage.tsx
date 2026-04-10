import { StatCard } from "@/components/ui/statcard";

const MOCK_STUDENT_STATS = {
  attendancePercentage: 92,
  assignmentsDue: 3,
  upcomingExams: 2,
  libraryBooks: 1,
};

const DashboardPage = () => {
  const data = MOCK_STUDENT_STATS;

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-2xl font-bold mb-6">Student Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Attendance"
          value={`${data.attendancePercentage}%`}
        />
        <StatCard title="Assignments Due" value={data.assignmentsDue} />
        <StatCard title="Upcoming Exams" value={data.upcomingExams} />
        <StatCard title="Library Books" value={data.libraryBooks} />
      </div>
    </div>
  );
};

export default DashboardPage;
