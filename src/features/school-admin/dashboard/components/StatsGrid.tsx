import { motion } from 'framer-motion';
import { Users, CheckSquare, IndianRupee, UserPlus } from 'lucide-react';
import { cn } from '../../../../utils/cn';
import type { StatsCard } from '../types';

// ─── Icon Mapping ──────────────────────────────────────────────────────────
const iconMap = {
  users: Users,
  check: CheckSquare,
  rupee: IndianRupee,
  'user-plus': UserPlus,
};

// ─── Badge Variants ────────────────────────────────────────────────────────
const badgeVariants: Record<string, string> = {
  green: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  orange: 'bg-amber-50 text-amber-700 border border-amber-100',
  blue: 'bg-indigo-50 text-indigo-700 border border-indigo-100',
  red: 'bg-red-50 text-red-700 border border-red-100',
};

interface StatsGridProps {
  stats?: StatsCard[];
  loadingStatIds?: Set<string>;
}

export function StatsGrid({ stats = [], loadingStatIds }: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      {stats.map((stat, i) => {
        const GhostIcon =
          iconMap[stat.icon as keyof typeof iconMap] || Users;
        const isLoading = loadingStatIds?.has(stat.id);

        return (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: i * 0.04,
              duration: 0.25,
              ease: 'easeOut',
            }}
            className={cn(
              'relative overflow-hidden rounded-lg bg-white border p-2',
              'flex flex-col min-h-[95px]',
              'shadow-sm',
              'transition-all duration-200',
              'hover:shadow-md hover:-translate-y-0.5',
              stat.alert
                ? 'border-amber-200 bg-amber-50/40'
                : 'border-gray-100'
            )}
          >
            {/* Label */}
            <p className="text-[8px] font-semibold uppercase tracking-wide text-gray-400 mb-1">
              {stat.label}
            </p>

            {/* Value + Badge */}
            <div className="flex items-start gap-1.5 mb-1">
              {isLoading ? (
                <div className="flex items-center gap-1.5">
                  <span className="inline-block h-5 w-12 animate-pulse rounded bg-gray-200" />
                  <span className="inline-block h-3 w-10 animate-pulse rounded bg-gray-200" />
                </div>
              ) : (
                <>
                  <span className="text-[16px] font-bold leading-none text-gray-900">
                    {stat.value}
                  </span>
                  {stat.badge && (
                    <span
                      className={cn(
                        'text-[8px] font-semibold px-1.5 py-0.5 rounded leading-tight whitespace-pre-line flex-shrink-0',
                        badgeVariants[stat.badge.variant] ||
                          badgeVariants.blue
                      )}
                    >
                      {stat.badge.text.replace(' ', '\n')}
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Subtitle */}
            <p className="text-[10px] text-gray-500 leading-normal flex-1">
              {stat.sub}
            </p>

            {/* Action */}
            {stat.action && (
              <button
                type="button"
                className="mt-1 text-[10px] font-medium text-indigo-600 hover:text-indigo-800 transition-colors text-left w-fit"
              >
                {stat.action.label}
              </button>
            )}

            {/* Ghost Watermark Icon */}
            <div className="absolute bottom-1.5 right-2 opacity-[0.05] pointer-events-none">
              <GhostIcon size={28} strokeWidth={1.5} />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}