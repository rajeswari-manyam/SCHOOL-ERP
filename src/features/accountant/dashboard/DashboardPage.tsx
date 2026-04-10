import { StatCard } from "@/components/ui/statcard";

const MOCK_ACCOUNTANT_STATS = {
  totalFeesCollected: 1248000,
  pendingFees:        342000,
  defaulters:         47,
  transactions:       312,
};

const DashboardPage = () => {
  const data = MOCK_ACCOUNTANT_STATS;

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-2xl font-bold mb-6">Accountant Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          label="Total Fees Collected"
          value={`$${data.totalFeesCollected.toLocaleString()}`}
        />
        <StatCard label="Pending Fees" value={`$${data.pendingFees.toLocaleString()}`} />
        <StatCard label="Defaulters" value={data.defaulters} />
        <StatCard label="Transactions" value={data.transactions} />
      </div>
    </div>
  );
};

export default DashboardPage;
