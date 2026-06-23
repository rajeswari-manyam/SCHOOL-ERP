import { motion } from 'framer-motion';
import { Download, Radio } from 'lucide-react';
import { toast } from 'sonner';
import { useMemo, useState } from 'react';
import {
  useDashboard, useAdmissionsThisWeek, useSchoolTodayAttendance,
  useAllClassesTodayAttendance, useClassAttendanceStatus,
  useEnquiriesPipeline, useSendReminders, useActiveAcademicYear,
} from './hooks/index';
import { useSetupStatus } from './hooks/useSetupStatus';
import { AlertBanner }         from './components/AlertBanner';
import { SetupSuggestions }     from './components/SetupSuggestions';
import { StatsGrid }           from './components/StatsGrid';
import { AttendanceTable }     from './components/AttendanceTable';
import { FeesDueSummary }      from './components/FeesDueSummary';
import { WhatsAppActivityFeed } from './components/WhatsAppActivity';
import { AdmissionsPipeline }  from './components/AdmissionsPipeline';
import { DashboardSkeleton }   from './components/DashboardSkeleton';
import type { AttendanceClass, StatsCard } from './types/index';
import { useAuthStore } from '@/store/authStore';

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatDate(): string {
  return new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

export function DashboardPage() {
  const { user } = useAuthStore();
  const schoolName    = user?.name?.trim() || 'School';
  const principalName = user?.principalName?.trim();
  const greetingName  = principalName || schoolName;

  const { data, isLoading, isError }                                    = useDashboard();
  const { data: admissionsWeek,  isLoading: isAdmissionsLoading }       = useAdmissionsThisWeek();
  const { data: todayAttendance, isLoading: isAttendanceLoading }       = useSchoolTodayAttendance();
  const { data: classAttendance = [], isLoading: isClassAttendanceLoading } = useAllClassesTodayAttendance();
  const { data: classStatus }      = useClassAttendanceStatus();
  const { data: enquiriesPipeline = [] }                                = useEnquiriesPipeline();
  const { data: activeAcademicYear }                                    = useActiveAcademicYear();
  const { data: setupItems, isLoading: isSetupLoading }                  = useSetupStatus();
  const { mutate: sendReminders, isPending: isSending }                 = useSendReminders();
  const [setupDismissed, setSetupDismissed]                             = useState(false);

  const pendingSetupCount = setupItems ? setupItems.filter((i) => !i.done).length : 0;
  const showSetup = !setupDismissed && !isSetupLoading && pendingSetupCount > 0;

  const stats = useMemo<StatsCard[] | undefined>(() => {
    if (!data?.stats) return undefined;
    return data.stats.map((stat) => {
      if (stat.id === 'admissions') {
        if (admissionsWeek) return { ...stat, value: String(admissionsWeek.total), sub: `${admissionsWeek.pendingFollowUp} pending follow-up` };
        return { ...stat, value: '—', sub: 'No data', action: undefined };
      }
      if (stat.id === 'attendance') {
        if (todayAttendance) return { ...stat, value: `${todayAttendance.present}/${todayAttendance.totalStudents}`, sub: `${todayAttendance.absent} absent across ${todayAttendance.classesMarked} classes` };
        return { ...stat, value: '—', sub: 'No data', action: undefined };
      }
      if (stat.id === 'classes') {
        if (classAttendance.length > 0) {
          const marked  = classAttendance.filter((c) => c.status === 'marked').length;
          const total   = classAttendance.length;
          const pending = total - marked;
          const allMarked = pending === 0;
          return { ...stat, value: `${marked}/${total}`, sub: allMarked ? 'All classes marked today' : `${pending} class${pending === 1 ? '' : 'es'} pending`, alert: !allMarked };
        }
        if (classStatus) {
          const allMarked = classStatus.pending === 0;
          return { ...stat, value: `${classStatus.marked}/${classStatus.total}`, sub: allMarked ? 'All classes marked today' : `${classStatus.pending} class${classStatus.pending === 1 ? '' : 'es'} pending`, alert: !allMarked };
        }
        return { ...stat, value: '—', sub: 'No data', action: undefined, alert: false };
      }
      return stat;
    });
  }, [data?.stats, admissionsWeek, todayAttendance, classStatus, classAttendance]);

  const loadingStatIds = useMemo(() => {
    const ids = new Set<string>();
    if (isAdmissionsLoading)       ids.add('admissions');
    if (isAttendanceLoading)       ids.add('attendance');
    if (isClassAttendanceLoading && classAttendance.length === 0) ids.add('classes');
    return ids.size > 0 ? ids : undefined;
  }, [isAdmissionsLoading, isAttendanceLoading, isClassAttendanceLoading, classAttendance.length]);

  if (isLoading) return <DashboardSkeleton />;

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-red-500 font-semibold text-sm">Failed to load dashboard data.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 text-sm font-semibold hover:bg-indigo-100 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const attendanceClasses = classAttendance;

  const unmarkedClasses = attendanceClasses
    .filter((c: AttendanceClass) => c.status === 'not_marked')
    .map((c: AttendanceClass) => c.className);

  const handleSendReminders = () => {
    sendReminders(unmarkedClasses, {
      onSuccess: () => toast.success('WhatsApp reminders sent!', { description: `Sent to teachers of ${unmarkedClasses.join(', ')}` }),
      onError:   () => toast.error('Failed to send reminders'),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="space-y-5 pb-8"
    >
      {/* ── Setup suggestions banner ── */}
      {!setupDismissed && (
        <SetupSuggestions
          items={setupItems}
          isLoading={isSetupLoading}
          onDismiss={() => setSetupDismissed(true)}
        />
      )}

      {/* ── Dashboard content — blurred while setup is pending ── */}
      <div
        className="space-y-5 transition-all duration-500"
        style={showSetup ? { filter: 'blur(3px)', pointerEvents: 'none', userSelect: 'none' } : undefined}
      >
        {/* ── Alert ── */}
        {unmarkedClasses.length > 0 && (
          <AlertBanner classes={unmarkedClasses} onSendReminder={handleSendReminders} sending={isSending} />
        )}

        {/* ── Page header ── */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug truncate">
              {getGreeting()},{' '}
              <span className="text-indigo-600">{greetingName}</span>
            </h1>
            <p className="mt-0.5 text-xs sm:text-sm text-gray-500 line-clamp-2">
              Here's what's happening at{' '}
              <span className="font-semibold text-indigo-600">{schoolName}</span>
              {' '}today — {formatDate()}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-gray-300 bg-white text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors shadow-sm">
              <Download size={14} className="shrink-0" />
              <span className="hidden sm:inline">Download Report</span>
              <span className="sm:hidden">Download</span>
            </button>
            <button className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-indigo-600 text-white text-xs sm:text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm">
              <Radio size={14} className="shrink-0" />
              <span className="hidden sm:inline">Send Broadcast</span>
              <span className="sm:hidden">Broadcast</span>
            </button>
          </div>
        </div>

        {/* ── Stats ── */}
        <StatsGrid stats={stats ?? data.stats} loadingStatIds={loadingStatIds} />

        {/* ── Attendance + Fees ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-3">
            {isClassAttendanceLoading && attendanceClasses.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-5 w-48 rounded-lg bg-gray-100" />
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-12 w-full rounded-lg bg-gray-100" />
                  ))}
                </div>
              </div>
            ) : (
              <AttendanceTable classes={attendanceClasses} onSendReminder={handleSendReminders} />
            )}
          </div>
          <div className="lg:col-span-2">
            <FeesDueSummary
              totalOutstanding={data.feeTotalOutstanding}
              paidPercent={data.feePaidPercent}
              defaulters={data.feeDefaulters}
            />
          </div>
        </div>

        {/* ── WhatsApp + Admissions ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <WhatsAppActivityFeed activities={data.whatsappActivity} />
          <AdmissionsPipeline pipeline={enquiriesPipeline} academicYearName={activeAcademicYear?.yearName} />
        </div>
      </div>
    </motion.div>
  );
}
