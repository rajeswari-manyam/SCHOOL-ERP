import type { AdmissionsSummary, QuickAction } from "../types/dashboard.types";
import { formatWeeklyDelta } from "../utils/formatters.ts";

interface Props {
  admissions: AdmissionsSummary;
}

const QUICK_ACTIONS: QuickAction[] = [
  { icon: "📌", label: "Review leads" },
  { icon: "📈", label: "Export pipeline" },
  { icon: "💬", label: "Message follow-up" },
];

export function WeeklySummaryStrip({ admissions }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-bold text-gray-900 text-base">Admissions pipeline</h2>
          <p className="text-xs text-gray-400 mt-1">This week's progress and next steps</p>
        </div>
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">{formatWeeklyDelta(admissions.weeklyDelta)}</span>
      </div>

      <div className="grid gap-4 mb-5 sm:grid-cols-2">
        {admissions.stages.map((stage) => (
          <div key={stage.label} className={`rounded-3xl p-4 ${stage.colorClass} bg-opacity-10 border border-gray-100`}>
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-900">{stage.label}</p>
              <span className="text-sm font-semibold text-slate-700">{stage.value}</span>
            </div>
            {stage.highlighted && <p className="text-xs text-slate-500 mt-2">Priority stage</p>}
          </div>
        ))}
      </div>

      <div className="rounded-3xl bg-slate-50 p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-3">Quick actions</p>
        <div className="space-y-3">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.label}
              type="button"
              className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
            >
              <span>{action.icon}</span>
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
