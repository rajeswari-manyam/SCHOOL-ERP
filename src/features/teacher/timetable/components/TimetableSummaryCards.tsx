
import { Calendar, Clock, User, Users } from "lucide-react";
import type { TimetableSummary } from "../types/timetable.types";
import SummaryCard from "./SummaryCard";

interface Props {
  summary: TimetableSummary;
}

const TimetableSummaryCards = ({ summary }: Props) => (
  <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
    <SummaryCard
      label="Total Periods / Week"
      value={summary.totalPeriods}
      sub="across all classes"
      accentClass="text-indigo-600"
      iconBg="bg-indigo-50"
      iconColor="text-indigo-500"
      icon={<Calendar />}
    />
    <SummaryCard
      label="Teaching Hours"
      value={`${summary.teachingHours}h`}
      sub="45 min per period"
      accentClass="text-violet-600"
      iconBg="bg-violet-50"
      iconColor="text-violet-500"
      icon={<Clock  />}
    />
    <SummaryCard
      label="Free Periods"
      value={summary.freePeriods}
      sub="per week"
      accentClass="text-amber-500"
      iconBg="bg-amber-50"
      iconColor="text-amber-500"
      icon={<User  />}
    />
    <SummaryCard
      label="Classes Taught"
      value={summary.classesTaught}
      sub="distinct classes"
      accentClass="text-emerald-600"
      iconBg="bg-emerald-50"
      iconColor="text-emerald-500"
      icon={<Users />}
    />
  </div>
);

export default TimetableSummaryCards;
