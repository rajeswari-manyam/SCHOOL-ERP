import { motion } from 'framer-motion';
import { Users, CheckSquare, IndianRupee, UserPlus } from 'lucide-react';
import { cn } from '../../../../utils/cn';
import type { StatsCard } from '../types';

const iconMap = {
  users:       Users,
  check:       CheckSquare,
  rupee:       IndianRupee,
  'user-plus': UserPlus,
};

const cardAccent: Record<string, { border: string; badge: string; badgeText: string }> = {
  attendance: { border: 'border-l-emerald-500', badge: 'bg-emerald-100', badgeText: 'text-emerald-700' },
  classes:    { border: 'border-l-amber-400',   badge: 'bg-amber-100',   badgeText: 'text-amber-700'   },
  fees:       { border: 'border-l-indigo-500',  badge: 'bg-indigo-100',  badgeText: 'text-indigo-700'  },
  admissions: { border: 'border-l-violet-500',  badge: 'bg-violet-100',  badgeText: 'text-violet-700'  },
};

const defaultAccent = { border: 'border-l-gray-300', badge: 'bg-gray-100', badgeText: 'text-gray-600' };

interface StatsGridProps {
  stats?: StatsCard[];
  loadingStatIds?: Set<string>;
}

export function StatsGrid({ stats = [], loadingStatIds }: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat, i) => {
        const GhostIcon = iconMap[stat.icon as keyof typeof iconMap] || Users;
        const isLoading = loadingStatIds?.has(stat.id);
        const accent    = cardAccent[stat.id] ?? defaultAccent;

        return (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.28, ease: 'easeOut' }}
            className={cn(
              'relative overflow-hidden rounded-2xl bg-white',
              'border border-gray-100 border-l-4',
              'p-4 sm:p-5 flex flex-col gap-2',
              'shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default',
              stat.alert ? 'bg-amber-50/40' : '',
              accent.border,
            )}
          >
            {/* Label */}
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 leading-none">
              {stat.label}
            </p>

            {/* Value + badge */}
            <div className="flex items-end gap-2 flex-wrap">
              {isLoading ? (
                <div className="h-10 w-24 animate-pulse rounded-lg bg-gray-100" />
              ) : (
                <span className="text-3xl sm:text-4xl font-black leading-none tracking-tight text-gray-900 tabular-nums">
                  {stat.value}
                </span>
              )}
              {stat.badge && !isLoading && (
                <span className={cn(
                  'mb-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold leading-tight',
                  accent.badge, accent.badgeText,
                )}>
                  {stat.badge.text}
                </span>
              )}
              {stat.alert && !isLoading && (
                <span className="mb-0.5 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold leading-tight text-amber-700">
                  • Action needed
                </span>
              )}
            </div>

            {/* Sub-text */}
            {isLoading ? (
              <div className="h-3 w-32 animate-pulse rounded bg-gray-100" />
            ) : (
              <p className="text-[11px] sm:text-xs text-gray-500 leading-snug flex-1">
                {stat.sub}
              </p>
            )}

            {/* Action link */}
            {stat.action && !isLoading && (
              <button
                type="button"
                className="mt-1 text-[11px] sm:text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors text-left w-fit"
              >
                {stat.action.label} →
              </button>
            )}

            {/* Ghost watermark icon */}
            <div className="pointer-events-none absolute -bottom-2 -right-1 opacity-[0.05]">
              <GhostIcon size={52} strokeWidth={1} />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
