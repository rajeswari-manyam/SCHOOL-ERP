import { Calendar, ArrowRight, Clock, User } from 'lucide-react';
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

const isDateSoon = (dateStr?: string): { label: string; urgent: boolean } | null => {
  if (!dateStr) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const parts = dateStr.split(/[-/]/);
  if (parts.length !== 3) return null;
  const d = new Date(`${parts[0]}-${parts[1]}-${parts[2]}`);
  if (isNaN(d.getTime())) return null;
  const diff = Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return { label: `Overdue by ${Math.abs(diff)}d`, urgent: true };
  if (diff === 0) return { label: 'Today', urgent: true };
  if (diff === 1) return { label: 'Tomorrow', urgent: true };
  if (diff <= 7) return { label: `In ${diff}d`, urgent: false };
  return null;
};

const UnknownStudent = ({ id }: { id: string }) => (
  <span className="text-sm font-medium text-gray-400 italic">
    Unknown #{id.slice(0, 8)}
  </span>
);

export function InterviewCard({ enquiry, index }: Props) {
  const { setSelectedEnquiry } = useAdmissionsStore();
  const moveToStage = useMoveToStage();

  const soon = isDateSoon(enquiry.interviewDate);

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
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0 flex-1">
            {enquiry.studentName ? (
              <h3 className="truncate font-semibold text-gray-900 text-sm">
                {enquiry.studentName}
              </h3>
            ) : (
              <UnknownStudent id={enquiry.id} />
            )}
          </div>
          {soon && (
            <Badge variant={soon.urgent ? 'red' : 'amber'} className="shrink-0">
              {soon.label}
            </Badge>
          )}
          {!soon && enquiry.interviewDate && (
            <Badge variant="amber" className="shrink-0">
              Scheduled
            </Badge>
          )}
        </div>

        {/* Class + Parent */}
        <div className="mb-2 space-y-1 text-xs text-gray-500">
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

        {/* Interview date */}
        {enquiry.interviewDate && (
          <div className="mb-2 flex items-center gap-1.5 rounded-lg bg-amber-50 px-2 py-1.5 text-xs text-amber-700">
            <Calendar size={12} />
            <span className="font-medium">{enquiry.interviewDate}</span>
          </div>
        )}

        {/* Interview note */}
        {enquiry.interviewNote && (
          <div className="mb-3 flex items-start gap-1.5 rounded-lg bg-gray-50 px-2 py-1.5 text-xs italic text-gray-500">
            <Clock size={11} className="mt-0.5 shrink-0 text-gray-300" />
            <span>{enquiry.interviewNote}</span>
          </div>
        )}

        {/* Action */}
        <Button
          onClick={(e) => {
            e.stopPropagation();
            moveToStage.mutate({ id: enquiry.id, stage: 'docs_verified' });
          }}
          disabled={moveToStage.isPending}
          variant="outline"
          size="sm"
          className="flex w-full items-center justify-center gap-1"
        >
          Move to Docs <ArrowRight size={12} />
        </Button>
      </Card>
    </motion.div>
  );
}
