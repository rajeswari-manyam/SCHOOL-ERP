import { CheckCircle2, AlertCircle, FileText, User } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Enquiry } from '../types';
import { useAdmissionsStore } from '../hooks/useAdmissionsStore';
import { Card } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';

interface Props {
  enquiry: Enquiry;
  index: number;
}

const DOC_STATUS = {
  verified: { icon: CheckCircle2, color: 'text-emerald-500', label: '' },
  pending:  { icon: AlertCircle,  color: 'text-amber-500',  label: 'Pending' },
  missing:  { icon: AlertCircle,  color: 'text-red-500',    label: 'Missing' },
} as const;

const UnknownStudent = ({ id }: { id: string }) => (
  <span className="text-sm font-medium text-gray-400 italic">
    Unknown #{id.slice(0, 8)}
  </span>
);

const DocProgress = ({ verified, total }: { verified: number; total: number }) => {
  const pct = total ? Math.round((verified / total) * 100) : 0;
  const color = pct === 100 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-400';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-gray-100">
        <div className={`h-1.5 rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[10px] font-semibold text-gray-400 tabular-nums">
        {verified}/{total}
      </span>
    </div>
  );
};

export function DocsVerifiedCard({ enquiry, index }: Props) {
  const { setSelectedEnquiry, openConfirmAdmission } = useAdmissionsStore();
  const docs = enquiry.documents ?? [];
  const verifiedCount = docs.filter((d) => d.status === 'verified').length;
  const allVerified = docs.length > 0 && verifiedCount === docs.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      <Card
        onClick={() => setSelectedEnquiry(enquiry.id)}
        className="p-4 cursor-pointer border-gray-100 hover:border-blue-200 transition-all"
      >
        {/* Header */}
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            {enquiry.studentName ? (
              <h3 className="truncate font-semibold text-gray-900 text-sm">
                {enquiry.studentName}
              </h3>
            ) : (
              <UnknownStudent id={enquiry.id} />
            )}
          </div>
          {docs.length > 0 && (
            <Badge variant={allVerified ? 'emerald' : 'amber'} className="shrink-0">
              <FileText size={10} className="mr-1" />
              {allVerified ? 'Complete' : `${verifiedCount}/${docs.length}`}
            </Badge>
          )}
        </div>

        {/* Class + Parent */}
        <div className="mb-3 space-y-1 text-xs text-gray-500">
          <div className="flex gap-1">
            <span className="text-gray-400">Class:</span>
            <span className="font-semibold text-gray-700">
              {enquiry.classApplyingFor || '—'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <User size={11} className="text-gray-300" />
            <span className="truncate text-gray-600">
              {enquiry.parentName || enquiry.parentPhone || '—'}
            </span>
          </div>
        </div>

        {/* Documents list or empty state */}
        {docs.length > 0 ? (
          <div className="mb-3">
            <DocProgress verified={verifiedCount} total={docs.length} />
            <ul className="mt-2 space-y-1">
              {docs.map((doc) => {
                const cfg = DOC_STATUS[doc.status] ?? DOC_STATUS.pending;
                const Icon = cfg.icon;
                return (
                  <li key={doc.name} className="flex items-center gap-2 text-xs">
                    <Icon size={12} className={`shrink-0 ${cfg.color}`} />
                    <span className={cfg.label ? 'font-medium text-amber-600' : 'text-gray-700'}>
                      {doc.name}
                      {cfg.label && <span className="ml-1 font-normal text-gray-400">({cfg.label})</span>}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <div className="mb-3 rounded-lg bg-gray-50 py-2 text-center text-[11px] text-gray-400">
            No documents listed
          </div>
        )}

        {/* Action */}
        <Button
          onClick={(e) => {
            e.stopPropagation();
            openConfirmAdmission(enquiry.id);
          }}
          disabled={!allVerified}
          variant={allVerified ? 'default' : 'outline'}
          size="sm"
          className="w-full"
        >
          {allVerified ? 'Confirm Admission' : 'Pending Documents'}
        </Button>
      </Card>
    </motion.div>
  );
}
