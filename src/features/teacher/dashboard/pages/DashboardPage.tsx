import { StatsCards } from "../components/StatsCards";

const mockData = {
  totalStudents: 142,
  totalClasses: 6,
  totalAssignments: 24,
  upcomingEvents: 3,
};

export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Teacher Dashboard</h1>
      <StatsCards stats={mockData} />
    </div>
  );
}
