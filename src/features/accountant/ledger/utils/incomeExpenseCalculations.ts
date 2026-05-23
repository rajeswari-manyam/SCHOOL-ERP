export const calculateIncomeBreakdown = (
  totalIncome: number,
  feeCollection: number,
  otherIncome: number
) => {
  const feePercentage =
    totalIncome > 0 ? Math.round((feeCollection / totalIncome) * 100) : 0;

  const otherPercentage =
    totalIncome > 0 ? Math.round((otherIncome / totalIncome) * 100) : 0;

  return { feePercentage, otherPercentage };
};

export const calculateExpenseBreakdown = (
  totalExpense: number,
  payrollExpense: number,
  operatingExpenses: number
) => {
  const payrollPercentage =
    totalExpense > 0 ? Math.round((payrollExpense / totalExpense) * 100) : 0;

  const operatingPercentage =
    totalExpense > 0
      ? Math.round((operatingExpenses / totalExpense) * 100)
      : 0;

  return { payrollPercentage, operatingPercentage };
};