import { Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Enquiry } from '../types';
import { useAdmissionsStore } from '../hooks/useAdmissionsStore';
import { useMoveToStage } from '../hooks/useAdmissionsQueries';
import { Card } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';

interface Props {
  enquiry: Enquiry;
  index: number;
}

export function InterviewCard({ enquiry, index }: Props) {
  const { setSelectedEnquiry } = useAdmissionsStore();
  const moveToStage = useMoveToStage();

  const isTomorrow = enquiry.interviewDate?.toLowerCase().includes('oct 24');

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      <Card
        onClick={() => setSelectedEnquiry(enquiry.id)}
        className="p-4 cursor-pointer border-gray-100 hover:border-amber-200 transition-all"
      >
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 text-sm">{enquiry.studentName}</h3>
          {isTomorrow && (
            <Badge variant="amber">
              TOMORROW
            </Badge>
          )}
        </div>

        {enquiry.interviewDate && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
            <Calendar size={12} />
            <span>{enquiry.interviewDate}</span>
          </div>
        )}

        {enquiry.interviewNote && (
          <p className="text-xs text-gray-400 italic mb-3 bg-gray-50 rounded-lg p-2">
            {enquiry.interviewNote}
          </p>
        )}

        <Button
          onClick={(e) => {
            e.stopPropagation();
            moveToStage.mutate({ id: enquiry.id, stage: 'docs_verified' });
          }}
          disabled={moveToStage.isPending}
          variant="outline"
          size="sm"
          className="w-full flex items-center justify-center gap-1"
        >
          Move to Docs <ArrowRight size={12} />
        </Button>
      </Card>
    </motion.div>
  );
}
