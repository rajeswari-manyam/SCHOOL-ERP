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
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 text-sm">{enquiry.studentName}</h3>
          {enquiry.whatsappSent && (
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
              <MessageCircle size={14} className="text-white" />
            </div>
          )}
        </div>

        <div className="space-y-1 text-xs text-gray-500 mb-3">
          <div className="flex gap-1">
            <span className="text-gray-400">Class:</span>
            <span className="font-semibold text-gray-700">{enquiry.classApplyingFor}</span>
          </div>
          {enquiry.parentName && (
            <div className="flex gap-1">
              <span className="text-gray-400">Parent:</span>
              <span className="text-gray-600">{enquiry.parentName}</span>
            </div>
          )}
          {enquiry.source && (
            <div className="flex gap-1 items-center">
              <span className="text-gray-400">Source:</span>
              <Badge variant={SOURCE_VARIANTS[enquiry.source] ?? 'gray'}>
                {SOURCE_LABELS[enquiry.source] ?? enquiry.source.toUpperCase()}
              </Badge>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
          <span className="text-[11px] text-gray-400">{enquiry.enquiryDate}</span>
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
