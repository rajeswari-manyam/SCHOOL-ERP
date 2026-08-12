import { lazy, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AccountantLayout from "@/layouts/AccountantLayout";

// Every route below is its own lazy chunk — otherwise the very first page an
// accountant sees (the dashboard) has to wait for every other page's code
// (fees, payroll, receipts, ledger, attendance, leave, ...) to download too,
// since a static import bundles its module into the same chunk as whatever
// imports it.
const DashboardPage         = lazy(() => import("./dashboard/pages/DashboardPage"));
const FeeManagementPage     = lazy(() => import("./fees/pages/FeeManagementPage"));
const AddFeeStructurePage   = lazy(() => import("./fees/pages/AddFeeStructurePage"));
const AddFeeConcessionPage  = lazy(() => import("./fees/pages/AddFeeConcessionPage"));
const RecordFeePaymentPage  = lazy(() => import("./fees/pages/RecordFeePaymentPage"));
const AddPayrollPage        = lazy(() => import("./payroll/pages/AddPayrollPage"));
const PaySalaryPage         = lazy(() => import("./payroll/pages/PaySalaryPage"));
const ReceiptsPage          = lazy(() => import("./receipts/pages/ReceiptsPage"));
const PayrollPage           = lazy(() => import("./payroll/pages/PayrollPage"));
const LedgerPage            = lazy(() => import("./ledger/pages/LedgerPage"));
const AddExpensePage        = lazy(() => import("./ledger/pages/AddExpensePage"));
const StudentLedgerPage     = lazy(() => import("./ledger/pages/StudentLedgerPage"));
const AttendancePage        = lazy(() => import("./attendance/pages/AttendancePage"));
const LeavePage              = lazy(() => import("./leave/LeavePage"));
const ApplyLeavePage        = lazy(() => import("./leave/ApplyLeavePage"));
const ProfilePage           = lazy(() => import("./profile/pages/ProfilePage"));

// Once the dashboard is idle, quietly prefetch every other page's chunk in
// the background so clicking a sidebar link resolves instantly instead of
// showing AccountantLayout's loading fallback (see usePrefetchOtherPages in
// SuperAdminRouter for the original version of this pattern).
function usePrefetchOtherPages() {
  useEffect(() => {
    const prefetch = () => {
      import("./fees/pages/FeeManagementPage");
      import("./fees/pages/AddFeeStructurePage");
      import("./fees/pages/AddFeeConcessionPage");
      import("./fees/pages/RecordFeePaymentPage");
      import("./payroll/pages/AddPayrollPage");
      import("./payroll/pages/PaySalaryPage");
      import("./receipts/pages/ReceiptsPage");
      import("./payroll/pages/PayrollPage");
      import("./ledger/pages/LedgerPage");
      import("./ledger/pages/AddExpensePage");
      import("./ledger/pages/StudentLedgerPage");
      import("./attendance/pages/AttendancePage");
      import("./leave/LeavePage");
      import("./leave/ApplyLeavePage");
      import("./profile/pages/ProfilePage");
    };

    const w = window as Window & {
      requestIdleCallback?: (cb: () => void) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(prefetch);
      return () => w.cancelIdleCallback?.(id);
    }
    const timer = setTimeout(prefetch, 1500);
    return () => clearTimeout(timer);
  }, []);
}

export default function AccountantRouter() {
  usePrefetchOtherPages();

  return (
    <Routes>
      <Route element={<AccountantLayout />}>

        {/* Default redirect */}
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        {/* Main Pages */}
        <Route path="fees" element={<FeeManagementPage />} />
        <Route path="fees/structure/add" element={<AddFeeStructurePage />} />
        <Route path="fees/structure/edit/:id" element={<AddFeeStructurePage />} />
        <Route path="fees/concession/add" element={<AddFeeConcessionPage />} />
        <Route path="fees/concession/edit/:id" element={<AddFeeConcessionPage />} />
        <Route path="fees/payment/add" element={<RecordFeePaymentPage />} />
        <Route path="payroll/salary/add" element={<AddPayrollPage />} />
        <Route path="payroll/salary/pay/:staffId" element={<PaySalaryPage />} />
        <Route path="receipts" element={<ReceiptsPage />} />
        <Route path="payroll" element={<PayrollPage />} />
        <Route path="ledger" element={<LedgerPage />} />
        <Route path="ledger/expense/add" element={<AddExpensePage />} />
        <Route path="ledger/expense/edit/:id" element={<AddExpensePage />} />
        <Route path="student-ledger" element={<StudentLedgerPage />} />
        <Route path="attendance" element={<AttendancePage />} />
        <Route path="leave" element={<LeavePage />} />
        <Route path="leave/apply" element={<ApplyLeavePage />} />
        <Route path="profile" element={<ProfilePage />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  );
}