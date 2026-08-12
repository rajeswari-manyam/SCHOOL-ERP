import { lazy, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { SuperAdminLayout } from "@/layouts/SuperAdminLayout";

// Every route below is its own lazy chunk — otherwise the very first page a
// super admin sees (the dashboard) has to wait for every other page's code
// (schools, billing, config, whatsapp, support, marketing, audit, reports)
// to download too, since a static import bundles its module into the same
// chunk as whatever imports it.
const DashboardPage         = lazy(() => import("./dashboard/DashboardPage"));
const SchoolsPage           = lazy(() => import("./schools/SchoolsPage"));
const AddSchoolPage         = lazy(() => import("./schools/pages/AddSchoolPage"));
const BillingPage           = lazy(() => import("./billing/BillingPage").then(m => ({ default: m.BillingPage })));
const RecordPaymentPage     = lazy(() => import("./billing/pages/RecordPaymentPage"));
const SubscriptionFormPage  = lazy(() => import("./billing/pages/SubscriptionFormPage"));
const ReportsPage           = lazy(() => import("./reports/ReportsPage"));
const GenerateReportFormPage = lazy(() => import("./reports/pages/GenerateReportFormPage"));
const AuditLogsPage         = lazy(() => import("./audit-logs/AuditLogsPage"));
const WhatsAppTemplatesPage = lazy(() => import("./whatsapp-templates/WhatsAppTemplatesPage"));
const AddEditTemplatePage   = lazy(() => import("./whatsapp-templates/pages/AddEditTemplatePage"));
const SupportPage           = lazy(() => import("./support/SupportPage"));
const MarketingPage         = lazy(() => import("./marketing-team/MarketingTeamPage"));
const AddRepPage            = lazy(() => import("./marketing-team/pages/AddRepPage"));
const MarkRepAttendancePage = lazy(() => import("./marketing-team/pages/MarkRepAttendancePage"));
const PlatformConfigPage    = lazy(() => import("./platform-configure/PlatformConfigPage"));
const AddConfigTemplatePage = lazy(() => import("./platform-configure/pages/AddConfigTemplatePage"));
const AssignTemplatePage    = lazy(() => import("./platform-configure/pages/AssignTemplatePage"));

// Each sidebar link above is its own lazy chunk, so the FIRST visit to a page
// still has to wait on a fresh network fetch for that chunk — lazy-loading
// fixed the slow *initial* login, but on its own it just moves the wait to
// the first click on each page instead of removing it.
// Fix: once the dashboard is idle, quietly prefetch every other page's chunk
// in the background (same URLs `lazy()` uses, so the browser caches them).
// By the time the user actually clicks a sidebar link, the code is already
// downloaded, so the content-area Suspense in SuperAdminLayout resolves
// instantly instead of showing its fallback.
function usePrefetchOtherPages() {
  useEffect(() => {
    const prefetch = () => {
      import("./schools/SchoolsPage");
      import("./schools/pages/AddSchoolPage");
      import("./billing/BillingPage");
      import("./billing/pages/RecordPaymentPage");
      import("./billing/pages/SubscriptionFormPage");
      import("./reports/ReportsPage");
      import("./reports/pages/GenerateReportFormPage");
      import("./audit-logs/AuditLogsPage");
      import("./whatsapp-templates/WhatsAppTemplatesPage");
      import("./whatsapp-templates/pages/AddEditTemplatePage");
      import("./support/SupportPage");
      import("./marketing-team/MarketingTeamPage");
      import("./marketing-team/pages/AddRepPage");
      import("./marketing-team/pages/MarkRepAttendancePage");
      import("./platform-configure/PlatformConfigPage");
      import("./platform-configure/pages/AddConfigTemplatePage");
      import("./platform-configure/pages/AssignTemplatePage");
    };

    const w = window as Window & {
      requestIdleCallback?: (cb: () => void) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(prefetch);
      return () => w.cancelIdleCallback?.(id);
    }
    // Safari has no requestIdleCallback — fall back to a short delay so this
    // still runs after the dashboard's own chunk/data have settled.
    const timer = setTimeout(prefetch, 1500);
    return () => clearTimeout(timer);
  }, []);
}

export default function SuperAdminRouter() {
  usePrefetchOtherPages();

  return (
    <Routes>
      {/* Wrap all parent routes inside layout. SuperAdminLayout renders its
          own Suspense boundary around just the <Outlet/> — keeping it there
          (not here) means Sidebar/Topbar are outside that boundary and never
          unmount/flash when a lazy page suspends; only the content area
          swaps. */}
      <Route element={<SuperAdminLayout />}>
        {/* Default redirect */}
        <Route index element={<Navigate to="dashboard" replace />} />

        {/* Pages */}
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="schools" element={<SchoolsPage/>} />
        <Route path="schools/add" element={<AddSchoolPage />} />
        <Route path="schools/edit/:id" element={<AddSchoolPage />} />
        <Route
          path="billing"
          element={
           <BillingPage />
          }
        />
        <Route path="billing/record-payment" element={<RecordPaymentPage />} />
        <Route path="billing/plan/add" element={<SubscriptionFormPage />} />
        <Route path="billing/plan/edit" element={<SubscriptionFormPage />} />
        <Route
          path="config"
          element={
            <PlatformConfigPage />
          }
        />
        <Route path="config/templates/add" element={<AddConfigTemplatePage />} />
        <Route path="config/templates/assign" element={<AssignTemplatePage />} />
        <Route
          path="whatsapp"
          element={
<WhatsAppTemplatesPage/>
          }
        />
        <Route path="whatsapp/add" element={<AddEditTemplatePage />} />
        <Route path="whatsapp/edit" element={<AddEditTemplatePage />} />
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
        <Route path="marketing/add" element={<AddRepPage />} />
        <Route path="marketing/attendance/mark" element={<MarkRepAttendancePage />} />
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
        <Route path="reports/generate" element={<GenerateReportFormPage />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  );
}