import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search, MessageCircle, FileText, CheckCircle, XCircle,
  UserPlus, ClipboardCheck, Receipt, Megaphone, Table2, Calendar,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { AdmissionStage } from '../types';

interface AdmissionsPipelineProps {
  pipeline: AdmissionStage[];
  academicYearName?: string;
  /** Show shimmer in the pipeline card while the enquiries API resolves. */
  isLoading?: boolean;
}

const stageConfig = [
  { key: 'ENQUIRY',   label: 'Enquiry',   icon: Search,        accent: 'text-blue-600'   },
  { key: 'INTERVIEW', label: 'Interview', icon: MessageCircle, accent: 'text-purple-600' },
  { key: 'DOCS',      label: 'Documents', icon: FileText,      accent: 'text-orange-600' },
  { key: 'CONFIRMED', label: 'Confirmed', icon: CheckCircle,   accent: 'text-emerald-600'},
  { key: 'DECLINED',  label: 'Declined',  icon: XCircle,       accent: 'text-red-500'    },
];

const quickActions = [
  { id: 'add-student', label: 'Add Student',  icon: UserPlus,       path: '/schooladmin/students'   },
  { id: 'attendance',  label: 'Attendance',   icon: ClipboardCheck, path: '/schooladmin/attendance' },
  { id: 'fee-payment', label: 'Fee Payment',  icon: Receipt,        path: '/schooladmin/fees'       },
  { id: 'broadcast',   label: 'Broadcast',    icon: Megaphone,      path: '/schooladmin/settings'   },
  { id: 'enquiry',     label: 'Add Enquiry',  icon: Search,         path: '/schooladmin/admissions' },
  { id: 'report',      label: 'Gen. Report',  icon: Table2,         path: '/schooladmin/reports'    },
];

export function AdmissionsPipeline({ pipeline, academicYearName, isLoading = false }: AdmissionsPipelineProps) {
  const navigate = useNavigate();

  const stageCountMap = pipeline.reduce<Record<string, number>>((acc, s) => {
    acc[s.stage] = s.count;
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
      {/* ── Quick Actions card ── */}
      <div className="rounded-xl border border-gray-100 shadow-sm p-3 sm:p-4 flex flex-col gap-3 bg-white">
        <div>
          <h2 className="text-xs font-medium text-gray-700">Quick Actions</h2>
          <p className="text-[10px] text-gray-500 mt-0.5">Common tasks at your fingertips</p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.25 }}
                onClick={() => navigate(action.path)}
                className="hover:bg-indigo-50 border border-gray-100 hover:border-indigo-200 rounded-lg p-2.5 flex flex-col items-center gap-1 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm cursor-pointer"
                style={{ background: '#EEF2FF' }}
                aria-label={action.label}
              >
                <Icon className="h-4 w-4 text-indigo-500" strokeWidth={1.75} />
                <span className="text-[10px] text-gray-600">{action.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ── Admissions Pipeline card ── */}
      <div className="rounded-xl border border-gray-100 shadow-sm p-3 sm:p-4 flex flex-col gap-3 bg-white">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-xs font-medium text-gray-700">Admissions Pipeline</h2>
            <p className="text-[10px] text-gray-500 mt-0.5">Track enquiries through each stage</p>
          </div>
          {academicYearName && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white border border-gray-200 px-2 py-0.5 text-[9px] text-indigo-600">
              <Calendar size={9} />
              AY {academicYearName}
            </span>
          )}
        </div>

        {/* ── Stage cards ── */}
        <div className="grid grid-cols-3 gap-2">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="rounded-lg p-2.5 space-y-2 border border-gray-100">
                  <Skeleton className="h-4 w-8" />
                  <Skeleton className="h-2.5 w-12" />
                </div>
              ))
            : stageConfig.map((stage, i) => {
              const count = stageCountMap[stage.key] ?? 0;
              const Icon  = stage.icon;
              return (
                <motion.div
                  key={stage.key}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.28 }}
                  className="rounded-lg p-2.5 flex items-center justify-between border border-gray-100 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200 cursor-pointer"
                  style={{ background: '#EEF2FF' }}
                >
                  <div>
                    <p className="text-base font-semibold leading-none text-gray-900 tabular-nums">{count}</p>
                    <p className={`text-[10px] mt-0.5 ${stage.accent}`}>{stage.label}</p>
                  </div>
                  <Icon className={`h-4 w-4 ${stage.accent} opacity-80 shrink-0`} strokeWidth={1.75} />
                </motion.div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
