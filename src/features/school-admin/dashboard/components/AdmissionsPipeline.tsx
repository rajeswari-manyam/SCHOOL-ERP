import { motion } from 'framer-motion';
import {
  UserPlus,
  ClipboardCheck,
  Receipt,
  Megaphone,
  Search,
  Table2,
} from 'lucide-react';

import { cn } from '../../../../utils/cn';
import type { AdmissionStage } from '../types';

interface AdmissionsPipelineProps {
  pipeline: AdmissionStage[];
}

// ─── Quick actions ───────────────────────────────────────────────
const quickActions = [
  { id: 'add-student', label: 'ADD STUDENT', icon: UserPlus },
  { id: 'attendance', label: 'ATTENDANCE', icon: ClipboardCheck },
  { id: 'fee-payment', label: 'FEE PAYMENT', icon: Receipt },
  { id: 'broadcast', label: 'SEND BROADCAST', icon: Megaphone },
  { id: 'enquiry', label: 'ADD ENQUIRY', icon: Search },
  { id: 'report', label: 'GEN. REPORT', icon: Table2 },
];

export function AdmissionsPipeline({ pipeline }: AdmissionsPipelineProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 flex flex-col gap-4 sm:gap-5">

      {/* ── Title ────────────────────────────────────────────── */}
      <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
        Admissions Pipeline &amp; Quick Actions
      </h2>

      {/* ── Pipeline ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-2.5">
        {pipeline.map((stage, i) => (
          <motion.div
            key={stage.stage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 + i * 0.06, duration: 0.35 }}
            className={cn(
              'relative flex flex-col items-center justify-center min-h-[72px] sm:min-h-[90px]',
              'pt-3 pb-3 px-2 rounded-xl text-center overflow-hidden',
              'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px] after:rounded-b-xl',

              // Default
              !stage.highlight &&
                !stage.danger &&
                'bg-[#f0f1fa] after:bg-transparent',

              // Active
              stage.active &&
                'bg-[#f0f1fa] after:bg-indigo-500',

              // Success
              stage.highlight &&
                'bg-emerald-50 after:bg-emerald-500',

              // Danger
              stage.danger &&
                'bg-red-50 after:bg-red-500'
            )}
          >
            {/* Label */}
            <p
              className={cn(
                'text-[9px] sm:text-[10px] md:text-xs font-bold tracking-[0.07em] uppercase mb-1 sm:mb-2',
                stage.highlight
                  ? 'text-emerald-700'
                  : stage.danger
                  ? 'text-red-600'
                  : stage.active
                  ? 'text-indigo-600'
                  : 'text-gray-400'
              )}
            >
              {stage.stage}
            </p>

            {/* Count */}
            <p
              className={cn(
                'text-xl sm:text-2xl md:text-[28px] font-extrabold leading-none tracking-tight',
                stage.highlight
                  ? 'text-emerald-700'
                  : stage.danger
                  ? 'text-red-600'
                  : 'text-gray-900'
              )}
            >
              {stage.count}
            </p>
          </motion.div>
        ))}
      </div>

      {/* ── Quick Actions ───────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
        {quickActions.map((action, i) => {
          const Icon = action.icon;

          return (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.05, duration: 0.3 }}
              className={cn(
                'flex flex-col items-center justify-center',
                'gap-2 sm:gap-3 py-4 sm:py-5 px-2 sm:px-3',
                'rounded-xl sm:rounded-2xl',
                'bg-indigo-50 hover:bg-indigo-100',
                'active:scale-[0.97]',
                'transition-all duration-150 cursor-pointer group'
              )}
            >
              {/* Icon */}
              <Icon
                className="w-5 h-5 sm:w-6 sm:h-6 md:w-[26px] md:h-[26px] text-indigo-950 transition-transform duration-150 group-hover:scale-110"
                strokeWidth={1.75}
              />

              {/* Label */}
              <span className="text-[9px] sm:text-[10px] md:text-xs font-black tracking-[0.07em] uppercase text-indigo-950 text-center leading-tight">
                {action.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}