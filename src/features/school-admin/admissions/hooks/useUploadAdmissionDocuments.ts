import { useState, useCallback, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { admissionsApi, type UploadProgressEvent } from '@/services/admissions.api';
import { ADMISSIONS_KEYS } from './useAdmissionsQueries';

// ─── File validation constants ────────────────────────────────────────────────

export const ACCEPTED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
] as const;

export const ACCEPTED_EXTENSIONS = '.jpg,.jpeg,.png,.webp,.pdf,.doc,.docx';
export const MAX_FILE_SIZE_MB = 10;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const MAX_FILES = 10;

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export interface FileValidationResult {
  valid: File[];
  errors: string[];
}

export function validateFiles(incoming: File[], existing: File[]): FileValidationResult {
  const errors: string[] = [];
  const valid: File[] = [];

  if (existing.length + incoming.length > MAX_FILES) {
    errors.push(`You can attach at most ${MAX_FILES} files at a time.`);
    return { valid, errors };
  }

  for (const file of incoming) {
    if (!ACCEPTED_MIME_TYPES.includes(file.type as any)) {
      errors.push(`"${file.name}" — unsupported type. Use PDF, Word, JPEG, PNG or WebP.`);
      continue;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      errors.push(`"${file.name}" is ${formatBytes(file.size)} — max is ${MAX_FILE_SIZE_MB} MB.`);
      continue;
    }
    if (existing.some((f) => f.name === file.name && f.size === file.size)) {
      errors.push(`"${file.name}" is already added.`);
      continue;
    }
    valid.push(file);
  }
  return { valid, errors };
}

// ─── Upload mutation ──────────────────────────────────────────────────────────

export interface UploadPayload {
  enquiryId: string;
  files: File[];
  onProgress?: (e: UploadProgressEvent) => void;
  signal?: AbortSignal;
}

export function useUploadAdmissionDocumentsMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ enquiryId, files, onProgress, signal }: UploadPayload) =>
      admissionsApi.uploadAdmissionDocuments(enquiryId, files, onProgress, signal),

    // Retry once on transient network failures (not on 4xx)
    retry: (failureCount, error) => {
      if (failureCount >= 1) return false;
      const msg = error?.message ?? '';
      const isNetwork = msg.includes('Network error') || msg.includes('Failed to fetch');
      return isNetwork;
    },

    onSuccess: (_void, { enquiryId }) => {
      // Invalidate both the document list for this card and the broader pipeline
      qc.invalidateQueries({ queryKey: ADMISSIONS_KEYS.documents(enquiryId), refetchType: "all" });
      qc.invalidateQueries({ queryKey: ADMISSIONS_KEYS.enquiries(), refetchType: "all" });
      qc.invalidateQueries({ queryKey: ADMISSIONS_KEYS.stats(), refetchType: "all" });
      toast.success('Documents uploaded successfully');
    },

    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to upload documents');
    },
  });
}

// ─── Upload panel state hook ──────────────────────────────────────────────────
// Encapsulates all local state so InterviewCard stays lean.

export interface UploadPanelState {
  files: File[];
  isDragging: boolean;
  validationErrors: string[];
  progress: UploadProgressEvent | null;
  uploadError: string | null;
  uploadDone: boolean;
  isUploading: boolean;
  // handlers
  addFiles: (incoming: FileList | File[]) => void;
  removeFile: (index: number) => void;
  handleDragEnter: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleUpload: (enquiryId: string) => void;
  handleCancel: () => void;
  reset: () => void;
}

export function useUploadPanelState(): UploadPanelState {
  const mutation = useUploadAdmissionDocumentsMutation();

  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [progress, setProgress] = useState<UploadProgressEvent | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadDone, setUploadDone] = useState(false);

  const dragCounter = useRef(0);
  const abortRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    setFiles([]);
    setValidationErrors([]);
    setProgress(null);
    setUploadError(null);
    setUploadDone(false);
    abortRef.current?.abort();
    abortRef.current = null;
  }, []);

  const addFiles = useCallback((incoming: FileList | File[]) => {
    const arr = Array.from(incoming);
    setFiles((prev) => {
      const { valid, errors } = validateFiles(arr, prev);
      setValidationErrors(errors);
      return valid.length ? [...prev, ...valid] : prev;
    });
  }, []);

  const removeFile = useCallback((idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
    setValidationErrors([]);
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;
    if (e.dataTransfer.files.length > 0) addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const handleUpload = useCallback((enquiryId: string) => {
    if (!files.length || mutation.isPending) return;
    setValidationErrors([]);
    setUploadError(null);
    setProgress({ loaded: 0, total: 1, percent: 0 });

    const controller = new AbortController();
    abortRef.current = controller;

    mutation.mutate(
      {
        enquiryId,
        files,
        onProgress: setProgress,
        signal: controller.signal,
      },
      {
        onSuccess: () => {
          setUploadDone(true);
          setFiles([]);
          setProgress(null);
          setUploadError(null);
          abortRef.current = null;
        },
        onError: (err) => {
          setProgress(null);
          setUploadError(err?.message ?? 'Upload failed');
          abortRef.current = null;
        },
      },
    );
  }, [files, mutation]);

  const handleCancel = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setProgress(null);
  }, []);

  return {
    files,
    isDragging,
    validationErrors,
    progress,
    uploadError,
    uploadDone,
    isUploading: mutation.isPending,
    addFiles,
    removeFile,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleUpload,
    handleCancel,
    reset,
  };
}
