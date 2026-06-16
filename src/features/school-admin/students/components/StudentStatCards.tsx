interface StudentStats {
  totalActive: number;
  transferredOut: number;
  newThisMonth: number;
  pendingTC: number;
}

const Card = ({ label, value }: { label: string; value: string | number }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-1">
    <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
    <p className="text-3xl font-extrabold text-gray-900">{value}</p>
  </div>
);

const StudentStatCards = ({ stats }: { stats: StudentStats }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
    <Card label="Total Active" value={stats.totalActive} />
    <Card label="Transferred Out" value={stats.transferredOut} />
    <Card label="New This Month" value={stats.newThisMonth} />
    <Card label="Pending TC" value={stats.pendingTC} />
  </div>
);

export default StudentStatCards;