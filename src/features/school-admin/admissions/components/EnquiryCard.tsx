import { MessageCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Enquiry } from '../types';
import { useAdmissionsStore } from '../hooks/useAdmissionsStore';
import { useMoveToStage } from '../hooks/useAdmissionsQueries';

const SOURCE_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  social_media: { bg: '#f3e8ff', text: '#7c3aed', label: 'SOCIAL MEDIA' },
  referral:     { bg: '#fffbeb', text: '#b45309', label: 'REFERRAL' },
  'walk-in':    { bg: '#eff6ff', text: '#1d4ed8', label: 'WALK-IN' },
  phone:        { bg: '#f0fdf4', text: '#15803d', label: 'PHONE' },
  website:      { bg: '#f0f9ff', text: '#0369a1', label: 'WEBSITE' },
};

interface Props {
  enquiry: Enquiry;
  index: number;
}

export function EnquiryCard({ enquiry, index }: Props) {
  const { setSelectedEnquiry } = useAdmissionsStore();
  const moveToStage = useMoveToStage();

  const src = enquiry.source ? SOURCE_STYLES[enquiry.source] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      <div
        onClick={() => setSelectedEnquiry(enquiry.id)}
        className="bg-white rounded-xl border border-gray-100 p-3 cursor-pointer hover:border-indigo-200 hover:shadow-sm transition-all"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-medium text-gray-900 text-xs leading-snug truncate">
            {enquiry.studentName || (
              <span className="text-gray-400 italic">Unknown #{enquiry.id.slice(0, 8)}</span>
            )}
          </h3>
          {enquiry.whatsappSent && (
            <div className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full bg-green-500">
              <MessageCircle size={13} className="text-white" />
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-1 text-xs text-gray-500 mb-3">
          <div className="flex gap-1">
            <span className="text-gray-400">Class:</span>
            <span className="font-semibold text-gray-700">{enquiry.classApplyingFor || '—'}</span>
          </div>
          <div className="flex gap-1">
            <span className="text-gray-400">Parent:</span>
            <span className="truncate text-gray-600">
              {enquiry.parentName || enquiry.parentPhone || '—'}
            </span>
          </div>
          {src && (
            <div className="flex gap-1 items-center">
              <span className="text-gray-400">Source:</span>
              <span
                className="text-[10px] font-bold rounded-full px-2 py-0.5"
                style={{ backgroundColor: src.bg, color: src.text }}
              >
                {src.label}
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-50 pt-2.5">
          <span className="text-[10px] text-gray-400">{enquiry.enquiryDate || '—'}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              moveToStage.mutate({ id: enquiry.id, stage: 'interview' });
            }}
            disabled={moveToStage.isPending}
            className="flex items-center gap-1 text-[10px] text-indigo-600 hover:text-indigo-800 disabled:opacity-50 transition-colors"
          >
            Move to Interview <ArrowRight size={10} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
