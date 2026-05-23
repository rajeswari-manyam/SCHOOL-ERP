import React from "react";

interface SummaryCardProps {
  label: string;
  value: string | number;
  sub?: string;
  accentClass: string;
  iconBg: string;
  iconColor: string;
  icon: React.ReactNode;
}

const SummaryCard = ({ label, value, sub, accentClass, iconBg, iconColor, icon }: SummaryCardProps) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg} ${iconColor}`}>
      {icon}
    </div>
    <div>
      <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1">{label}</p>
      <p className={`text-3xl font-extrabold tracking-tight ${accentClass}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  </div>
);

export default SummaryCard;
