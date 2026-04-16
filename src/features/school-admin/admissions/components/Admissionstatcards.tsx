import type { AdmissionStats } from "../types/admissions.types";

interface Props {
  stats: AdmissionStats;
}

const StatCard = ({
  label,
  value,
  accent,
  sub,
}: {
  label: string;
  value: number | string;
  accent: string;
  sub?: string;
}) => (
  <div className={`bg-white rounded-2xl border border-gray-100 p-5 flex-1 min-w-[120px] border-l-4 ${accent} shadow-sm`}>
    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
    <p className="text-3xl font-extrabold text-gray-900 mt-1">{value}</p>
    {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
  </div>
);

const AdmissionStatCards = ({ stats }: Props) => (
  <div className="flex gap-3 flex-wrap">
    <StatCard label="Enquiries"    value={stats.enquiries}    accent="border-l-indigo-400" />
    <StatCard label="Interviews"   value={stats.interviews}   accent="border-l-amber-400"  />
    <StatCard label="Docs Verified" value={stats.docsVerified} accent="border-l-violet-400" />
    <StatCard label="Confirmed"    value={stats.confirmed}    accent="border-l-emerald-500" />
    <StatCard label="Declined"     value={stats.declined}     accent="border-l-red-400"    />
  </div>
);

export default AdmissionStatCards;