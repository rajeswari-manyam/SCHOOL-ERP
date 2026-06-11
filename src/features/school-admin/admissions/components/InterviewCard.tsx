import { useRef, useState, useCallback } from 'react';
import {
  Calendar, ArrowRight, Clock, User,
  Upload, X, FileText, CheckCircle, Loader2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Enquiry } from '../types';
import { useAdmissionsStore } from '../hooks/useAdmissionsStore';
import { useMoveToStage } from '../hooks/useAdmissionsQueries';
import {
  useUploadPanelState,
  ACCEPTED_EXTENSIONS,
  MAX_FILE_SIZE_MB,
  MAX_FILES,
  formatBytes,
} from '../hooks/useUploadAdmissionDocuments';
import { Card } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';

// ─── helpers ──────────────────────────────────────────────────────────────────

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

// ─── sub-components ───────────────────────────────────────────────────────────

const UnknownStudent = ({ id }: { id: string }) => (
  <span className="text-sm font-medium text-gray-400 italic">Unknown #{id.slice(0, 8)}</span>
);

interface FileRowProps {
  file: File;
  onRemove: () => void;
  disabled: boolean;
}

function FileRow({ file, onRemove, disabled }: FileRowProps) {
  return (
    <div className="flex items-center gap-2 rounded-md bg-gray-50 px-2 py-1.5">
      <FileText size={12} className="shrink-0 text-amber-500" />
      <span className="min-w-0 flex-1 truncate text-xs text-gray-700">{file.name}</span>
      <span className="shrink-0 text-[10px] text-gray-400">{formatBytes(file.size)}</span>
      {!disabled && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="shrink-0 rounded text-gray-400 hover:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
          aria-label={`Remove ${file.name}`}
        >
          <X size={12} />
        </button>
      )}
    </div>
  );
}

interface DropZoneProps {
  isDragging: boolean;
  onDragEnter: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onBrowse: () => void;
  disabled: boolean;
}

function DropZone({
  isDragging, onDragEnter, onDragLeave, onDragOver, onDrop, onBrowse, disabled,
}: DropZoneProps) {
  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label="Upload area — drag files here or press Enter to browse"
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onClick={(e) => { e.stopPropagation(); if (!disabled) onBrowse(); }}
      onKeyDown={(e) => { if (e.key === 'Enter' && !disabled) onBrowse(); }}
      className={[
        'flex cursor-pointer flex-col items-center gap-1 rounded-lg border-2 border-dashed px-3 py-4 text-center transition-colors select-none',
        isDragging
          ? 'border-amber-400 bg-amber-50'
          : 'border-gray-200 bg-gray-50 hover:border-amber-300 hover:bg-amber-50/60',
        disabled ? 'pointer-events-none opacity-50' : '',
      ].filter(Boolean).join(' ')}
    >
      <Upload size={16} className="text-amber-500" />
      <p className="text-xs font-medium text-gray-700">
        {isDragging ? 'Drop to attach' : 'Drag & drop or browse'}
      </p>
      <p className="text-[10px] text-gray-400">
        PDF · Word · JPEG · PNG · WebP &nbsp;·&nbsp; max {MAX_FILE_SIZE_MB} MB &nbsp;·&nbsp; up to {MAX_FILES} files
      </p>
    </div>
  );
}

interface ProgressBarProps { percent: number }

function ProgressBar({ percent }: ProgressBarProps) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px] text-gray-500">
        <span>Uploading…</span>
        <span>{percent}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
        <motion.div
          className="h-full rounded-full bg-amber-400"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ ease: 'easeOut', duration: 0.15 }}
        />
      </div>
    </div>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

interface Props {
  enquiry: Enquiry;
  index: number;
}

export function InterviewCard({ enquiry, index }: Props) {
  const { setSelectedEnquiry } = useAdmissionsStore();
  const moveToStage = useMoveToStage();

  const [uploadOpen, setUploadOpen] = useState(false);

  const panel = useUploadPanelState();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const soon = isDateSoon(enquiry.interviewDate);
  const isUploading = panel.isUploading;

  // ── panel toggle ───────────────────────────────────────────────────────────
  const handleToggleUpload = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (isUploading) return;
    setUploadOpen((prev) => {
      if (prev) panel.reset();
      return !prev;
    });
  }, [isUploading, panel]);

  // ── upload submit ──────────────────────────────────────────────────────────
  const handleUploadClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    panel.handleUpload(enquiry.id);
  }, [panel, enquiry.id]);

  // ── auto-close after success ───────────────────────────────────────────────
  const prevDone = useRef(false);
  if (panel.uploadDone && !prevDone.current) {
    prevDone.current = true;
    setTimeout(() => {
      setUploadOpen(false);
      panel.reset();
      prevDone.current = false;
    }, 1800);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      <Card
        onClick={() => setSelectedEnquiry(enquiry.id)}
        className="cursor-pointer border-gray-100 p-4 transition-all hover:border-amber-200"
      >
        {/* Header */}
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            {enquiry.studentName
              ? <h3 className="truncate text-sm font-semibold text-gray-900">{enquiry.studentName}</h3>
              : <UnknownStudent id={enquiry.id} />}
          </div>
          {soon
            ? <Badge variant={soon.urgent ? 'red' : 'amber'} className="shrink-0">{soon.label}</Badge>
            : enquiry.interviewDate && <Badge variant="amber" className="shrink-0">Scheduled</Badge>
          }
        </div>

        {/* Class + Parent */}
        <div className="mb-2 space-y-1 text-xs text-gray-500">
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

        {/* ── Upload panel ────────────────────────────────────────────────── */}
        <div className="mb-2" onClick={(e) => e.stopPropagation()}>
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={ACCEPTED_EXTENSIONS}
            className="sr-only"
            aria-label="Upload admission documents"
            onChange={(e) => {
              if (e.target.files) panel.addFiles(e.target.files);
              e.target.value = '';
            }}
          />

          {/* Toggle */}
          <Button
            type="button"
            onClick={handleToggleUpload}
            disabled={isUploading}
            variant="outline"
            size="sm"
            className={[
              'flex w-full items-center justify-center gap-1.5 transition-colors',
              uploadOpen ? 'border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100' : '',
            ].filter(Boolean).join(' ')}
          >
            <Upload size={12} />
            {uploadOpen ? 'Hide Upload' : 'Upload Documents'}
          </Button>

          {/* Collapsible content */}
          <AnimatePresence initial={false}>
            {uploadOpen && (
              <motion.div
                key="upload-panel"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="mt-2 space-y-2">
                  {panel.uploadDone ? (
                    /* ── Success ── */
                    <div className="flex flex-col items-center gap-2 rounded-lg bg-green-50 px-3 py-5 text-center">
                      <CheckCircle size={22} className="text-green-500" />
                      <p className="text-xs font-semibold text-green-700">Documents uploaded!</p>
                      <p className="text-[10px] text-green-500">Closing…</p>
                    </div>
                  ) : (
                    <>
                      {/* Drop zone */}
                      <DropZone
                        isDragging={panel.isDragging}
                        onDragEnter={panel.handleDragEnter}
                        onDragLeave={panel.handleDragLeave}
                        onDragOver={panel.handleDragOver}
                        onDrop={panel.handleDrop}
                        onBrowse={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                      />

                      {/* File list */}
                      {panel.files.length > 0 && (
                        <div className="space-y-1">
                          {panel.files.map((file, idx) => (
                            <FileRow
                              key={`${file.name}-${file.size}`}
                              file={file}
                              onRemove={() => panel.removeFile(idx)}
                              disabled={isUploading}
                            />
                          ))}
                        </div>
                      )}

                      {/* Validation errors */}
                      {panel.validationErrors.length > 0 && (
                        <div className="space-y-0.5 rounded-md bg-red-50 px-2 py-1.5">
                          {panel.validationErrors.map((err) => (
                            <p key={err} className="text-[10px] text-red-600">{err}</p>
                          ))}
                        </div>
                      )}

                      {/* Upload error */}
                      {panel.uploadError && (
                        <div className="rounded-md bg-red-50 px-2 py-2 text-center">
                          <p className="text-[10px] font-medium text-red-600">{panel.uploadError}</p>
                          <p className="mt-0.5 text-[9px] text-red-400">You can try again</p>
                        </div>
                      )}

                      {/* Progress bar */}
                      {panel.progress && <ProgressBar percent={panel.progress.percent} />}

                      {/* Upload / Cancel buttons */}
                      {isUploading ? (
                        <div className="flex items-center gap-2">
                          <div className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-gray-50 py-1.5 text-[11px] text-gray-400">
                            <Loader2 size={11} className="animate-spin" />
                            Uploading, please wait…
                          </div>
                          <Button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); panel.handleCancel(); }}
                            variant="outline"
                            size="sm"
                            className="shrink-0 text-xs text-red-500 hover:border-red-300 hover:text-red-600"
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        panel.files.length > 0 && (
                          <Button
                            type="button"
                            onClick={handleUploadClick}
                            size="sm"
                            className="flex w-full items-center justify-center gap-1.5 bg-amber-500 text-white hover:bg-amber-600"
                          >
                            <Upload size={12} />
                            Upload {panel.files.length} {panel.files.length === 1 ? 'file' : 'files'}
                          </Button>
                        )
                      )}
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Move to Docs */}
        <Button
          onClick={(e) => {
            e.stopPropagation();
            moveToStage.mutate({ id: enquiry.id, stage: 'docs_verified' });
          }}
          disabled={moveToStage.isPending || isUploading}
          variant="outline"
          size="sm"
          className="flex w-full items-center justify-center gap-1"
        >
          {moveToStage.isPending
            ? <><Loader2 size={12} className="animate-spin" /> Moving…</>
            : <>Move to Docs <ArrowRight size={12} /></>
          }
        </Button>
      </Card>
    </motion.div>
  );
}
