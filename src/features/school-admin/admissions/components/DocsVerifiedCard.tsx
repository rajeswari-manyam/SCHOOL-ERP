import { CheckCircle2, AlertCircle, FileText, User, ExternalLink, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Enquiry } from '../types';
import { useAdmissionsStore } from '../hooks/useAdmissionsStore';
import { useAdmissionDocuments } from '../hooks/useAdmissionsQueries';
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

function prettifyFileName(name: string): string {
  try {
    const decoded = decodeURIComponent(name);
    const parts = decoded.split(/[/\\]/);
    return parts[parts.length - 1] ?? decoded;
  } catch {
    return name;
  }
}

export function DocsVerifiedCard({ enquiry, index }: Props) {
  const { setSelectedEnquiry, openConfirmAdmission } = useAdmissionsStore();
  const { data: fetchedDocs = [], isLoading: isDocsLoading } = useAdmissionDocuments(enquiry.id);

  // Merge API-fetched document records (have file_name + file_url) with
  // embedded enquiry.documents (have name + status). API records win.
  const docs = enquiry.documents ?? [];

  // Build uploaded files from dedicated API response
  const uploadedFiles = fetchedDocs.length > 0
    ? fetchedDocs
        .filter((d) => d.file_url)
        .map((d) => ({ id: d.id, name: d.file_name, file_name: d.file_name, file_url: d.file_url }))
    : docs.filter((d): d is typeof d & { file_url: string } => !!d.file_url);

  // Checklist items (status-only) from embedded data
  const checklist = docs.filter((d) => !d.file_url);

  const verifiedCount = checklist.filter((d) => d.status === 'verified').length;
  const allVerified = checklist.length > 0 && verifiedCount === checklist.length;

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
          {checklist.length > 0 && (
            <Badge variant={allVerified ? 'emerald' : 'amber'} className="shrink-0">
              <FileText size={10} className="mr-1" />
              {allVerified ? 'Complete' : `${verifiedCount}/${checklist.length}`}
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

        {/* ── Document checklist ─────────────────────────────────────────── */}
        {checklist.length > 0 ? (
          <div className="mb-3">
            <DocProgress verified={verifiedCount} total={checklist.length} />
            <ul className="mt-2 space-y-1">
              {checklist.map((doc) => {
                const cfg = DOC_STATUS[doc.status] ?? DOC_STATUS.pending;
                const Icon = cfg.icon;
                return (
                  <li key={doc.name} className="flex items-center gap-2 text-xs">
                    <Icon size={12} className={`shrink-0 ${cfg.color}`} />
                    <span className={cfg.label ? 'font-medium text-amber-600' : 'text-gray-700'}>
                      {doc.name}
                      {cfg.label && (
                        <span className="ml-1 font-normal text-gray-400">({cfg.label})</span>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <div className="mb-3 rounded-lg bg-gray-50 py-2 text-center text-[11px] text-gray-400">
            No document checklist
          </div>
        )}

        {/* ── Uploaded files (from /tenant/getadmissiondocuments/) ────────── */}
        {isDocsLoading ? (
          <div className="mb-3 flex items-center justify-center gap-2 rounded-lg bg-gray-50 py-3 text-[11px] text-gray-400">
            <Loader2 size={12} className="animate-spin" />
            Loading documents…
          </div>
        ) : uploadedFiles.length > 0 ? (
          <div className="mb-3">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
              Uploaded Files
            </p>
            <ul className="space-y-1">
              {uploadedFiles.map((rec) => (
                <li key={rec.id ?? rec.file_url} className="flex items-center gap-2">
                  <FileText size={11} className="shrink-0 text-blue-400" />
                  <span className="min-w-0 flex-1 truncate text-[11px] text-gray-600">
                    {prettifyFileName(rec.file_name ?? rec.name)}
                  </span>
                  {rec.file_url && (
                    <a
                      href={rec.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="shrink-0 rounded text-gray-400 hover:text-blue-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-300"
                      aria-label={`Open ${prettifyFileName(rec.file_name ?? rec.name)}`}
                    >
                      <ExternalLink size={11} />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

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
