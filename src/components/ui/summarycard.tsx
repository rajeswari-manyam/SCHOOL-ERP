import * as React from "react";

interface SummaryCardProps {
  label: React.ReactNode;
  value: React.ReactNode;
  highlight?: boolean;
  className?: string;
}

export const SummaryCard = ({
  label,
  value,
  highlight = false,
  className,
}: SummaryCardProps) => {
  return (
    <div
      className={`rounded-xl p-3 ${
        highlight ? "bg-indigo-50" : "bg-gray-50"
      } ${className}`}
    >
      <p className="text-xs uppercase text-gray-400">{label}</p>
      <p
        className={`text-lg font-semibold ${
          highlight ? "text-[#3525CD]" : "text-gray-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
};