import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useDashboardData } from "../hooks/useDashboard";
import { StatCardsSection } from "../components/StatCard";
import { TransactionsTable } from "../components/TransactionsTable";
import { PaymentModeTable } from "../components/PaymentModeTable";
import { ReminderStatusCard } from "../components/ReminderStatusCard";
import { MonthlyCollectionTrend } from "../components/MontyCollectionTrend";
import { TopPayingClasses } from "../components/TopPayingClasses";
import { PaymentModeBreakdown } from "../components/PaymentModeBreakdown";

export default function DashboardPage() {
  const { stats, transactions, paymentModes, reminder } = useDashboardData();
const [viewAllTransactions, setViewAllTransactions] = useState(false);


  return (
    <div className="min-h-screen bg-[#F8F9FC]">
   
<div className="bg-white border-b border-slate-200 px-4 md:px-6 py-3 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-800">Finance Dashboard</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Monday, 7 April 2025 · April 2025 Session
          </p>
        </div>
      <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Button
            variant="outline"
            className="text-sm h-8 px-4 border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100"
          >
            Generate Report
          </Button>
          <Button className="text-sm h-8 px-4 w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white">
            Record Payment
          </Button>
        </div>
      </div>

     <div className="p-4 md:p-6 space-y-5">
    
        <StatCardsSection data={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">

          <Card className="lg:col-span-2 border border-slate-200 shadow-none rounded-xl hover:border-indigo-300 transition-colors">
            <CardHeader className="px-5 py-4 border-b border-slate-100 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold text-slate-800">
                Recent Transactions — Today
              </CardTitle>
            <button
  onClick={() => setViewAllTransactions((prev) => !prev)}
  className="text-xs text-indigo-600 font-medium hover:underline"
>
  {viewAllTransactions ? "Show Less" : "View All Transactions"}
</button>
            </CardHeader>
   <CardContent className="p-0 overflow-x-auto">
  {transactions.length > 0 ? (
    <TransactionsTable
      data={transactions}
      viewAll={viewAllTransactions}
    />
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

            <ReminderStatusCard data={reminder} />
          </div>
        </div>

        <MonthlyCollectionTrend />

    
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TopPayingClasses />
          <PaymentModeBreakdown />
        </div>

 
      </div>
    </div>
  );
}