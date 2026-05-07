import { cn } from "@/utils/cn";


type StatType = "attendance" | "fees" | "default";
type BadgeVariant = "green" | "red" | "blue" | "amber" | "purple";
interface StatCardProps {
  label: React.ReactNode;
  value?: React.ReactNode;
  badge?: { text: string; variant: BadgeVariant };
  sub?: React.ReactNode;   // ✅ FIX HERE
  icon?: React.ReactNode;
  className?: string;
  suffixLabel?: string;
  type?: StatType;
}

const badgeStyles: Record<BadgeVariant, string> = {
  green: "bg-[#E6F4EF] text-[#00714D]",   
  red: "bg-[#FDECEC] text-[#BA1A1A]",  
  blue: "bg-[#EEF2FF] text-[#3525CD]",  
  amber: "bg-[#FAEEDA] text-[#854F0B]",  
  purple: "bg-[#F3E8FF] text-[#5B21B6]",
};

const dotColors: Record<BadgeVariant, string> = {
  green: "bg-[#00714D]",   
  red: "bg-[#BA1A1A]",   
  blue: "bg-[#3525CD]",   
  amber: "bg-[#BA7517]",  
  purple: "bg-[#5B21B6]",
};

export const StatCard = ({ label, value, badge, sub, icon, className, suffixLabel }: StatCardProps) => (
  <div
    className={cn(
      "group bg-white border border-[#E8EBF2] rounded-xl p-4 flex flex-col gap-2 cursor-pointer transition-all duration-200 h-full",
      " hover:border-[#3525CD] hover:shadow-md hover:-translate-y-1",
      className
    )}
  >
    <div className="flex justify-between items-start">
      <p className="text-[11px] font-bold uppercase tracking-wide text-gray-600">
        {label}
      </p>
      {icon && <div className="shrink-0">{icon}</div>}
    </div>
   {value && (
  <div className="flex items-baseline gap-1">
    <p className="text-xl font-semibold leading-tight text-[#0B1C30]">
      {value}
    </p>
    {suffixLabel && (
      <span className="text-xs text-gray-500">
        {suffixLabel}
      </span>
    )}
  </div>
)}
   
    {badge &&
      (label === "Today's Attendance" ? (
   
        <span
          className={cn(
            "inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-1 rounded-full w-fit",
            badgeStyles[badge.variant]
          )}
        >
          <span
            className={cn(
              "w-1.5 h-1.5 rounded-full shrink-0",
              dotColors[badge.variant]
            )}
          />
          {badge.text}
        </span>
      ) : label === "Fee Status" && badge.text === "Pending" ? (
        // ❌ Hide Pending completely
        null
      ) : (
      
        <span className="text-[11px] font-medium text-[#0B1C30]">
          {badge.text}
        </span>
      ))}

    {sub && (
  <div className="text-xs text-gray-400">
    {sub}
  </div>
)}
  </div>
);