import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "../utils/ledger.utils";

export const BalanceSummary = ({
  income,
  expense,
}: {
  income: number;
  expense: number;
}) => {
  const net = income - expense;

  return (
    <Card>
      <CardContent className="grid grid-cols-3 gap-4 text-center p-6">
        <div>
          <p className="text-gray-500">Income</p>
          <p className="text-green-600 font-semibold">
            {formatCurrency(income)}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Expenses</p>
          <p className="text-red-600 font-semibold">
            {formatCurrency(expense)}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Net Position</p>
          <p className="text-xl font-bold">
            {formatCurrency(net)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};