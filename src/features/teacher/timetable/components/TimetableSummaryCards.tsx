import { Calendar, Clock, Coffee } from "lucide-react";
import type { TimetableSummary } from "../types/timetable.types";
import SummaryCard from "./SummaryCard";

interface Props {
  summary: TimetableSummary;
}

const TimetableSummaryCards = ({ summary }: Props) => (
  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
    <SummaryCard
      label="Total Periods"
      value={summary.totalPeriods}
      sub="per week"
      accentClass="text-blue-600"
      iconBg="bg-blue-50"
      iconColor="text-blue-500"
      icon={<Calendar />}
    />
    <SummaryCard
      label="Teaching Hours"
      value={`${summary.teachingHours}h`}
      sub="45 min/period"
      accentClass="text-violet-600"
      iconBg="bg-violet-50"
      iconColor="text-violet-500"
      icon={<Clock />}
    />
    <SummaryCard
      label="Free Periods"
      value={summary.freePeriods}
      sub="per week"
      accentClass="text-amber-500"
      iconBg="bg-amber-50"
      iconColor="text-amber-500"
      icon={<Coffee />}
    />
  </div>
);

export default TimetableSummaryCards;
