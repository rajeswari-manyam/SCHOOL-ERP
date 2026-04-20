// components/StatCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "../utils/ledger.utils";
import { TrendingUp, Wallet, CreditCard, PiggyBank } from "lucide-react";
import typography, { combineTypography } from "@/styles/typography";

interface StatCardProps {
  title: string;
  amount: number;
  subtitle?: string;
  trend?: string;
  icon: "income" | "expense" | "wallet" | "savings" | "payroll";
  variant?: "green" | "red" | "blue" | "purple";
  progress?: number;
}

const iconMap = {
  income: Wallet,
  expense: CreditCard,
  wallet: Wallet,
  savings: PiggyBank,
  payroll: CreditCard,
};

export const StatCard = ({
  title,
  amount,
  subtitle,
  trend,
  icon,
  variant = "blue",
  progress,
}: StatCardProps) => {
  const Icon = iconMap[icon];

  const variantStyles = {
    green: "border border-gray-200 hover:border-emerald-500",
    red: "border border-gray-200 hover:border-rose-500",
    blue: "border border-gray-200 hover:border-blue-500",
    purple: "border border-gray-200 hover:border-violet-500",
  };

  const textStyles = {
    green: "text-emerald-700",
    red: "text-rose-700",
    blue: "text-blue-700",
    purple: "text-violet-700",
  };

  const progressColors = {
    green: "bg-emerald-500",
    red: "bg-rose-500",
    blue: "bg-blue-500",
    purple: "bg-violet-500",
  };

  return (
    <Card
      className={`
        ${variantStyles[variant]}
        bg-white
        transition-all duration-200
        hover:shadow-sm
        rounded-xl
      `}
    >
      <CardContent className="p-4 sm:p-6">
        {/* Top section */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className={combineTypography(typography.form.label, "text-gray-500 uppercase tracking-wide mb-1")}>
              {title}
            </p>

            <h3 className={`text-lg sm:text-2xl font-bold ${textStyles[variant]} truncate`}>
              {formatCurrency(amount)}
            </h3>

            {trend && (
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-emerald-500" />
                <span className="text-[11px] sm:text-xs text-emerald-600 font-medium">
                  {trend}
                </span>
              </div>
            )}

            {subtitle && (
              <p className="text-[11px] sm:text-xs text-gray-400 mt-1 truncate">
                {subtitle}
              </p>
            )}
          </div>

          <div className={`p-2 sm:p-3 rounded-lg ${textStyles[variant]} shrink-0`}>
            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>

        {/* Progress */}
        {progress !== undefined && (
          <div className="mt-4">
            <div className="flex justify-between text-[11px] sm:text-xs mb-1">
              <span className="text-gray-500">Budget Utilization</span>
              <span className="font-medium text-gray-700">{progress}%</span>
            </div>

            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${progressColors[variant]} rounded-full transition-all`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};