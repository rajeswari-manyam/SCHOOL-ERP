import { motion } from 'framer-motion';
import { Download, Radio } from 'lucide-react';
import { toast } from 'sonner';
import { useDashboard, useSendReminders } from './hooks/index';
import { AlertBanner } from './components/AlertBanner';
import { StatsGrid } from './components/StatsGrid';
import { AttendanceTable } from './components/AttendanceTable';
import { FeesDueSummary } from './components/FeesDueSummary';
import { WhatsAppActivityFeed } from './components/WhatsAppActivity';
import { AdmissionsPipeline } from './components/AdmissionsPipeline';
import { DashboardSkeleton } from './components/DashboardSkeleton';
import type { AttendanceClass } from './types/index';
import {Button} from '../../../components/ui/button';
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
  const { data, isLoading, isError } = useDashboard();
  const { mutate: sendReminders, isPending: isSending } = useSendReminders();

  if (isLoading) return <DashboardSkeleton />;

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-red-400 font-semibold">Failed to load dashboard data.</p>
        <button onClick={() => window.location.reload()}
          className="px-4 py-2 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-semibold hover:bg-brand-500/20 transition-colors">
          Retry
        </button>
      </div>
    );
  }

  const unmarkedClasses = data.attendanceClasses
    .filter((c: AttendanceClass) => c.status === 'not_marked')
    .map((c: AttendanceClass) => c.className);

  const handleSendReminders = () => {
    sendReminders(unmarkedClasses, {
      onSuccess: () => toast.success('WhatsApp reminders sent!', { description: `Sent to teachers of ${unmarkedClasses.join(', ')}` }),
      onError: ()  => toast.error('Failed to send reminders'),
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="space-y-4 sm:space-y-5 pb-8">
      {unmarkedClasses.length > 0 && (
        <AlertBanner classes={unmarkedClasses} onSendReminder={handleSendReminders} sending={isSending} />
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white truncate">
            {getGreeting()},{' '}
            <span className="bg-gradient-to-r from-brand-400 to-purple-400 bg-clip-text text-transparent">Ramesh sir</span>
          </h1>
          <p className="text-subtle text-xs sm:text-sm mt-1 sm:mt-0.5 line-clamp-2">
            Here's what's happening at{' '}
            <span className="text-brand-400 font-medium">Hanamkonda Public School</span>
            {' '}today — {formatDate()}
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0 w-full sm:w-auto">
          <Button className="flex-1 sm:flex-none flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border border-gray-300 bg-white text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors shadow-sm disabled:opacity-60">
            <Download size={14} className="sm:w-4 sm:h-4 w-3 h-3" /> <span className="hidden sm:inline">Download Report</span><span className="sm:hidden">Download</span>
          </Button>
          <Button className="flex-1 sm:flex-none flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-indigo-600 text-white text-xs sm:text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm">
            <Radio size={14} className="sm:w-4 sm:h-4 w-3 h-3" /> <span className="hidden sm:inline">Send Broadcast</span><span className="sm:hidden">Broadcast</span>
          </Button>
        </div>
      </div>

      <StatsGrid stats={data.stats} />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="lg:col-span-3">
          <AttendanceTable classes={data.attendanceClasses} onSendReminder={handleSendReminders} />
        </div>
        <div className="lg:col-span-2">
          <FeesDueSummary totalOutstanding={data.feeTotalOutstanding} paidPercent={data.feePaidPercent} defaulters={data.feeDefaulters} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        <WhatsAppActivityFeed activities={data.whatsappActivity} />
        <AdmissionsPipeline pipeline={data.admissionPipeline} />
      </div>
    </motion.div>
  );
}
