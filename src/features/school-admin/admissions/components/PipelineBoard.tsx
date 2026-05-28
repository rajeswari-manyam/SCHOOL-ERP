import { useEnquiries, useInterviewList, useDocsVerificationList } from '../hooks/useAdmissionsQueries';
import { EnquiryCard } from './EnquiryCard';
import { InterviewCard } from './InterviewCard';
import { DocsVerifiedCard } from './DocsVerifiedCard';
import { ConfirmedCard, DeclinedCard } from './StatusCards';
import { Badge } from '../../../../components/ui/badge';
import type { Enquiry, PipelineStage } from '../types';

interface ColumnConfig {
  id: PipelineStage;
  label: string;
  badgeVariant: 'indigo' | 'amber' | 'blue' | 'emerald' | 'red';
}

const COLUMNS: ColumnConfig[] = [
  { id: 'enquiry', label: 'ENQUIRY', badgeVariant: 'indigo' },
  { id: 'interview', label: 'INTERVIEW', badgeVariant: 'amber' },
  { id: 'docs_verified', label: 'DOCS VERIFIED', badgeVariant: 'blue' },
  { id: 'confirmed', label: 'CONFIRMED', badgeVariant: 'emerald' },
  { id: 'declined', label: 'DECLINED', badgeVariant: 'red' },
];

function renderCard(enquiry: Enquiry, stage: PipelineStage, index: number) {
  switch (stage) {
    case 'enquiry': return <EnquiryCard key={enquiry.id} enquiry={enquiry} index={index} />;
    case 'interview': return <InterviewCard key={enquiry.id} enquiry={enquiry} index={index} />;
    case 'docs_verified': return <DocsVerifiedCard key={enquiry.id} enquiry={enquiry} index={index} />;
    case 'confirmed': return <ConfirmedCard key={enquiry.id} enquiry={enquiry} index={index} />;
    case 'declined': return <DeclinedCard key={enquiry.id} enquiry={enquiry} index={index} />;
  }
}

const BoardSkeleton = () => (
  <div className="grid grid-cols-5 gap-4">
    {COLUMNS.map((col) => (
      <div key={col.id} className="space-y-3">
        <div className="h-6 w-24 animate-pulse rounded bg-gray-200" />
        {[1, 2].map((i) => (
          <div key={i} className="h-28 animate-pulse rounded-xl bg-gray-100" />
        ))}
      </div>
    ))}
  </div>
);

export function PipelineBoard() {
  const { data: enquiries = [], isLoading: enqLoading } = useEnquiries();
  const { data: interviewList = [], isLoading: intLoading } = useInterviewList();
  const { data: docsList = [], isLoading: docsLoading } = useDocsVerificationList();

  const isLoading = enqLoading || intLoading || docsLoading;

  if (isLoading) return <BoardSkeleton />;

  return (
    <div className="grid grid-cols-5 gap-4 min-w-[900px]">
      {COLUMNS.map((col) => {
        const columnEnquiries =
          col.id === 'interview' ? interviewList
          : col.id === 'docs_verified' ? docsList
          : enquiries.filter((e) => e.stage === col.id);
        return (
          <div key={col.id} className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <span className="text-xs font-bold tracking-wider text-gray-900">
                {col.label}
              </span>
              <Badge variant="default" className="mt-0.5">
                {columnEnquiries.length}
              </Badge>
            </div>
            <div className="space-y-3 min-h-[200px]">
              {columnEnquiries.map((enquiry, i) => renderCard(enquiry, col.id, i))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
