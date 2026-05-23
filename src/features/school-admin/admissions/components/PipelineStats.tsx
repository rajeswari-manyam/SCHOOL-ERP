



import { motion } from 'framer-motion';
import { usePipelineStats } from '../hooks/useAdmissionsQueries';
import { Card } from '../../../../components/ui/card';

// ─── Config ─────────────────────────────────────────────────────────────────
const statConfig = [
  { key: 'enquiries'   as const, label: 'Enquiries',     color: '#6366f1', borderColor: '#6366f1' },
  { key: 'interviews'  as const, label: 'Interviews',    color: '#f59e0b', borderColor: '#f59e0b' },
  { key: 'docsVerified'as const, label: 'Docs verified', color: '#3b82f6', borderColor: '#3b82f6' },
  { key: 'confirmed'   as const, label: 'Confirmed',     color: '#10b981', borderColor: '#10b981' },
  { key: 'declined'    as const, label: 'Declined',      color: '#ef4444', borderColor: '#ef4444' },
] as const;

// ─── Skeleton ────────────────────────────────────────────────────────────────
const Skeleton = () => (
  <div className="mt-1 h-8 w-14 animate-pulse rounded-md bg-gray-100 dark:bg-gray-800" />
);

// ─── Single stat card ────────────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: number | undefined;
  color: string;
  borderColor: string;
  index: number;
  isLoading: boolean;
}

function StatCard({ label, value, color, borderColor, index, isLoading }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.28, ease: 'easeOut' }}
      className="min-w-0"
    >
      <Card
        className="flex h-full flex-col gap-2 border-l-[3px] p-4 transition-shadow duration-200 hover:shadow-sm"
        style={{ borderLeftColor: borderColor }}
        role="region"
        aria-label={`${label}: ${value ?? 0}`}
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.09em] text-gray-400 dark:text-gray-500 truncate">
          {label}
        </p>

        {isLoading ? (
          <Skeleton />
        ) : (
          <p
            className="text-[clamp(1.4rem,3.5vw,1.9rem)] font-bold leading-none tabular-nums"
            style={{ color }}
          >
            {(value ?? 0).toLocaleString()}
          </p>
        )}
      </Card>
    </motion.div>
  );
}

// ─── Pipeline Stats ───────────────────────────────────────────────────────────
export function PipelineStats() {
  const { data: stats, isLoading } = usePipelineStats();

  const total = stats
    ? stats.enquiries + stats.interviews + stats.docsVerified + stats.confirmed + stats.declined
    : 0;

  return (
    <section aria-label="Admissions pipeline statistics" className="space-y-3">
      {/* 
        Breakpoints:
          < 480px  → 1 col  (very small phones)
          480–639px → 2 col  (phones)
          640–1023px → 3 col (tablets / small laptop)
          1024px+  → 5 col  (desktop)
      */}
      <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        {statConfig.map((s, i) => (
          <StatCard
            key={s.key}
            label={s.label}
            value={stats?.[s.key]}
            color={s.color}
            borderColor={s.borderColor}
            index={i}
            isLoading={isLoading}
          />
        ))}
      </div>

      {stats && !isLoading && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="text-center text-sm text-gray-500 dark:text-gray-400"
        >
          Conversion rate:{' '}
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">
            {stats.conversionRate.toFixed(1)}%
          </span>
          <span className="mx-2 opacity-30" aria-hidden="true">•</span>
          <span>
            ({stats.confirmed.toLocaleString()} confirmed of {total.toLocaleString()} total)
          </span>
        </motion.p>
      )}
    </section>
  );
}