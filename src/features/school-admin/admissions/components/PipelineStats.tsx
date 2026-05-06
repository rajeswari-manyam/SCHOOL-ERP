import { motion } from 'framer-motion';
import { usePipelineStats } from '../hooks/useAdmissionsQueries';
import { Card } from '../../../../components/ui/card';


const statConfig = [
  { key: 'enquiries' as const, label: 'ENQUIRIES', color: '#6366f1', border: 'border-l-indigo-500' },
  { key: 'interviews' as const, label: 'INTERVIEWS', color: '#f59e0b', border: 'border-l-amber-500' },
  { key: 'docsVerified' as const, label: 'DOCS VERIFIED', color: '#3b82f6', border: 'border-l-blue-500' },
  { key: 'confirmed' as const, label: 'CONFIRMED', color: '#10b981', border: 'border-l-emerald-500' },
  { key: 'declined' as const, label: 'DECLINED', color: '#ef4444', border: 'border-l-red-500' },
];

export function PipelineStats() {
  const { data: stats, isLoading } = usePipelineStats();

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-5 gap-3">
        {statConfig.map((s, i) => (
          <motion.div
            key={s.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.3 }}
          >
            <Card className={`border-l-4 ${s.border} p-4`}>
              <p className="text-[11px] font-semibold tracking-widest text-gray-400">{s.label}</p>
              {isLoading ? (
                <div className="h-6 w-12 bg-gray-200 rounded animate-pulse mt-2" />
              ) : (
                <p className="mt-1 text-3xl font-bold" style={{ color: s.color }}>
                  {stats?.[s.key] ?? 0}
                </p>
              )}
            </Card>
          </motion.div>
        ))}
      </div>

      {stats && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-sm text-gray-500"
        >
          Conversion rate:{' '}
          <span className="font-semibold text-indigo-600">{stats.conversionRate}%</span>
          <span className="mx-2 text-gray-300">•</span>
          ({stats.confirmed} confirmed of {stats.enquiries + stats.confirmed + stats.declined + stats.interviews + stats.docsVerified} enquiries)
        </motion.p>
      )}
    </div>
  );
}
