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
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 flex items-center gap-3 hover:shadow-md transition-shadow duration-200">
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}>
      <span className={iconColor}>{React.cloneElement(icon as React.ReactElement<any>, { size: 15, strokeWidth: 1.8 })}</span>
    </div>
    <div className="min-w-0">
      <p className="text-[10px] font-medium uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
      <p className={`text-lg font-bold tracking-tight ${accentClass}`}>{value}</p>
      {sub && <p className="text-[10px] text-gray-400">{sub}</p>}
    </div>
  </div>
);

export default SummaryCard;