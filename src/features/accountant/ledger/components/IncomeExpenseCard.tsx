import { StatCard } from "./StatCard";
import type { IncomeExpenseCardsProps } from "../types/Ledger.types";
import {
  calculateIncomeBreakdown,
  calculateExpenseBreakdown,
} from "../utils/incomeExpenseCalculations";

export const IncomeExpenseCards = ({
  totalIncome,
  feeCollection,
  otherIncome,
  totalExpense,
  payrollExpense,
  operatingExpenses,
  type,
}: IncomeExpenseCardsProps) => {
  if (type === "income") {
    const { feePercentage, otherPercentage } = calculateIncomeBreakdown(
      totalIncome,
      feeCollection,
      otherIncome
    );

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Total Income April"
          amount={totalIncome}
          trend="+12% vs last month"
          icon="income"
          variant="blue"
        />
        <StatCard
          title="Fee Collection"
          amount={feeCollection}
          subtitle={`${feePercentage}% of total income`}
          icon="wallet"
          variant="green"
          progress={feePercentage}
        />
        <StatCard
          title="Other Income"
          amount={otherIncome}
          subtitle={`${otherPercentage}% of total income`}
          icon="savings"
          variant="purple"
          progress={otherPercentage}
        />
      </div>
    );
  }

  const { payrollPercentage, operatingPercentage } =
    calculateExpenseBreakdown(
      totalExpense,
      payrollExpense,
      operatingExpenses
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <StatCard
        title="Total Expenses April"
        amount={totalExpense}
        trend="+12% vs last month"
        icon="expense"
        variant="red"
      />
      <StatCard
        title="Payroll (March Paid)"
        amount={payrollExpense}
        subtitle="Budget Utilization"
        icon="payroll"
        variant="blue"
        progress={payrollPercentage}
      />
      <StatCard
        title="Operating Expenses"
        amount={operatingExpenses}
        subtitle="Total Allocation"
        icon="expense"
        variant="purple"
        progress={operatingPercentage}
      />
    </div>
  );
};