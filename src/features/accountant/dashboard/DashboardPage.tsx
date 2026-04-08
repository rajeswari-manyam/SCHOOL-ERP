import { useAccountantDashboardStats } from "./hooks/useDashboardStats";
import { StatCard } from "./components/StatCard";

const DashboardPage = () => {
  const { data, isLoading } = useAccountantDashboardStats();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Fees Collected"
          value={data?.totalFeesCollected ?? 0}
        />
        <StatCard title="Pending Fees" value={data?.pendingFees ?? 0} />
        <StatCard title="Defaulters" value={data?.defaulters ?? 0} />
        <StatCard title="Transactions" value={data?.transactions ?? 0} />
      </div>
    </div>
  );
};

export default DashboardPage;
