import { useState } from "react";
import { ReportCard } from "../components/ReportCard";
import { GenerateReportModal } from "../components/GenarateReportModal";
import { RecentReportsTable } from "../components/ReportTable";
import { useReports } from "../hooks/useReports";

export default function ReportsPage() {
  const [open, setOpen] = useState(false);
  const { reports, generateReport } = useReports();

  const reportTypes = [
    "Monthly Fee Collection",
    "Fee Defaulters",
    "Payment Reconciliation",
    "Annual Fee Summary",
    "Payroll",
    "Income + Expense",
  ];

  return (
    <div className="space-y-6">

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reportTypes.map((r) => (
          <ReportCard
            key={r}
            title={r}
            onGenerate={() => setOpen(true)}
          />
        ))}
      </div>

      {/* Recent Reports */}
      <RecentReportsTable data={reports} />

      {/* Modal */}
      {open && (
        <GenerateReportModal
          onClose={() => setOpen(false)}
          onSubmit={() => {
            generateReport("Custom Report");
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}