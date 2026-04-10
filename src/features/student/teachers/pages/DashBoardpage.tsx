import { StatCard } from "@/components/ui/statcard";

const MOCK_TEACHERS_STATS = {
  activeTeachers: 8,
  classesAttended: 120,
  officeHoursAvailable: 4,
  messagesPending: 2,
};

const DashboardPage = () => {
  const data = MOCK_TEACHERS_STATS;

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-2xl font-bold mb-6">My Teachers</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard label="Active Teachers" value={data.activeTeachers} />
        <StatCard label="Classes Taken" value={data.classesAttended} />
        <StatCard label="Office Hours" value={data.officeHoursAvailable} />
        <StatCard label="Messages" value={data.messagesPending} />
      </div>
    </div>
  );
};

export default DashboardPage;
