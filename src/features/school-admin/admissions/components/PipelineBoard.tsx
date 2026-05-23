import { useEnquiries } from '../hooks/useAdmissionsQueries';
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

export function PipelineBoard() {
  const { data: enquiries = [], isLoading } = useEnquiries();

  if (isLoading) {
    return (
      <div className="grid grid-cols-5 gap-4">
        {COLUMNS.map((col) => (
          <div key={col.id} className="space-y-3">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-24" />
            {[1, 2].map((i) => (
              <div key={i} className="h-28 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-5 gap-4 min-w-[900px]">
      {COLUMNS.map((col) => {
        const columnEnquiries = enquiries.filter((e) => e.stage === col.id);
        return (
          <div key={col.id} className="space-y-3">
            {/* Column header */}
            <div className="flex items-center gap-2 px-1">
              <span className="text-xs font-bold tracking-wider text-gray-900">
                {col.label}
              </span>
              <Badge variant="default" className="mt-0.5">
                {columnEnquiries.length}
              </Badge>
            </div>

            {/* Cards */}
            <div className="space-y-3 min-h-[200px]">
              {columnEnquiries.map((enquiry, i) => renderCard(enquiry, col.id, i))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
