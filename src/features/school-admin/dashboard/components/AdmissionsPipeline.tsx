import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search, MessageCircle, FileText, CheckCircle, XCircle,
  UserPlus, ClipboardCheck, Receipt, Megaphone, Table2, Calendar,
} from 'lucide-react';
import type { AdmissionStage } from '../types';

interface AdmissionsPipelineProps {
  pipeline: AdmissionStage[];
  academicYearName?: string;
}

const stageConfig = [
  { key: 'ENQUIRY',   label: 'Enquiry',   bg: 'bg-blue-500',    icon: Search,        text: 'text-blue-50'   },
  { key: 'INTERVIEW', label: 'Interview', bg: 'bg-purple-500',  icon: MessageCircle, text: 'text-purple-50' },
  { key: 'DOCS',      label: 'Documents', bg: 'bg-orange-500',  icon: FileText,      text: 'text-orange-50' },
  { key: 'CONFIRMED', label: 'Confirmed', bg: 'bg-emerald-500', icon: CheckCircle,   text: 'text-emerald-50'},
  { key: 'DECLINED',  label: 'Declined',  bg: 'bg-red-500',     icon: XCircle,       text: 'text-red-50'    },
];

const quickActions = [
  { id: 'add-student', label: 'Add Student',  icon: UserPlus,       path: '/schooladmin/students'   },
  { id: 'attendance',  label: 'Attendance',   icon: ClipboardCheck, path: '/schooladmin/attendance' },
  { id: 'fee-payment', label: 'Fee Payment',  icon: Receipt,        path: '/schooladmin/fees'       },
  { id: 'broadcast',   label: 'Broadcast',    icon: Megaphone,      path: '/schooladmin/settings'   },
  { id: 'enquiry',     label: 'Add Enquiry',  icon: Search,         path: '/schooladmin/admissions' },
  { id: 'report',      label: 'Gen. Report',  icon: Table2,         path: '/schooladmin/reports'    },
];

export function AdmissionsPipeline({ pipeline, academicYearName }: AdmissionsPipelineProps) {
  const navigate = useNavigate();

  const stageCountMap = pipeline.reduce<Record<string, number>>((acc, s) => {
    acc[s.stage] = s.count;
    return acc;
  }, {});

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 flex flex-col gap-5">

      {/* ── Admissions Pipeline header ── */}
      <div>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-sm sm:text-base font-bold text-gray-900">Admissions Pipeline</h2>
          {academicYearName && (
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 border border-indigo-100 px-2.5 py-1 text-[10px] font-semibold text-indigo-600">
              <Calendar size={10} />
              AY {academicYearName}
            </span>
          )}
        </div>
        <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">Track enquiries through each stage</p>
      </div>

      {/* ── Stage cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {stageConfig.map((stage, i) => {
          const count = stageCountMap[stage.key] ?? 0;
          const Icon  = stage.icon;
          return (
            <motion.div
              key={stage.key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.28 }}
              className={`${stage.bg} rounded-xl p-3.5 sm:p-4 flex items-center justify-between hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer`}
            >
              <div>
                <p className={`text-2xl sm:text-3xl font-black leading-none ${stage.text} tabular-nums`}>{count}</p>
                <p className={`text-[11px] sm:text-xs font-semibold mt-1 ${stage.text} opacity-90`}>{stage.label}</p>
              </div>
              <Icon className={`h-6 w-6 sm:h-7 sm:w-7 ${stage.text} opacity-70 shrink-0`} strokeWidth={1.75} />
            </motion.div>
          );
        })}
      </div>

      {/* ── Quick Actions header ── */}
      <div>
        <h2 className="text-sm sm:text-base font-bold text-gray-900">Quick Actions</h2>
        <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">Common tasks at your fingertips</p>
      </div>

      {/* ── Quick Action buttons ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {quickActions.map((action, i) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 + i * 0.04, duration: 0.25 }}
              onClick={() => navigate(action.path)}
              className="bg-gray-50 hover:bg-indigo-50 border border-gray-100 hover:border-indigo-200 rounded-xl p-3 flex flex-col items-center gap-1.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm cursor-pointer"
              aria-label={action.label}
            >
              <Icon className="h-5 w-5 text-gray-600" strokeWidth={1.75} />
              <span className="text-[11px] font-semibold text-gray-700">{action.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
