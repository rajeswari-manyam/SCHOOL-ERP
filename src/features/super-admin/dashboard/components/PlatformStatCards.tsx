
import type { PlatformStats } from "../types/dashboard.types";
import {FaMoneyBills} from "react-icons/fa6";
import { FaRegCheckCircle} from "react-icons/fa";
import{BsClockHistory} from "react-icons/bs";
import { Wrench } from "lucide-react";

interface CardProps {
  icon: React.ReactNode;
  badge?: React.ReactNode;
  label: string;
  value: React.ReactNode;
}

const Card = ({ icon, badge, label, value }: CardProps) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
    <div className="flex items-start justify-between">
      <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 flex-shrink-0">
        {icon}
      </div>
      {badge}
    </div>
    <div>
      <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1">{label}</p>
      <p className="text-3xl font-extrabold text-gray-900 tracking-tight">{value}</p>
    </div>
  </div>
);

const Chip = ({ text, color }: { text: string; color: string }) => (
  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${color}`}>{text}</span>
);

const PlatformStatCards = ({ stats }: { stats: PlatformStats }) => (
  <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
    <Card
      icon={<Wrench size={18} />}
      badge={<Chip text={`+${stats.totalSchoolsDelta} THIS MONTH`} color="text-emerald-600 bg-emerald-50" />}
      label="Total Schools"
      value={stats.totalSchools}
    />
    <Card
      icon={<FaRegCheckCircle size={18} />}
      badge={<Chip text={`${stats.onTrial} ON TRIAL`} color="text-amber-600 bg-amber-50" />}
      label="Active Schools"
      value={stats.activeSchools}
    />
    <Card
      icon={<FaMoneyBills size={18} />}
      badge={<Chip text={`+${stats.mrrVsLastMonthPct}% VS LAST MONTH`} color="text-emerald-600 bg-emerald-50" />}
      label="MRR"
      value={`₹${stats.mrr.toLocaleString("en-IN")}`}
    />
    <Card
      icon={<BsClockHistory size={18} />}
      badge={<Chip text={`${stats.usageTodayCount} OF ${stats.usageTodayTotal} SCHOOLS`} color="text-indigo-600 bg-indigo-50" />}
      label="Usage Today"
      value={`${stats.usageTodayPct}%`}
    />
  </div>
);

export default PlatformStatCards;
