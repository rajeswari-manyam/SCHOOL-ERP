import { useState } from "react";
import { format } from "date-fns";
import AlertBannerStrip from "./components/AlertBannerStrip";
import SAStatCards from "./components/SAStatCards";
import ClassAttendanceTable from "./components/ClassAttendanceTable";
import FeeDuesSummaryCard from "./components/FeeDuesSummaryCard";
import WhatsAppActivityCard from "./components/WhatsAppActivityCard";
import AdmissionsPipelineCard from "./components/AdmissionsPipelineCard";
import SendBroadcastModal from "./components/SendBroadcastModal";
import { useSADashboard, useDownloadReport } from "./hooks/useSADashboard";

// ── Mock fallback data ────────────────────────────────────
const MOCK = {
  adminName: "Ramesh",
  schoolName: "Hanamkonda Public School",
  date: format(new Date(), "EEEE, d MMMM yyyy"),
  alertBanner: { unmmarkedClasses: ["8A", "9A", "10A"], count: 3 },
  stats: {
    studentsPresent: 318, studentsTotal: 342, attendanceRate: 93,
    absentCount: 24, absentClasses: 8,
    classesMarked: 12, classesTotal: 15,
    collectedThisMonth: 234000, collectionPct: 66, pendingAmount: 118000,
    admissionsThisWeek: 7, admissionsVsLastWeek: 2, admissionsPendingFollowup: 3,
  },
  classAttendance: [
    { id: "1", className: "10A", teacher: "Mrs. Lakshmi Reddy",  present: null, absent: null, status: "NOT_MARKED" as const },
    { id: "2", className: "10B", teacher: "Mr. Srikant Ch.",     present: 38,   absent: 2,    status: "MARKED" as const },
    { id: "3", className: "9A",  teacher: "Mrs. Vanaja M.",      present: null, absent: null, status: "NOT_MARKED" as const },
    { id: "4", className: "9B",  teacher: "Mr. Anand G.",        present: 35,   absent: 5,    status: "MARKED" as const },
    { id: "5", className: "8A",  teacher: "Mrs. Sharada P.",     present: null, absent: null, status: "NOT_MARKED" as const },
  ],
  feeDues: {
    totalOutstanding: 118000, paidPct: 66, pendingPct: 34,
    topDefaulters: [
      { id: "d1", name: "Ravi Teja",    initials: "RT", class: "Class 10A", amount: 14500, overdueDays: 15 },
      { id: "d2", name: "Priya Sharma", initials: "PS", class: "Class 9B",  amount: 12000, overdueDays: 10 },
      { id: "d3", name: "Kiran Kumar",  initials: "KK", class: "Class 8A",  amount: 10500, overdueDays: 5 },
    ],
  },
  waActivity: [
    { id: "wa1", type: "attendance" as const, message: "24 absence alerts sent to parents",                    time: "10:32 AM — Delivered to all recipients" },
    { id: "wa2", type: "fee" as const,        message: "Fee reminder sent to Class 10A Defaulters",            time: "09:45 AM — 12 parents notified" },
    { id: "wa3", type: "broadcast" as const,  message: 'Broadcast: "Annual Sports Day Date Finalized"',       time: "09:15 AM — 342 parents reached" },
    { id: "wa4", type: "staff" as const,      message: "Staff attendance reminder sent",                       time: "Yesterday, 06:00 PM" },
  ],
  admissionPipeline: [
    { label: "Enquiry",   key: "ENQUIRY"   as const, count: 12 },
    { label: "Interview", key: "INTERVIEW" as const, count: 4  },
    { label: "Docs",      key: "DOCS"      as const, count: 3  },
    { label: "Confirmed", key: "CONFIRMED" as const, count: 7  },
    { label: "Declined",  key: "DECLINED"  as const, count: 2  },
  ],
  requiresAction: 0,
};

const SchoolAdminDashboardPage = () => {
  const { data, isLoading }   = useSADashboard();
  const { handleDownload }    = useDownloadReport();
  const [broadcastOpen, setBroadcastOpen] = useState(false);
  const [alertDismissed, setAlertDismissed] = useState(false);

  const d = data ?? MOCK;

  return (
    <div className="flex flex-col gap-5 min-h-full">

      {/* Alert banner */}
      {!alertDismissed && d.alertBanner?.count > 0 && (
        <AlertBannerStrip banner={d.alertBanner} onDismiss={() => setAlertDismissed(true)} />
      )}

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            <span className="text-gray-900">Good morning, </span>
            <span className="text-indigo-600">{d.adminName} sir</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Here's what's happening at{" "}
            <span className="text-indigo-500 font-semibold">{d.schoolName}</span>{" "}
            today — {d.date}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download Report
          </button>
          <button
            onClick={() => setBroadcastOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.38 2 2 0 0 1 3.6 1.16h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.64a16 16 0 0 0 6 6z"/>
            </svg>
            Send Broadcast
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <SAStatCards stats={d.stats} />

      {/* Attendance table + Fee dues */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <ClassAttendanceTable rows={d.classAttendance} isLoading={isLoading} />
        </div>
        <FeeDuesSummaryCard dues={d.feeDues} />
      </div>

      {/* WA activity + Admissions pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <WhatsAppActivityCard activities={d.waActivity} />
        <AdmissionsPipelineCard stages={d.admissionPipeline} />
      </div>

      {/* Broadcast modal */}
      <SendBroadcastModal open={broadcastOpen} onClose={() => setBroadcastOpen(false)} />
    </div>
  );
};

export default SchoolAdminDashboardPage;
