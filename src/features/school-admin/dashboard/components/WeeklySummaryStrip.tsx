import type { AdmissionsSummary, QuickAction } from "../types/dashboard.types";
import { formatWeeklyDelta } from "../utils/formatters.ts";
import { Button } from "@/components/ui/button";

interface Props {
  admissions: AdmissionsSummary;
}

const QUICK_ACTIONS: QuickAction[] = [
  { icon: "�", label: "Add Student" },
  { icon: "🧑‍🏫", label: "Attendance" },
  { icon: "🧾", label: "Fee Payment" },
  { icon: "📣", label: "Send Broadcast" },
  { icon: "➕", label: "Add Enquiry" },
  { icon: "📊", label: "Gen. Report" },
];

export function WeeklySummaryStrip({ admissions }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
        <div>
          <h2 className="font-bold text-gray-900 text-base">Admissions Pipeline & Quick Actions</h2>
          <p className="text-xs text-gray-400 mt-1">This week's progress and next steps</p>
        </div>
        <span className="inline-flex items-center justify-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
          {formatWeeklyDelta(admissions.weeklyDelta)}
        </span>
      </div>

      <div className="grid gap-4 mb-5 sm:grid-cols-2 lg:grid-cols-5">
        {admissions.stages.map((stage) => (
          <div
            key={stage.label}
            className={`rounded-3xl border border-black/10 bg-white p-6 text-center ${stage.colorClass || ""}`}
          >
            <div className="flex min-h-[110px] flex-col items-center justify-center gap-2">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-900">{stage.label}</p>
              <span className="text-2xl font-semibold text-slate-900">{stage.value}</span>
              {stage.highlighted && <p className="text-xs text-slate-500">Priority stage</p>}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-3xl bg-slate-50 p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-3">Quick actions</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {QUICK_ACTIONS.map((action) => (
            <Button
              key={action.label}
              variant="outline"
              className="flex min-h-[100px] flex-col items-center justify-center gap-3 rounded-3xl border border-slate-200 bg-white px-4 py-5 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
            >
              <span className="text-2xl">{action.icon}</span>
              <span className="uppercase tracking-[0.12em] text-xs text-slate-700">{action.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
