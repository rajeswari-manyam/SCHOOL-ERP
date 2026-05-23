import { Card, CardContent } from "../../../../components/ui/card";
import { Users, GraduationCap, UserRound, Clock } from "lucide-react";

interface Props {
  stats: {
    total: number;
    teachers: number;
    nonTeaching: number;
    leavePending: number;
  };
}

const CARDS = (s: Props["stats"]) => [
  {
    label: "Total Staff",
    value: s.total,
    color: "text-slate-800 dark:text-slate-100",
    border: "border-slate-200 dark:border-slate-700",
    iconBg: "bg-slate-100 dark:bg-slate-800",
    iconColor: "text-slate-500 dark:text-slate-400",
    icon: <Users className="w-4 h-4" aria-hidden="true" />,
  },
  {
    label: "Teachers",
    value: s.teachers,
    color: "text-indigo-700 dark:text-indigo-300",
    border: "border-indigo-100 dark:border-indigo-900",
    iconBg: "bg-indigo-50 dark:bg-indigo-950",
    iconColor: "text-indigo-500 dark:text-indigo-400",
    icon: <GraduationCap className="w-4 h-4" aria-hidden="true" />,
  },
  {
    label: "Non-Teaching",
    value: s.nonTeaching,
    color: "text-slate-800 dark:text-slate-100",
    border: "border-slate-200 dark:border-slate-700",
    iconBg: "bg-slate-100 dark:bg-slate-800",
    iconColor: "text-slate-500 dark:text-slate-400",
    icon: <UserRound className="w-4 h-4" aria-hidden="true" />,
  },
  {
    label: "Leave Pending",
    value: s.leavePending,
    color: "text-amber-600 dark:text-amber-400",
    border: "border-amber-100 dark:border-amber-900",
    iconBg: "bg-amber-50 dark:bg-amber-950",
    iconColor: "text-amber-500 dark:text-amber-400",
    icon: <Clock className="w-4 h-4" aria-hidden="true" />,
  },
] as const;

export const StatsCards = ({ stats }: Props) => (
  <section
    aria-label="Staff statistics"
    className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
  >
    {CARDS(stats).map(({ label, value, color, border, iconBg, iconColor, icon }) => (
      <Card
        key={label}
        role="region"
        aria-label={`${label}: ${value}`}
        tabIndex={0}
        className={[
          "border transition-all duration-200 ease-out cursor-pointer",
          "hover:shadow-md hover:-translate-y-0.5 hover:border-indigo-400",
          "dark:hover:border-indigo-500",
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
          border,
        ].join(" ")}
      >
        <CardContent className="px-4 py-4 sm:px-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 truncate pr-2">
              {label}
            </p>
            <span
              className={[
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                iconBg,
                iconColor,
              ].join(" ")}
            >
              {icon}
            </span>
          </div>
          <p
            className={[
              "text-[clamp(1.6rem,4vw,2rem)] font-bold leading-none",
              "tracking-tight tabular-nums",
              color,
            ].join(" ")}
          >
            {value.toLocaleString()}
          </p>
        </CardContent>
      </Card>
    ))}
  </section>
);