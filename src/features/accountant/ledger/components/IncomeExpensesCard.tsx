// components/IncomeExpenseCards.tsx
import { StatCard } from "./StatCard";

interface IncomeExpenseCardsProps {
  totalIncome: number;
  feeCollection: number;
  otherIncome: number;
  totalExpense: number;
  payrollExpense: number;
  operatingExpenses: number;
  type: "income" | "expense";
}

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
    const feePercentage = totalIncome > 0 ? Math.round((feeCollection / totalIncome) * 100) : 0;
    const otherPercentage = totalIncome > 0 ? Math.round((otherIncome / totalIncome) * 100) : 0;

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

  const payrollPercentage = totalExpense > 0 ? Math.round((payrollExpense / totalExpense) * 100) : 0;
  const operatingPercentage = totalExpense > 0 ? Math.round((operatingExpenses / totalExpense) * 100) : 0;

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