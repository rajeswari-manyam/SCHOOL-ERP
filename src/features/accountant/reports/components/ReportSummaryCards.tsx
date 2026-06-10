import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface SummaryCardData {
  title: string;
  amount: number;
  trend: number;
  isUp: boolean;
}

const summaryData: SummaryCardData[] = [
  { title: "Daily Collection", amount: 84500, trend: 12.5, isUp: true },
  { title: "Monthly Collection", amount: 1824000, trend: 8.3, isUp: true },
  { title: "Expense Report", amount: 687000, trend: 3.2, isUp: false },
  { title: "Profit / Loss", amount: 1137000, trend: 5.7, isUp: true },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export const ReportSummaryCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {summaryData.map((item) => (
        <Card key={item.title} className="border border-gray-200 overflow-hidden">
          <CardContent className="p-4 sm:p-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              {item.title}
            </p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {formatCurrency(item.amount)}
              </p>
              <div
                className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                  item.isUp
                    ? "text-green-700 bg-green-50"
                    : "text-red-700 bg-red-50"
                }`}
              >
                {item.isUp ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5" />
                )}
                <span>{item.isUp ? "+" : ""}{item.trend}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
