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
  <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-2 border-l-4 ${border}`}>
    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
    <p className="text-3xl font-extrabold text-gray-900 leading-none tabular-nums">{value}</p>
  </div>
);

const StudentStatCards = ({ stats }: { stats: StudentStats }) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
    <StatCard label="Total Active"     value={stats.totalActive}     border="border-l-emerald-500" />
    <StatCard label="Transferred Out"  value={stats.transferredOut}  border="border-l-blue-500"   />
    <StatCard label="New This Month"   value={stats.newThisMonth}    border="border-l-indigo-500" />
    <StatCard label="Pending TC"       value={stats.pendingTC}       border="border-l-amber-500"  />
  </div>
);

export default StudentStatCards;
