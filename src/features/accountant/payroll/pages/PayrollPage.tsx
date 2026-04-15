import { useState } from "react";
import { Tabs } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { usePayroll } from "../hooks/usePayrolls";
import { PayrollTable } from "../components/PayrollTable";
import { ProcessPayrollModal } from "../components/PayrollModal";

export default function PayrollPage() {
  const [tab, setTab] = useState("monthly");
  const [open, setOpen] = useState(false);

  const { data, processPayroll } = usePayroll();

  return (
    <div className="space-y-6">

      {/* Tabs */}
      <Tabs
        items={[
          { label: "Monthly Payroll", value: "monthly" },
          { label: "Salary Config", value: "config" },
          { label: "Payroll History", value: "history" },
        ]}
        value={tab}
        onChange={setTab}
      />

      {/* Monthly Payroll */}
      {tab === "monthly" && (
        <>
          {/* Banner */}
          <div className="p-3 rounded bg-amber-100 text-amber-700">
            Payroll not processed
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={() => setOpen(true)}>
              Process Payroll
            </Button>
          </div>

          {/* Table */}
          <Card>
            <CardHeader>
              <CardTitle>Staff Payroll</CardTitle>
            </CardHeader>
            <CardContent>
              <PayrollTable data={data} onProcess={() => setOpen(true)} />
            </CardContent>
          </Card>
        </>
      )}

      {/* Other Tabs */}
      {tab === "config" && <div>Salary Config Form</div>}
      {tab === "history" && <div>Payroll History Table</div>}

      {/* Modal */}
      {open && (
        <ProcessPayrollModal
          onClose={() => setOpen(false)}
          onSubmit={() => {
            processPayroll();
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}