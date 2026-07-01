import {
  useEnquiries,
  useInterviewList,
  useDocsVerificationList,
  useConfirmedAdmissions,
  useDeclinedAdmissions,
} from '../hooks/useAdmissionsQueries';
import { EnquiryCard }   from './EnquiryCard';
import { InterviewCard } from './InterviewCard';
import { DocsVerifiedCard } from './DocsVerifiedCard';
import { ConfirmedCard, DeclinedCard } from './StatusCards';
import type { Enquiry, PipelineStage } from '../types';

interface ColumnConfig {
  id:      PipelineStage;
  label:   string;
  color:   string;
  lightBg: string;
}

const COLUMNS: ColumnConfig[] = [
  { id: 'enquiry',       label: 'ENQUIRY',       color: '#6366f1', lightBg: '#eef2ff' },
  { id: 'interview',     label: 'INTERVIEW',      color: '#f59e0b', lightBg: '#fffbeb' },
  { id: 'docs_verified', label: 'DOCS VERIFIED',  color: '#3b82f6', lightBg: '#eff6ff' },
  { id: 'confirmed',     label: 'CONFIRMED',      color: '#10b981', lightBg: '#ecfdf5' },
  { id: 'declined',      label: 'DECLINED',       color: '#ef4444', lightBg: '#fef2f2' },
];

function renderCard(enquiry: Enquiry, stage: PipelineStage, index: number) {
  switch (stage) {
    case 'enquiry':       return <EnquiryCard      key={enquiry.id} enquiry={enquiry} index={index} />;
    case 'interview':     return <InterviewCard    key={enquiry.id} enquiry={enquiry} index={index} />;
    case 'docs_verified': return <DocsVerifiedCard key={enquiry.id} enquiry={enquiry} index={index} />;
    case 'confirmed':     return <ConfirmedCard    key={enquiry.id} enquiry={enquiry} index={index} />;
    case 'declined':      return <DeclinedCard     key={enquiry.id} enquiry={enquiry} index={index} />;
  }
}

const ColSkeleton = () => (
  <div className="flex flex-col gap-3">
    <div className="h-5 w-28 animate-pulse rounded bg-gray-200" />
    <div className="h-px rounded-full bg-gray-100" />
    {[1, 2].map((i) => <div key={i} className="h-28 animate-pulse rounded-xl bg-gray-100" />)}
  </div>
);

const BoardSkeleton = () => (
  <div className="grid grid-cols-5 gap-3 w-full min-w-[750px]">
    {COLUMNS.map((c) => <ColSkeleton key={c.id} />)}
  </div>
);

export function PipelineBoard() {
  const { data: enquiries    = [], isLoading: l1 } = useEnquiries();
  const { data: interviews   = [], isLoading: l2 } = useInterviewList();
  const { data: docsList     = [], isLoading: l3 } = useDocsVerificationList();
  const { data: confirmed    = [], isLoading: l4 } = useConfirmedAdmissions();
  const { data: declined     = [], isLoading: l5 } = useDeclinedAdmissions();

  if (l1 || l2 || l3 || l4 || l5) return <BoardSkeleton />;

  const itemsFor = (stage: PipelineStage): Enquiry[] => {
    switch (stage) {
      case 'enquiry':       return enquiries;
      case 'interview':     return interviews;
      case 'docs_verified': return docsList;
      case 'confirmed':     return confirmed;
      case 'declined':      return declined;
    }
  };

  return (
    <div className="grid grid-cols-5 gap-3 w-full min-w-[750px]">
      {COLUMNS.map((col) => {
        const items = itemsFor(col.id);
        return (
          <div key={col.id} className="flex flex-col gap-3">
            {/* Column header */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs tracking-wider text-gray-700 font-medium">
                {col.label}
              </span>
              <span
                className="inline-flex items-center justify-center rounded-full min-w-[18px] h-4 px-1 text-xs"
                style={{ backgroundColor: col.lightBg, color: col.color }}
              >
                {items.length}
              </span>
            </div>

            {/* Thin colored divider */}
            <div className="h-px rounded-full" style={{ backgroundColor: col.color, opacity: 0.25 }} />

            {/* Cards */}
            <div className="space-y-3 min-h-[180px]">
              {items.map((enquiry, i) => renderCard(enquiry, col.id, i))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
