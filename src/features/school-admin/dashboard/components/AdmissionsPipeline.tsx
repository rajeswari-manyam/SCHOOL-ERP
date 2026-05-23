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

type AdmissionStageWithActive = AdmissionStage & { active?: boolean };

interface AdmissionsPipelineProps {
  pipeline: AdmissionStageWithActive[];
}

const quickActions = [
  { id: 'add-student', label: 'Add Student',    icon: UserPlus       },
  { id: 'attendance',  label: 'Attendance',     icon: ClipboardCheck },
  { id: 'fee-payment', label: 'Fee Payment',    icon: Receipt        },
  { id: 'broadcast',   label: 'Broadcast',      icon: Megaphone      },
  { id: 'enquiry',     label: 'Add Enquiry',    icon: Search         },
  { id: 'report',      label: 'Gen. Report',    icon: Table2         },
];

export function AdmissionsPipeline({ pipeline }: AdmissionsPipelineProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:gap-5 sm:p-5 md:p-6">

      {/* ── Title ── */}
      <h2 className="text-base font-extrabold tracking-tight text-gray-900 sm:text-lg md:text-xl lg:text-2xl">
        Admissions Pipeline &amp; Quick Actions
      </h2>

      {/* ── Pipeline stages ──
          Mobile:  2 cols
          sm:      3 cols
          lg:      all stages in one row (auto-fit)
      ── */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-2.5 lg:grid-cols-5">
        {pipeline.map((stage, i) => (
          <motion.div
            key={stage.stage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 + i * 0.06, duration: 0.35 }}
            className={cn(
              // Layout
              'relative flex flex-col items-center justify-center overflow-hidden rounded-xl px-2 text-center',
              // Height — shorter on mobile
              'min-h-[64px] sm:min-h-[80px] md:min-h-[90px]',
              'py-2.5 sm:py-3',
              // Bottom accent bar
              'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px] after:rounded-b-xl',
              // Variants
              !stage.highlight && !stage.danger && 'bg-[#f0f1fa] after:bg-transparent',
              stage.active     && 'bg-[#f0f1fa] after:bg-indigo-500',
              stage.highlight  && 'bg-emerald-50 after:bg-emerald-500',
              stage.danger     && 'bg-red-50 after:bg-red-500',
            )}
          >
            {/* Stage label */}
            <p
              className={cn(
                'mb-1 text-[8px] font-bold uppercase tracking-[0.07em] sm:mb-1.5 sm:text-[9px] md:text-[10px] lg:text-xs',
                stage.highlight ? 'text-emerald-700'
                  : stage.danger  ? 'text-red-600'
                  : stage.active  ? 'text-indigo-600'
                  : 'text-gray-400',
              )}
            >
              {stage.stage}
            </p>

            {/* Count */}
            <p
              className={cn(
                'text-lg font-extrabold leading-none tracking-tight sm:text-2xl md:text-[28px]',
                stage.highlight ? 'text-emerald-700'
                  : stage.danger  ? 'text-red-600'
                  : 'text-gray-900',
              )}
            >
              {stage.count}
            </p>
          </motion.div>
        ))}
      </div>

      {/* ── Quick Actions ──
          Mobile:  2 cols, compact
          sm:      3 cols
          lg:      6 cols — one full row
      ── */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-2.5 lg:grid-cols-6 lg:gap-3">
        {quickActions.map((action, i) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.05, duration: 0.3 }}
              className={cn(
                'group flex flex-col items-center justify-center',
                'gap-1.5 sm:gap-2 md:gap-2.5',
                // Height — smaller on mobile
                'py-3 sm:py-4 md:py-5',
                'px-2',
                'cursor-pointer rounded-xl transition-all duration-150',
                'bg-indigo-50 hover:bg-indigo-100 active:scale-[0.97]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400',
              )}
              aria-label={action.label}
            >
              {/* Icon — scales up progressively */}
              <Icon
                className="h-4 w-4 text-indigo-950 transition-transform duration-150 group-hover:scale-110 sm:h-5 sm:w-5 md:h-[22px] md:w-[22px] lg:h-6 lg:w-6"
                strokeWidth={1.75}
              />

              {/* Label — readable at every size, no ALL-CAPS on mobile */}
              <span className="text-center text-[9px] font-black leading-tight tracking-wide text-indigo-950 sm:text-[10px] sm:tracking-[0.06em] md:text-[11px] lg:text-xs lg:tracking-[0.07em]">
                {action.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}