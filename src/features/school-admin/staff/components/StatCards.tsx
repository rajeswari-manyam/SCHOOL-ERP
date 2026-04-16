import { Card, CardContent } from "../../../../components/ui/card";

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
    color: "text-slate-800",
    border: "border-slate-200",
  },
  {
    label: "Teachers",
    value: s.teachers,
    color: "text-indigo-700",
    border: "border-indigo-100",
  },
  {
    label: "Non-Teaching",
    value: s.nonTeaching,
    color: "text-slate-800",
    border: "border-slate-200",
  },
  {
    label: "Leave Pending",
    value: s.leavePending,
    color: "text-amber-600",
    border: "border-amber-100",
  },
];

export const StatsCards = ({ stats }: Props) => (
  <div className="grid grid-cols-4 gap-4">
    {CARDS(stats).map(({ label, value, color, border }) => (
      <Card
        key={label}
        className={`
          border ${border}
          transition-all duration-200 ease-in-out
          hover:shadow-md hover:-translate-y-1 hover:scale-[1.02]
          hover:border-indigo-500
          cursor-pointer
        `}
      >
        <CardContent className="px-5 py-4">
          <p className="text-xs text-slate-500 font-medium mb-1">
            {label}
          </p>
          <p className={`text-3xl font-bold tracking-tight ${color}`}>
            {value}
          </p>
        </CardContent>
      </Card>
    ))}
  </div>
);