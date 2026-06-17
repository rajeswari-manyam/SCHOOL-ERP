import { CheckCircle2, AlertCircle, FileText, User, ExternalLink, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Enquiry } from '../types';
import { useAdmissionsStore } from '../hooks/useAdmissionsStore';
import { useAdmissionDocuments, useDirectConfirmAdmission, useDirectDeclineAdmission } from '../hooks/useAdmissionsQueries';

interface Props {
  enquiry: Enquiry;
  index: number;
}

const DOC_STATUS = {
  verified: { icon: CheckCircle2, color: 'text-emerald-500' },
  pending:  { icon: AlertCircle,  color: 'text-amber-500'  },
  missing:  { icon: AlertCircle,  color: 'text-red-500'    },
} as const;

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
  const { setSelectedEnquiry } = useAdmissionsStore();
  const { data: fetchedDocs = [], isLoading: isDocsLoading } = useAdmissionDocuments(enquiry.id);
  const confirmMutation = useDirectConfirmAdmission();
  const declineMutation = useDirectDeclineAdmission();
  const isActing = confirmMutation.isPending || declineMutation.isPending;

  const docs = enquiry.documents ?? [];

  const uploadedFiles = fetchedDocs.length > 0
    ? fetchedDocs
        .filter((d) => d.file_url)
        .map((d) => ({ id: d.id, name: d.file_name, file_name: d.file_name, file_url: d.file_url }))
    : docs.filter((d): d is typeof d & { file_url: string } => !!d.file_url);

  const checklist = docs.filter((d) => !d.file_url);
  const verifiedCount = checklist.filter((d) => d.status === 'verified').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      <div
        onClick={() => setSelectedEnquiry(enquiry.id)}
        className="bg-white rounded-xl border border-gray-100 p-4 cursor-pointer hover:border-blue-200 hover:shadow-sm transition-all"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="font-semibold text-gray-900 text-sm leading-snug truncate">
            {enquiry.studentName || (
              <span className="text-gray-400 italic">Unknown #{enquiry.id.slice(0, 8)}</span>
            )}
          </h3>
          {checklist.length > 0 && (
            <span className={`shrink-0 text-[10px] font-bold rounded-full px-2 py-0.5 ${
              verifiedCount === checklist.length
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-amber-50 text-amber-700'
            }`}>
              {verifiedCount === checklist.length ? 'Complete' : `${verifiedCount}/${checklist.length}`}
            </span>
          )}
        </div>

        {/* Class + Parent */}
        <div className="mb-3 space-y-1 text-xs text-gray-500">
          <div className="flex gap-1">
            <span className="text-gray-400">Class:</span>
            <span className="font-semibold text-gray-700">{enquiry.classApplyingFor || '—'}</span>
          </div>
          <div className="flex items-center gap-1">
            <User size={11} className="text-gray-300" />
            <span className="truncate text-gray-600">
              {enquiry.parentName || enquiry.parentPhone || '—'}
            </span>
          </div>
        </div>

        {/* Document checklist */}
        {checklist.length > 0 ? (
          <ul className="mb-3 space-y-1.5">
            {checklist.map((doc) => {
              const cfg = DOC_STATUS[doc.status] ?? DOC_STATUS.pending;
              const Icon = cfg.icon;
              return (
                <li key={doc.name} className="flex items-center gap-2 text-xs">
                  <Icon size={13} className={`shrink-0 ${cfg.color}`} />
                  <span className="text-gray-700">{doc.name}</span>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="mb-3 rounded-lg bg-gray-50 py-2 text-center text-[11px] text-gray-400">
            No document checklist
          </div>
        )}

        {/* Uploaded files */}
        {isDocsLoading ? (
          <div className="mb-3 flex items-center justify-center gap-2 rounded-lg bg-gray-50 py-2.5 text-[11px] text-gray-400">
            <Loader2 size={11} className="animate-spin" />
            Loading…
          </div>
        ) : uploadedFiles.length > 0 ? (
          <ul className="mb-3 space-y-1">
            {uploadedFiles.map((rec) => (
              <li key={rec.id ?? rec.file_url} className="flex items-center gap-1.5">
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
                    className="shrink-0 text-gray-400 hover:text-blue-500"
                  >
                    <ExternalLink size={11} />
                  </a>
                )}
              </li>
            ))}
          </ul>
        ) : null}

        {/* Confirm / Decline actions */}
        <div className="flex gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => confirmMutation.mutate(enquiry.id)}
            disabled={isActing}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2 transition-colors disabled:opacity-60"
          >
            {confirmMutation.isPending
              ? <Loader2 size={12} className="animate-spin" />
              : <CheckCircle2 size={12} />}
            Confirm Admission
          </button>
          <button
            onClick={() => declineMutation.mutate(enquiry.id)}
            disabled={isActing}
            className="flex items-center justify-center gap-1 rounded-lg border border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-500 hover:text-red-600 text-xs font-medium px-3 py-2 transition-colors disabled:opacity-60"
          >
            {declineMutation.isPending
              ? <Loader2 size={12} className="animate-spin" />
              : <AlertCircle size={12} />}
            Decline
          </button>
        </div>
      </div>
    </motion.div>
  );
}
