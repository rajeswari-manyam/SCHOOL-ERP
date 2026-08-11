
import type { PlatformStats } from "../types/dashboard.types";
import {FaMoneyBills} from "react-icons/fa6";
import { FaRegCheckCircle} from "react-icons/fa";
import{BsClockHistory} from "react-icons/bs";

interface CardProps {
  icon?: React.ReactNode;
  label: string;
  value: React.ReactNode;
  isLoading?: boolean;
}

const Card = ({ icon, label, value, isLoading = false }: CardProps) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 flex flex-col gap-1.5">
    {icon && (
      <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 flex-shrink-0">
        {icon}
      </div>
    )}
    <div>
      <p className="text-[9px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
      {isLoading ? (
        <div className="h-5 w-16 rounded bg-gray-100 animate-pulse" />
      ) : (
        <p className="text-base font-semibold text-gray-900 tracking-tight">{value}</p>
      )}
    </div>
  </div>
);

interface PlatformStatCardsProps {
  stats: PlatformStats;
  isLoading?: boolean;
}

const PlatformStatCards = ({ stats, isLoading = false }: PlatformStatCardsProps) => (
  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
    <Card
      label="Total Schools"
      value={stats.totalSchools}
      isLoading={isLoading}
    />
    <Card
      icon={<FaRegCheckCircle size={14} />}
      label="Active Schools"
      value={stats.activeSchools}
      isLoading={isLoading}
    />
    <Card
      icon={<FaMoneyBills size={14} />}
      label="Monthly Revenue"
      value={`₹${stats.monthlyRevenue.toLocaleString("en-IN")}`}
      isLoading={isLoading}
    />
    <Card
      icon={<BsClockHistory size={14} />}
      label="Usage Today"
      value={stats.usageToday}
      isLoading={isLoading}
    />
  </div>
);

export default PlatformStatCards;
