import { motion } from 'framer-motion';
import { Download, Radio } from 'lucide-react';
import { toast } from 'sonner';
import { useMemo, useState, useEffect, useCallback } from 'react';
import {
  useDashboard, useAdmissionsThisWeek, useSchoolTodayAttendance,
  useAllClassesTodayAttendance, useClassAttendanceStatus,
  useEnquiriesPipeline, useSendReminders, useActiveAcademicYear, useFeeSummary,
  usePendingLeaves,
} from './hooks/index';
import { useSetupStatus, useWizardState } from './hooks/useSetupStatus';
import { AlertBanner }   from './components/AlertBanner';
import { SetupWizard }   from './components/SetupWizard';
import { StatsGrid }           from './components/StatsGrid';
import { AttendanceTable }     from './components/AttendanceTable';
import { FeesDueSummary }      from './components/FeesDueSummary';
import { PendingFeesModal }    from './components/PendingFeesModal';
import { AdmissionsPipeline }  from './components/AdmissionsPipeline';
import { PendingLeavesCard }   from './components/PendingLeavesCard';
import { DashboardSkeleton }   from './components/DashboardSkeleton';
import type { AttendanceClass, StatsCard } from './types/index';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';

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
  const { data: setupData, isLoading: isSetupLoading }                   = useSetupStatus();
  const setupItems                                                        = setupData?.items;
  const wizardState                                                       = useWizardState(setupItems);
  const { mutate: sendReminders, isPending: isSending }                 = useSendReminders();
  const { data: feeSummary }                                            = useFeeSummary();
  const { data: pendingLeaves = [], isLoading: isPendingLeavesLoading } = usePendingLeaves();
  const wizardDismissed    = useUIStore((s) => s.wizardDismissed);
  const setWizardDismissed = useUIStore((s) => s.setWizardDismissed);
  const [showPendingModal, setShowPendingModal] = useState(false);

  const allSetupDone = setupItems ? setupItems.every((i) => i.done) : false;
  const showSetup    = !wizardDismissed && !isSetupLoading && !allSetupDone;

  // When all steps complete, clear dismissed flag so wizard shows the celebration screen once
  useEffect(() => {
    if (allSetupDone && wizardDismissed) {
      setWizardDismissed(false);
    }
  }, [allSetupDone, wizardDismissed, setWizardDismissed]);

  const handleDismiss = useCallback(() => {
    setWizardDismissed(true);
  }, [setWizardDismissed]);

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
      if (stat.id === 'fees') {
        if (feeSummary) {
          const formatted = `₹${feeSummary.month_collection.toLocaleString('en-IN')}`;
          return { ...stat, value: formatted, sub: `₹${feeSummary.collected_today.toLocaleString('en-IN')} collected today` };
        }
        return { ...stat, value: '—', sub: 'No data' };
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
  }, [data?.stats, admissionsWeek, todayAttendance, classStatus, classAttendance, feeSummary]);

  const loadingStatIds = useMemo(() => {
    const ids = new Set<string>();
    if (isAdmissionsLoading)       ids.add('admissions');
    if (isAttendanceLoading)       ids.add('attendance');
    if (isClassAttendanceLoading && classAttendance.length === 0) ids.add('classes');
    return ids.size > 0 ? ids : undefined;
  }, [isAdmissionsLoading, isAttendanceLoading, isClassAttendanceLoading, classAttendance.length]);

  // Show wizard (full-page replacement) while setup is pending
  if (showSetup) {
    return (
      <SetupWizard
        items={wizardState.items}
        isLoading={isSetupLoading}
        onDismiss={handleDismiss}
      />
    );
  }

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
    <>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="space-y-5 pb-8"
    >
      <div className="space-y-5">
        {/* ── Alert ── */}
        {unmarkedClasses.length > 0 && (
          <AlertBanner classes={unmarkedClasses} onSendReminder={handleSendReminders} sending={isSending} />
        )}

        {/* ── Page header ── */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="text-base font-semibold text-gray-900 leading-snug truncate">
              {getGreeting()},{' '}
              <span className="text-indigo-600">{greetingName}</span>
            </h1>
            <p className="mt-0.5 text-[10px] sm:text-[11px] text-gray-500 line-clamp-2">
              Here's what's happening at{' '}
              <span className="font-medium text-indigo-600">{schoolName}</span>
              {' '}today — {formatDate()}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-xs text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors shadow-sm">
              <Download size={12} className="shrink-0" />
              <span className="hidden sm:inline">Download Report</span>
              <span className="sm:hidden">Download</span>
            </button>
            <button className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs hover:bg-indigo-700 transition-colors shadow-sm">
              <Radio size={12} className="shrink-0" />
              <span className="hidden sm:inline">Send Broadcast</span>
              <span className="sm:hidden">Broadcast</span>
            </button>
          </div>
        </div>

        {/* ── Pending Leave Requests — only shown when there are pending leaves ── */}
        {(isPendingLeavesLoading || pendingLeaves.length > 0) && (
          <PendingLeavesCard leaves={pendingLeaves} isLoading={isPendingLeavesLoading} />
        )}

        {/* ── Stats ── */}
        <StatsGrid stats={stats ?? data.stats} loadingStatIds={loadingStatIds} />

        {/* ── Row 1: Attendance + Fee ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div>
            {isClassAttendanceLoading && attendanceClasses.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 w-40 rounded-lg bg-gray-100" />
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-8 w-full rounded-lg bg-gray-100" />
                  ))}
                </div>
              </div>
            ) : (
              <AttendanceTable classes={attendanceClasses} onSendReminder={handleSendReminders} />
            )}
          </div>
          <div>
            <FeesDueSummary
              totalOutstanding={feeSummary?.total_pending_fees ?? data.feeTotalOutstanding}
              feeCollected={feeSummary?.fee_collection ?? 0}
              paidPercent={data.feePaidPercent}
              defaulters={data.feeDefaulters}
              onViewAll={() => setShowPendingModal(true)}
            />
          </div>
        </div>

        {/* ── Row 2: Quick Actions + Admissions Pipeline ── */}
        <AdmissionsPipeline pipeline={enquiriesPipeline} academicYearName={activeAcademicYear?.yearName} />
      </div>
    </motion.div>

    {showPendingModal && (
      <PendingFeesModal onClose={() => setShowPendingModal(false)} />
    )}
    </>
  );
}
