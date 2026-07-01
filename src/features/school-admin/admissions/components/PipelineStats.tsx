import { motion } from 'framer-motion';
import { usePipelineStats } from '../hooks/useAdmissionsQueries';

const statConfig = [
  { key: 'enquiries'    as const, label: 'ENQUIRIES',     color: '#6366f1', border: '#6366f1' },
  { key: 'interviews'   as const, label: 'INTERVIEWS',    color: '#f59e0b', border: '#f59e0b' },
  { key: 'docsVerified' as const, label: 'DOCS VERIFIED', color: '#3b82f6', border: '#3b82f6' },
  { key: 'confirmed'    as const, label: 'CONFIRMED',     color: '#10b981', border: '#10b981' },
  { key: 'declined'     as const, label: 'DECLINED',      color: '#ef4444', border: '#ef4444' },
] as const;

function StatCard({
  label, value, color, border, index, isLoading,
}: { label: string; value: number | undefined; color: string; border: string; index: number; isLoading: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.25, ease: 'easeOut' }}
    >
      <div
        className="bg-white rounded-xl border border-gray-100 p-3 h-full flex flex-col gap-1.5 shadow-sm"
        style={{ borderLeftWidth: 3, borderLeftColor: border }}
      >
        <p className="text-[9px] tracking-widest text-gray-400">{label}</p>
        {isLoading ? (
          <div className="h-6 w-10 animate-pulse rounded-md bg-gray-100" />
        ) : (
          <p className="text-lg font-semibold leading-none tabular-nums" style={{ color }}>
            {(value ?? 0).toLocaleString()}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export function PipelineStats() {
  const { data: stats, isLoading } = usePipelineStats();

  const total = stats
    ? stats.enquiries + stats.interviews + stats.docsVerified + stats.confirmed + stats.declined
    : 0;

  return (
    <section className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {statConfig.map((s, i) => (
          <StatCard
            key={s.key}
            label={s.label}
            value={stats?.[s.key]}
            color={s.color}
            border={s.border}
            index={i}
            isLoading={isLoading}
          />
        ))}
      </div>

      {stats && !isLoading && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-xs text-gray-500"
        >
          Conversion rate:{' '}
          <span className="font-semibold text-indigo-600">
            {stats.conversionRate.toFixed(1)}%
          </span>
          <span className="mx-2 text-gray-300">•</span>
          <span>({stats.confirmed} confirmed of {total} total)</span>
        </motion.p>
      )}
    </section>
  );
}
