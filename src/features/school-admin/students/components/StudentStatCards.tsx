interface StudentStats {
  totalActive: number;
  transferredOut: number;
  newThisMonth: number;
  pendingTC: number;
}

interface CardConfig {
  label: string;
  value: number;
  border: string;
}

const StatCard = ({ label, value, border }: CardConfig) => (
  <div className={`bg-white rounded-xl px-4 py-3.5 border-l-4 shadow-sm flex flex-col gap-2 ${border}`}>
    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{label}</p>
    <p className="text-xl font-bold text-gray-900 leading-none tabular-nums">{value}</p>
  </div>
);

const StudentStatCards = ({ stats }: { stats: StudentStats }) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
    <StatCard label="Total Active"    value={stats.totalActive}    border="border-l-green-500"  />
    <StatCard label="Transferred Out" value={stats.transferredOut} border="border-l-blue-500"   />
    <StatCard label="New This Month"  value={stats.newThisMonth}   border="border-l-indigo-500" />
    <StatCard label="Pending TC"      value={stats.pendingTC}      border="border-l-amber-500"  />
  </div>
);

export default StudentStatCards;
