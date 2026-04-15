import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { FeeTabs } from "../components/FeeTabs";
import { FilterBar } from "../components/FilterBar";
import { PendingFeesTable } from "../components/PendingFeeTable";
import { TransactionsTable } from "../components/TransctionTable";
import { useFeeData } from "../hooks/useFees";

export default function FeeManagementPage() {
  const [activeTab, setActiveTab] = useState("Pending Fees");
  const { fees, transactions } = useFeeData();

  return (
    <div className="space-y-6">

      {/* Top Actions */}
      <div className="flex gap-3 flex-wrap">
        <Button>Record Payment</Button>
        <Button variant="outline">Send All Overdue</Button>
        <Button variant="outline">Send Due Today</Button>
      </div>

      {/* Tabs */}
      <FeeTabs active={activeTab} setActive={setActiveTab} />

      {/* Filters */}
      <FilterBar />

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle>{activeTab}</CardTitle>
        </CardHeader>

        <CardContent>
          {activeTab === "Pending Fees" && (
            <PendingFeesTable data={fees} />
          )}

          {activeTab === "All Transactions" && (
            <TransactionsTable data={transactions} />
          )}

          {activeTab === "Fee Structure" && <div>Fee Structure UI</div>}
          {activeTab === "Transport Fees" && <div>Transport UI</div>}
          {activeTab === "Concessions" && <div>Concessions UI</div>}
        </CardContent>
      </Card>
    </div>
  );
}