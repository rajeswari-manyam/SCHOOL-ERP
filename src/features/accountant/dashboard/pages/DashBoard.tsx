import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { useDashboardData } from "../hooks/useDashboard";
import { StatCardsSection } from "../components/StatCard";
import { TransactionsTable } from "../components/TransactionTable";
import { PaymentModeTable } from "../components/PaymentMethodTable";
import { ReminderStatusCard } from "../components/RemainderStatus";

export default function DashboardPage() {
  const { stats, transactions, paymentModes, reminder } =
    useDashboardData();

  return (
    <div className="space-y-6 p-4">

      {/* Actions */}
      <div className="flex flex-wrap justify-end gap-3">
        <Button>Record Payment</Button>
        <Button variant="outline">Generate Report</Button>
      </div>

      {/* Stats */}
      <StatCardsSection data={stats} />

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            {transactions.length > 0 ? (
              <TransactionsTable data={transactions} />
            ) : (
              <p className="text-gray-500 text-center py-4">
                No transactions found
              </p>
            )}
          </CardContent>
        </Card>

        {/* Payment Mode */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Mode</CardTitle>
          </CardHeader>
          <CardContent>
            {paymentModes.length > 0 ? (
              <PaymentModeTable data={paymentModes} />
            ) : (
              <p className="text-gray-500 text-center py-4">
                No data available
              </p>
            )}
          </CardContent>
        </Card>

      </div>

      {/* Reminder */}
      <ReminderStatusCard data={reminder} />

    </div>
  );
}