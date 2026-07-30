import { Routes, Route, Navigate } from "react-router-dom";

import DashboardPage from "./dashboard/pages/DashboardPage"
import AccountantLayout from "@/layouts/AccountantLayout";
import FeeManagementPage from "./fees/pages/FeeManagementPage";
import ReceiptsPage from "./receipts/pages/ReceiptsPage";
import PayrollPage from "./payroll/pages/PayrollPage";
import LedgerPage from "./ledger/pages/LedgerPage";
import StudentLedgerPage from "./ledger/pages/StudentLedgerPage";
import AttendancePage from "./attendance/pages/AttendancePage";
import LeavePage from "./leave/LeavePage";

export default function AccountantRouter() {
  return (
    <Routes>
      <Route element={<AccountantLayout />}>

        {/* Default redirect */}
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        {/* Main Pages */}
        <Route path="fees" element={<FeeManagementPage />} />
        <Route path="receipts" element={<ReceiptsPage />} />
        <Route path="payroll" element={<PayrollPage />} />
        <Route path="ledger" element={<LedgerPage />} />
        <Route path="student-ledger" element={<StudentLedgerPage />} />
        <Route path="attendance" element={<AttendancePage />} />
        <Route path="leave" element={<LeavePage />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  );
}