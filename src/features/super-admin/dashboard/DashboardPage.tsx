import { PlatformStatsGrid, SchoolHealthList, RevenueWidget, CronStatusCard } from "./components";

const mockStats = {
  totalSchools: 120,
  activeSchools: 110,
  totalStudents: 4500,
  totalTeachers: 300,
  totalRevenue: 250000,
  monthlyRevenue: 25000,
  pendingPayments: 5000,
  expiringSubscriptions: 12,
};

const mockSchoolHealth: any[] = [
  { schoolId: "s1", schoolName: "Greenwood High", status: "healthy", studentCount: 1500, lastActivity: new Date().toISOString() },
  { schoolId: "s2", schoolName: "Sunnydale School", status: "warning", studentCount: 800, lastActivity: new Date().toISOString() },
  { schoolId: "s3", schoolName: "Riverdale Academy", status: "healthy", studentCount: 2200, lastActivity: new Date().toISOString() },
];

const mockRevenue = [
  { month: "Jan", revenue: 50000 },
  { month: "Feb", revenue: 60000 },
  { month: "Mar", revenue: 55000 },
];

const mockCronJobs: any[] = [
  { name: "Daily Backup", status: "idle", lastRun: new Date().toISOString() },
  { name: "Email Notifications", status: "failed", lastRun: new Date().toISOString() },
  { name: "Data Sync", status: "running", lastRun: new Date().toISOString() },
];

export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Platform Dashboard</h1>
      
      <PlatformStatsGrid stats={mockStats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <SchoolHealthList schools={mockSchoolHealth} />
        <CronStatusCard jobs={mockCronJobs} />
      </div>
      
      <div className="mt-6">
        <RevenueWidget data={mockRevenue} />
      </div>
    </div>
  );
}