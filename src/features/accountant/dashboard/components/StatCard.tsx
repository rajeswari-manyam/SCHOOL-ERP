import type { DashboardSummary } from "@/services/accountant-reports.api";
import {
  TrendingUp, TrendingDown, LayoutGrid, AlertCircle, Activity, DollarSign,
} from "lucide-react";

const fmt = (n: number) => n.toLocaleString("en-IN");

// ── Top 4 Stat Cards (from getdashboardsummary) ───────────────────────────────

const statCardConfig = [
  {
    key:       "collected_today" as const,
    label:     "COLLECTED TODAY",
    accent:    "bg-emerald-50",
    iconColor: "text-emerald-600",
    icon:      <TrendingUp size={14} />,
    subtitle:  "Payments recorded today",
  },
  {
    key:       "month_collection" as const,
    label:     "MONTH COLLECTION",
    accent:    "bg-indigo-50",
    iconColor: "text-indigo-600",
    icon:      <LayoutGrid size={14} />,
    subtitle:  "Total collected this month",
  },
  {
    key:       "weekly_collection" as const,
    label:     "WEEKLY COLLECTION",
    accent:    "bg-blue-50",
    iconColor: "text-blue-600",
    icon:      <Activity size={14} />,
    subtitle:  "Collected this week",
  },
  {
    key:       "total_pending_fees" as const,
    label:     "PENDING FEES",
    accent:    "bg-amber-50",
    iconColor: "text-amber-500",
    icon:      <AlertCircle size={14} />,
    subtitle:  "Outstanding student fees",
  },
];

export const StatCardsSection = ({ summary }: { summary: DashboardSummary | null }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2">
      {statCardConfig.map((card) => (
        <div
          key={card.key}
          className="bg-white rounded-xl border border-slate-200 px-3 py-2.5 flex items-start gap-2 hover:border-indigo-300 transition-colors"
        >
          <div className={`w-7 h-7 rounded-lg ${card.accent} ${card.iconColor} flex items-center justify-center flex-shrink-0`}>
            {card.icon}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
              {card.label}
            </p>
            <p className="text-[14px] font-bold text-slate-900 leading-tight truncate">
              {fmt(summary?.[card.key] ?? 0)}
            </p>
            <p className="text-[10px] mt-0.5 text-slate-500">{card.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// ── Financial Summary Cards (from getdashboardsummary) ────────────────────────

const summaryCards = [
  {
    label:     "TOTAL INCOME",
    accent:    "bg-emerald-50",
    iconColor: "text-emerald-600",
    icon:      <TrendingUp size={14} />,
    key:       "total_income" as const,
    subtitle:  "Current session revenue",
  },
  {
    label:     "TOTAL EXPENSE",
    accent:    "bg-red-50",
    iconColor: "text-red-500",
    icon:      <TrendingDown size={14} />,
    key:       "total_expense" as const,
    subtitle:  "Current session expenditure",
  },
  {
    label:     "NET PROFIT",
    accent:    "bg-blue-50",
    iconColor: "text-blue-600",
    icon:      <DollarSign size={14} />,
    key:       "net_profit" as const,
    subtitle:  "Profit after expenses",
  },
  {
    label:     "NET LOSS",
    accent:    "bg-rose-50",
    iconColor: "text-rose-500",
    icon:      <TrendingDown size={14} />,
    key:       "net_loss" as const,
    subtitle:  "Loss after expenses",
  },
];

export const FinancialSummaryCards = ({ summary }: { summary: DashboardSummary | null }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
      {summaryCards.map((card) => {
        const value = summary?.[card.key] ?? 0;
        const isLossCard = card.key === "net_loss";

        return (
          <div
            key={card.key}
            className="bg-white rounded-xl border border-slate-200 px-3 py-2.5 flex items-start gap-2 hover:border-indigo-300 transition-colors"
          >
            <div className={`w-7 h-7 rounded-lg ${card.accent} ${card.iconColor} flex items-center justify-center flex-shrink-0`}>
              {card.icon}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
                {card.label}
              </p>
              <p className={`text-[14px] font-bold leading-tight truncate ${isLossCard ? "text-rose-600" : "text-slate-900"}`}>
                {fmt(value)}
              </p>
              <p className="text-[10px] mt-0.5 text-slate-500">{card.subtitle}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
