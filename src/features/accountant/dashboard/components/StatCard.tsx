import type { DashboardSummary } from "@/services/accountant-reports.api";
import { formatCurrency } from "../../../../utils/formatters";
import {
  TrendingUp, TrendingDown, LayoutGrid, AlertCircle, Activity, DollarSign,
} from "lucide-react";

// ── Top 4 Stat Cards (from getdashboardsummary) ───────────────────────────────

const statCardConfig = [
  {
    key:       "collected_today" as const,
    label:     "COLLECTED TODAY",
    accent:    "bg-emerald-50",
    iconColor: "text-emerald-600",
    icon:      <TrendingUp size={18} />,
    subtitle:  "Payments recorded today",
  },
  {
    key:       "month_collection" as const,
    label:     "MONTH COLLECTION",
    accent:    "bg-indigo-50",
    iconColor: "text-indigo-600",
    icon:      <LayoutGrid size={18} />,
    subtitle:  "Total collected this month",
  },
  {
    key:       "weekly_collection" as const,
    label:     "WEEKLY COLLECTION",
    accent:    "bg-blue-50",
    iconColor: "text-blue-600",
    icon:      <Activity size={18} />,
    subtitle:  "Collected this week",
  },
  {
    key:       "total_pending_fees" as const,
    label:     "PENDING FEES",
    accent:    "bg-amber-50",
    iconColor: "text-amber-500",
    icon:      <AlertCircle size={18} />,
    subtitle:  "Outstanding student fees",
  },
];

export const StatCardsSection = ({ summary }: { summary: DashboardSummary | null }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
      {statCardConfig.map((card) => (
        <div
          key={card.key}
          className="bg-white rounded-xl border border-slate-200 px-2.5 py-2.5 sm:px-4 sm:py-3.5 flex items-start gap-2 hover:border-indigo-300 transition-colors"
        >
          <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg ${card.accent} ${card.iconColor} flex items-center justify-center flex-shrink-0`}>
            <span className="scale-90 sm:scale-100">{card.icon}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              {card.label}
            </p>
            <p className="text-[16px] sm:text-[17px] font-bold text-slate-900 leading-tight truncate">
              {formatCurrency(summary?.[card.key] ?? 0)}
            </p>
            <p className="text-[11px] mt-1 text-slate-500">{card.subtitle}</p>
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
    icon:      <TrendingUp size={18} />,
    key:       "total_income" as const,
    subtitle:  "Current session revenue",
  },
  {
    label:     "TOTAL EXPENSE",
    accent:    "bg-red-50",
    iconColor: "text-red-500",
    icon:      <TrendingDown size={18} />,
    key:       "total_expense" as const,
    subtitle:  "Current session expenditure",
  },
  {
    label:     "NET PROFIT",
    accent:    "bg-blue-50",
    iconColor: "text-blue-600",
    icon:      <DollarSign size={18} />,
    key:       "net_profit" as const,
    subtitle:  "Profit after expenses",
  },
  {
    label:     "NET LOSS",
    accent:    "bg-rose-50",
    iconColor: "text-rose-500",
    icon:      <TrendingDown size={18} />,
    key:       "net_loss" as const,
    subtitle:  "Loss after expenses",
  },
];

export const FinancialSummaryCards = ({ summary }: { summary: DashboardSummary | null }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {summaryCards.map((card) => {
        const value = summary?.[card.key] ?? 0;
        const isLossCard = card.key === "net_loss";

        return (
          <div
            key={card.key}
            className="bg-white rounded-xl border border-slate-200 px-4 py-3.5 flex items-start gap-3 hover:border-indigo-300 transition-colors"
          >
            <div className={`w-9 h-9 rounded-lg ${card.accent} ${card.iconColor} flex items-center justify-center flex-shrink-0`}>
              {card.icon}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                {card.label}
              </p>
              <p className={`text-[17px] font-bold leading-tight truncate ${isLossCard ? "text-rose-600" : "text-slate-900"}`}>
                {formatCurrency(value)}
              </p>
              <p className="text-[11px] mt-1 text-slate-500">{card.subtitle}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
