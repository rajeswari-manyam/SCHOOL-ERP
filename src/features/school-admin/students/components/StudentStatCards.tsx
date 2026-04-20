interface StudentStats {
  totalActive: number;
  transferredOut: number;
  newThisMonth: number;
  pendingTC: number;
}

const Card = ({ label, value, sub, accent }: { label: string; value: string | number; sub: string; accent: string }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-1">
    <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
    <div className="flex items-end gap-2">
      <p className="text-3xl font-extrabold text-gray-900">{value}</p>
      <span className={`mb-0.5 text-xs font-bold ${accent}`}>{sub}</span>
    </div>
  </div>
);

const StudentStatCards = ({ stats }: { stats: StudentStats }) => (
  <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
    <Card label="Total Active" value={stats.totalActive} sub="+4%" accent="text-emerald-600" />
    <Card label="Transferred Out" value={stats.transferredOut} sub="this year" accent="text-gray-400" />
    <Card label="New This Month" value={stats.newThisMonth} sub="+2" accent="text-indigo-500" />
    <Card label="Pending TC" value={stats.pendingTC} sub="fee due" accent="text-amber-500" />
  </div>
);

export default StudentStatCards;