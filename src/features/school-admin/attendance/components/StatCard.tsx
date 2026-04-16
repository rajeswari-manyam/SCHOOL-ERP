
import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: ReactNode;
  delta?: ReactNode;
  suffix?: ReactNode;
}

export function StatCard({ label, value, delta, suffix }: StatCardProps) {
  return (
    <div className="flex-1 min-w-0 px-6 py-4 border-r border-gray-200 last:border-r-0">
      <p className="text-[11px] font-semibold tracking-widest text-gray-400 uppercase mb-2">
        {label}
      </p>
      <div className="flex items-end gap-2 flex-wrap">
        <span className="text-4xl font-bold text-gray-900 leading-none">{value}</span>
        {delta && <span className="text-sm font-medium mb-0.5">{delta}</span>}
        {suffix && <span className="text-sm text-gray-400 mb-0.5">{suffix}</span>}
      </div>
    </div>
  );
}
