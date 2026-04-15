import { StatCard } from "@/components/ui/statcard";
import type{ StatItem } from "../types/dashboard.types";
import { formatCurrency } from "../utils/format";

export const StatCardsSection = ({ data }: { data: StatItem[] }) => {
  return (
    <div className="grid grid-cols-4 gap-4">
      {data.map((item) => (
        <StatCard
          key={item.label}
          label={item.label}
          value={
            typeof item.value === "number"
              ? formatCurrency(item.value)
              : item.value
          }
        />
      ))}
    </div>
  );
};