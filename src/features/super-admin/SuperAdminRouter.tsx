import { Routes, Route, Navigate } from "react-router-dom";
import DashboardPage from "./dashboard/DashboardPage";
import SchoolsPage from "./schools/SchoolsPage";
import { BillingPage } from "./billing/BillingPage";
import ReportsPage from "./reports/ReportsPage";
import { SuperAdminLayout } from "@/layouts/SuperAdminLayout";
import AuditLogsPage  from "./audit-logs/AuditLogsPage";
import WhatsAppTemplatesPage from "./whatsapp-templates/WhatsAppTemplatesPage";
import  SupportPage  from "./support/SupportPage";
import  MarketingPage  from "./marketing-team/MarketingTeamPage";
import PlatformConfigPage  from "./platform-configure/PlatformConfigPage";
export default function SuperAdminRouter() {
  return (
    <Routes>
      {/* Wrap all parent routes inside layout */}
      <Route element={<SuperAdminLayout />}>
        {/* Default redirect */}
        <Route index element={<Navigate to="dashboard" replace />} />

        {/* Pages */}
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="schools" element={<SchoolsPage/>} />
        <Route
          path="billing"
          element={
           <BillingPage />
          }
        />
        <Route
          path="config"
          element={
            <PlatformConfigPage />
          }
        />
        <Route
          path="whatsapp"
          element={
<WhatsAppTemplatesPage/>
          }
        />
        <Route
          path="support"
          element={
<SupportPage />
          }
        />
        <Route
          path="marketing"
          element={
<MarketingPage />
          }
        />
        <Route
          path="audit"
          element={
<AuditLogsPage />
          }
        />
        <Route
          path="reports"
          element={
            <ReportsPage />
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  );
}