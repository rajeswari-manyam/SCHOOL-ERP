import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useDashboardData } from "../hooks/useDashboard";
import { StatCardsSection } from "../components/StatCard";
import { TransactionsTable } from "../components/TransactionTable";
import { PaymentModeTable } from "../components/PaymentMethodTable";
import { ReminderStatusCard } from "../components/RemainderStatus";
import { MonthlyCollectionTrend } from "../components/MontyCollectionTrend";
import { TopPayingClasses } from "../components/TopPayingClasses";
import { PaymentModeBreakdown } from "../components/PaymentBreakDown";

export default function DashboardPage() {
  const { stats, transactions, paymentModes, reminder } = useDashboardData();

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-800">Finance Dashboard</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Monday, 7 April 2025 · April 2025 Session
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="text-sm h-8 px-4 border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100"
          >
            Generate Report
          </Button>
          <Button className="text-sm h-8 px-4 bg-emerald-600 hover:bg-emerald-700 text-white">
            Record Payment
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* KPI Stats */}
        <StatCardsSection data={stats} />

        {/* Transactions (left 2/3) + Right column: Fee Collection + Reminder stacked */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">

          {/* Transactions — 2 cols */}
          <Card className="lg:col-span-2 border border-slate-200 shadow-none rounded-xl hover:border-indigo-300 transition-colors">
            <CardHeader className="px-5 py-4 border-b border-slate-100 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold text-slate-800">
                Recent Transactions — Today
              </CardTitle>
              <button className="text-xs text-indigo-600 font-medium hover:underline">
                View All Transactions
              </button>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              {transactions.length > 0 ? (
                <TransactionsTable data={transactions} />
              ) : (
                <p className="text-slate-400 text-center py-8 text-sm">
                  No transactions found
                </p>
              )}
            </CardContent>
          </Card>

          {/* Right column — Fee Collection + Reminder stacked */}
          <div className="flex flex-col gap-4">
            {/* Fee Collection by Mode */}
            <Card className="border border-slate-200 shadow-none rounded-xl hover:border-indigo-300 transition-colors">
              <CardHeader className="px-5 py-4 border-b border-slate-100">
                <CardTitle className="text-sm font-semibold text-slate-800">
                  Fee Collection by Mode
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {paymentModes.length > 0 ? (
                  <PaymentModeTable data={paymentModes} />
                ) : (
                  <p className="text-slate-400 text-center py-4 text-sm">
                    No data available
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Reminder Status — directly below Fee Collection */}
            <ReminderStatusCard data={reminder} />
          </div>
        </div>

        {/* Monthly Collection Trend — full width */}
        <MonthlyCollectionTrend />

        {/* Bottom Row: Top Paying Classes + Payment Mode Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TopPayingClasses />
          <PaymentModeBreakdown />
        </div>
      </div>
    </div>
  );
}