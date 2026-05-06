import { motion } from 'framer-motion';
import { Users, CheckSquare, IndianRupee, UserPlus } from 'lucide-react';
import { cn } from '../../../../utils/cn';
import type { StatsCard } from '../types';

// ─── Icon ghost watermarks (bottom-right decorative) ──────────────────────
const iconMap = {
  users:       Users,
  check:       CheckSquare,
  rupee:       IndianRupee,
  'user-plus': UserPlus,
};

// ─── Badge pill styles — matches image green/orange/blue/red pills ─────────
const badgeVariants: Record<string, string> = {
  green:  'bg-emerald-50  text-emerald-700 border border-emerald-100',
  orange: 'bg-amber-50    text-amber-700   border border-amber-100',
  blue:   'bg-indigo-50   text-indigo-700  border border-indigo-100',
  red:    'bg-red-50      text-red-700     border border-red-100',
};

interface StatsGridProps {
  stats: StatsCard[];
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat, i) => {
        const GhostIcon = iconMap[stat.icon];

        return (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.4, ease: 'easeOut' }}
            className={cn(
              // ── White card with subtle border + hover lift ──
              'relative overflow-hidden rounded-2xl bg-white border p-5',
              'flex flex-col gap-0 min-h-[170px]',
              'shadow-[0_1px_4px_rgba(0,0,0,0.06)]',
              'transition-all duration-200 hover:shadow-[0_4px_16px_rgba(0,0,0,0.1)] hover:-translate-y-0.5',
              stat.alert
                ? 'border-amber-200 bg-amber-50/60'  // orange tint for "action needed"
                : 'border-gray-100'
            )}
          >
            {/* ── Label ─────────────────────────────────────── */}
            <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-gray-400 mb-3">
              {stat.label}
            </p>

            {/* ── Value + Badge pill ────────────────────────── */}
            <div className="flex items-start gap-2.5 mb-2.5">
              <span className="text-[28px] font-extrabold leading-none tracking-tight text-gray-900">
                {stat.value}
              </span>

              {stat.badge && (
                <span
                  className={cn(
                    'text-[10px] font-bold px-2 py-1 rounded-lg leading-tight text-center whitespace-pre-line flex-shrink-0 mt-0.5',
                    badgeVariants[stat.badge.variant]
                  )}
                >
                  {/* Multi-line badge: "93%\nRATE" or "+2 vs LW" */}
                  {stat.badge.text.replace(' ', '\n')}
                </span>
              )}
            </div>

            {/* ── Sub-text ──────────────────────────────────── */}
            <p className="text-[13px] text-gray-500 leading-snug flex-1">
              {stat.sub}
            </p>

            {/* ── Action link ───────────────────────────────── */}
            {stat.action && (
              <button className="mt-3 text-[13px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors text-left w-fit">
                {stat.action.label}
              </button>
            )}

            {/* ── Ghost watermark icon (bottom-right) ───────── */}
            <div className="absolute bottom-3 right-4 opacity-[0.07] pointer-events-none">
              <GhostIcon size={52} strokeWidth={1.5} />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}