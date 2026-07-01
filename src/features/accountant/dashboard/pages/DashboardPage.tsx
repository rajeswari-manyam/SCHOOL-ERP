import { useState } from "react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useDashboardData } from "../hooks/useDashboard";
import { StatCardsSection, FinancialSummaryCards } from "../components/StatCard";
import { TransactionsTable } from "../components/TransactionsTable";
import { PaymentModeTable } from "../components/PaymentModeTable";
import { MonthlyCollectionTrend } from "../components/MontyCollectionTrend";

const formatHeaderDate = () => {
  const now = new Date();
  const day  = now.toLocaleDateString("en-IN", { weekday: "long" });
  const date = now.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const session = now.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  return `${day}, ${date} · ${session} Session`;
};

export default function DashboardPage() {
  const { summary, transactions, paymentModes, trend, accountantName } = useDashboardData();
  const [viewAllTransactions, setViewAllTransactions] = useState(false);

  return (
    <div className="space-y-3 -mx-4 md:-mx-6 lg:-mx-8 -mt-4 md:-mt-6 lg:-mt-8 px-4 md:px-6 lg:px-8">

      <div className="bg-white border border-slate-200 rounded-xl px-4 md:px-6 py-3 shadow-none">
        <h1 className="text-base sm:text-lg font-semibold text-slate-800">Finance Dashboard</h1>
        <p className="text-xs text-slate-400 mt-0">
          {accountantName && <span className="font-medium text-slate-500">{accountantName} · </span>}
          {formatHeaderDate()}
        </p>
      </div>

      <div className="space-y-3">

        <StatCardsSection summary={summary} />

        <FinancialSummaryCards summary={summary} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 items-start w-full">

          <Card className="lg:col-span-2 border border-slate-200 shadow-none rounded-xl hover:border-indigo-300 transition-colors">
            <CardHeader className="px-3 sm:px-5 py-3 sm:py-4 border-b border-slate-100">
              <CardTitle className="text-sm font-semibold text-slate-800">
                Recent Transactions — Today
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto w-full">
              {transactions.length > 0 ? (
                <>
                  <TransactionsTable
                    data={transactions}
                    viewAll={viewAllTransactions}
                  />
                  {transactions.length > 2 && (
                    <div className="flex justify-center py-2 border-t border-slate-100">
                      <button
                        onClick={() => setViewAllTransactions((prev) => !prev)}
                        className="text-xs text-indigo-600 font-medium hover:underline"
                      >
                        {viewAllTransactions ? "Show Less" : "Show More"}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-slate-400 text-center py-8 text-sm">
                  No transactions found
                </p>
              )}
            </CardContent>
          </Card>


          <div className="flex flex-col gap-4">

            <Card className="border border-slate-200 shadow-none rounded-xl hover:border-indigo-300 transition-colors">
              <CardHeader className="px-5 py-4 border-b border-slate-100">
                <CardTitle className="text-sm font-semibold text-slate-800">
                  Fee Collection by Mode
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {paymentModes.length > 0 ? (
                  <PaymentModeTable data={paymentModes} />
                ) : (
                  <p className="text-slate-400 text-center py-4 text-sm">
                    No data available
                  </p>
                )}
              </CardContent>
            </Card>

          </div>
        </div>

        <MonthlyCollectionTrend data={trend} />

      </div>
    </div>
  );
}