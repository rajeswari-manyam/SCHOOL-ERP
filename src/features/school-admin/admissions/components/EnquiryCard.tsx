import { MessageCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Enquiry } from '../types';
import { useAdmissionsStore } from '../hooks/useAdmissionsStore';
import { useMoveToStage } from '../hooks/useAdmissionsQueries';
import { Card } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';

const SOURCE_VARIANTS: Record<string, 'purple' | 'amber' | 'blue' | 'green' | 'sky'> = {
  social_media: 'purple',
  referral: 'amber',
  'walk-in': 'blue',
  phone: 'green',
  website: 'sky',
};

const SOURCE_LABELS: Record<string, string> = {
  social_media: 'SOCIAL MEDIA',
  referral: 'REFERRAL',
  'walk-in': 'WALK-IN',
  phone: 'PHONE',
  website: 'WEBSITE',
};

interface Props {
  enquiry: Enquiry;
  index: number;
}

const UnknownStudent = ({ id }: { id: string }) => (
  <span className="text-sm font-medium text-gray-400 italic">
    Unknown #{id.slice(0, 8)}
  </span>
);

const SourceBadge = ({ source }: { source?: string }) => {
  if (!source) return <Badge variant="gray">UNKNOWN</Badge>;
  return (
    <Badge variant={SOURCE_VARIANTS[source] ?? 'gray'}>
      {SOURCE_LABELS[source] ?? source.replace(/_/g, ' ').toUpperCase()}
    </Badge>
  );
};

export function EnquiryCard({ enquiry, index }: Props) {
  const { setSelectedEnquiry } = useAdmissionsStore();
  const moveToStage = useMoveToStage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      <Card
        onClick={() => setSelectedEnquiry(enquiry.id)}
        className="p-4 cursor-pointer border-gray-100 hover:border-indigo-200 transition-all"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="min-w-0 flex-1">
            {enquiry.studentName ? (
              <h3 className="truncate font-semibold text-gray-900 text-sm">
                {enquiry.studentName}
              </h3>
            ) : (
              <UnknownStudent id={enquiry.id} />
            )}
          </div>
          {enquiry.whatsappSent && (
            <div className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-500">
              <MessageCircle size={14} className="text-white" />
            </div>
          )}
        </div>

        {/* Details */}
        <div className="mb-3 space-y-1 text-xs text-gray-500">
          <div className="flex gap-1">
            <span className="text-gray-400">Class:</span>
            <span className="font-semibold text-gray-700">
              {enquiry.classApplyingFor || '—'}
            </span>
          </div>
          <div className="flex gap-1">
            <span className="text-gray-400">Parent:</span>
            <span className="truncate text-gray-600">
              {enquiry.parentName || (enquiry.parentPhone ? `📞 ${enquiry.parentPhone}` : '—')}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-400">Source:</span>
            <SourceBadge source={enquiry.source} />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-50 pt-2">
          <span className="text-[11px] text-gray-400">
            {enquiry.enquiryDate || '—'}
          </span>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              moveToStage.mutate({ id: enquiry.id, stage: 'interview' });
            }}
            disabled={moveToStage.isPending}
            variant="link"
            size="sm"
            className="flex items-center gap-1"
          >
            Move to Interview <ArrowRight size={12} />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
