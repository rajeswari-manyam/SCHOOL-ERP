import { StatCard } from "../../../../components/ui/statcard";

interface AttendanceStatsProps {
  onAbsentCardClick: () => void;
}

export default function AttendanceStats({ onAbsentCardClick }: AttendanceStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      
      {/* THIS MONTH */}
      <StatCard
        label="THIS MONTH"
        value="22 / 24"
        suffixLabel="days"
        badge={{ text: "91.7%", variant: "green" }}
      />

      {/* THIS YEAR */}
      <StatCard
        label="THIS YEAR"
        value="182 / 198"
        suffixLabel="days"
        badge={{ text: "91.9%", variant: "green" }}
      />

      {/* ABSENT */}
      <div onClick={onAbsentCardClick}>
        <StatCard
          label="ABSENT THIS MONTH"
          value="2"
          suffixLabel="days"
          badge={{ text: "View details →", variant: "red" }}
          className="hover:border-[#BA1A1A]"
        />
      </div>

    </div>
  );
}