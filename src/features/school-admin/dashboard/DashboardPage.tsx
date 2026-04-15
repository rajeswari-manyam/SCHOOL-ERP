import { StatCard } from "../../../components/ui/statcard";
import { useRealtimeDashboard } from "./hooks/useRealtimeDashboard";

import {
  AbsentCountCard,
  ClassesMarkedCard,
  FeeCollectionCard,
  AdmissionsThisWeekCard,
} from "./components/AbsentCountCard.tsx";
import { AttendanceSummaryCard } from "./components/AttendanceSummaryCard.tsx";
import { FeeDuesCard } from "./components/FeeDuesCard.tsx";
import { WeeklySummaryStrip } from "./components/WeeklySummaryStrip.tsx";
import { AlertsFeed } from "./components/AlertsFeed.tsx";

export default function DashboardPage() {
  const {
    data,
    isLoading,
    error,
    triggerAttendanceReminder,
  } = useRealtimeDashboard();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-400 text-sm">
        Loading dashboard…
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-500 text-sm">
        {error ?? "Something went wrong."}
      </div>
    );
  }

  const { attendance, fees, admissions, whatsappActivity } = data;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Replace 'students' with the correct field from DashboardData, e.g. admissions.total */}
<StatCard label="Total Students" value={attendance?.total ?? 0} />
<StatCard label="Attendance %" value={attendance?.classCount ?? 0} />
        <StatCard label="Fees Collected" value={fees?.collected ?? 0} />
        <StatCard label="Defaulters" value={fees?.defaulters?.length ?? 0} />
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <AbsentCountCard attendance={attendance} />
        <ClassesMarkedCard
          attendance={attendance}
          onSendReminder={triggerAttendanceReminder}
        />
        <FeeCollectionCard fees={fees} />
        <AdmissionsThisWeekCard admissions={admissions} />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <AttendanceSummaryCard
          attendance={attendance}
          onSendReminder={triggerAttendanceReminder}
        />
        <FeeDuesCard fees={fees} onViewDefaulters={() => {}} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <AlertsFeed activities={whatsappActivity} />
        <WeeklySummaryStrip admissions={admissions} />
      </div>

      <button className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 text-white text-xl shadow-lg flex items-center justify-center transition">
        💬
      </button>
    </div>
  );
}