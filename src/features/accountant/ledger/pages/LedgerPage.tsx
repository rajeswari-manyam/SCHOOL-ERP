import { useState } from "react";
import { Tabs } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

import { useLedger } from "../hooks/useledger";
import { LedgerTable } from "../components/LedgerTable";
import { AddExpenseModal } from "../components/AddExpenseModal";
import { BalanceSummary } from "../components/BalanceSummary";

export default function LedgerPage() {
  const [tab, setTab] = useState("income");
  const [open, setOpen] = useState(false);

 const { entries, addExpense } = useLedger();

  const income = entries
    .filter((e) => e.type === "Income")
    .reduce((a, b) => a + b.amount, 0);

  const expense = entries
    .filter((e) => e.type === "Expense")
    .reduce((a, b) => a + b.amount, 0);

  return (
    <div className="space-y-6">

      {/* Tabs */}
      <Tabs
        items={[
          { label: "Income", value: "income" },
          { label: "Expenses", value: "expenses" },
          { label: "Balance Sheet", value: "balance" },
          { label: "Petty Cash", value: "petty" },
        ]}
        value={tab}
        onChange={setTab}
      />

      {/* Actions */}
      <div className="flex gap-3">
        <Button onClick={() => setOpen(true)}>Add Expense</Button>
        <Button variant="outline">Export Ledger</Button>
      </div>

      {/* Content */}
      {tab === "income" && (
        <LedgerTable data={entries.filter(e => e.type === "Income")} />
      )}

      {tab === "expenses" && (
        <LedgerTable data={entries.filter(e => e.type === "Expense")} />
      )}

      {tab === "balance" && (
        <BalanceSummary income={income} expense={expense} />
      )}

      {tab === "petty" && <div>Petty Cash UI</div>}

      {/* Modal */}
      {open && (
        <AddExpenseModal
          onClose={() => setOpen(false)}
          onAdd={addExpense}
        />
      )}
    </div>
  );
}