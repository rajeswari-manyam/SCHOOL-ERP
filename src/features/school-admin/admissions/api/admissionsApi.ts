import api from '@/config/axios';
import { getAuthToken, getTenantId } from '@/store/authStore';
import type {
  Enquiry, PipelineStage, NewEnquiryFormData, ConfirmAdmissionFormData, PipelineStats,
  RawEnquiryItem, GetAllEnquiriesResponse, StageChangeResponse,
  AdmissionDocumentRecord, GetAdmissionDocumentResponse, GetAdmissionDocumentsResponse,
} from '../types';

const SCHOOL_CODE = import.meta.env.VITE_SCHOOL_CODE ?? localStorage.getItem('schoolcode') ?? '';

// ─── Field mapping ────────────────────────────────────────────────────────────

const ALLOWED_STAGES: Record<string, PipelineStage> = {
  enquiry: 'enquiry', interview: 'interview', docs_verified: 'docs_verified',
  confirmed: 'confirmed', declined: 'declined',
};

const STAGE_ALIASES: Record<string, PipelineStage> = {
  shortlisted: 'interview', interviewing: 'interview', 'for-interview': 'interview',
  docs: 'docs_verified', doc_verified: 'docs_verified', 'docs-verified': 'docs_verified', docs_verification: 'docs_verified',
  admitted: 'confirmed', enrolled: 'confirmed', enrolled_confirmed: 'confirmed',
  rejected: 'declined', cancelled: 'declined', 'not-admitted': 'declined',
};

const mapStage = (val?: string): PipelineStage => {
  if (!val) return 'enquiry';
  const lower = val.toLowerCase().trim();
  return ALLOWED_STAGES[lower] ?? STAGE_ALIASES[lower] ?? 'enquiry';
};

const mapDocument = (doc: any) => ({
  name: doc?.name ?? doc?.document_name ?? doc?.doc_name ?? doc?.title ?? doc?.label ?? '',
  status: (doc?.status ?? doc?.document_status ?? doc?.doc_status ?? 'pending') as 'verified' | 'pending' | 'missing',
  id: doc?.id ?? doc?.document_id ?? doc?.doc_id ?? undefined,
  file_name: doc?.file_name ?? doc?.filename ?? doc?.original_name ?? doc?.upload_name ?? undefined,
  file_url: doc?.file_url ?? doc?.url ?? doc?.file_path ?? doc?.path ?? doc?.file ?? doc?.document ?? undefined,
});

const pick = <T>(item: Record<string, any>, keys: string[], fallback: T): T => {
  for (const k of keys) {
    const v = item[k];
    if (v !== undefined && v !== null && v !== '') return v as T;
  }
  return fallback;
};

const mapEnquiry = (item: RawEnquiryItem): Enquiry => {
  const obj = item as Record<string, any>;
  return {
    id: pick(obj, ['enquiry_id', 'id', '_id'], ''),
    admissionNo: pick(obj, ['admission_no', 'admissionNo', 'admission_number'], undefined),
    studentName: pick(obj, ['student_name', 'studentName', 'studentname', 'student', 'name'], ''),
    parentName: pick(obj, ['parent_name', 'parentName', 'parentname', 'parent'], ''),
    parentPhone: pick(obj, ['parent_phone', 'parentPhone', 'parentphone', 'phone', 'mobile'], ''),
    parentEmail: pick(obj, ['parent_email', 'parentEmail', 'email'], undefined),
    dateOfBirth: pick(obj, ['date_of_birth', 'dateOfBirth', 'dob', 'birth_date'], undefined),
    classApplyingFor: pick(obj, ['class_applying_for', 'classApplyingFor', 'class', 'class_name', 'className', 'applying_class'], ''),
    enquiryDate: pick(obj, ['enquiry_date', 'enquire_date', 'enquiryDate', 'date', 'created_at', 'createdAt'], ''),
    source: pick(obj, ['enquiry_source', 'source', 'enquire_source', 'source_name', 'lead_source'], 'other') as Enquiry['source'],
    referredBy: pick(obj, ['referred_by', 'referredBy', 'referrer'], undefined),
    notes: pick(obj, ['notes', 'note', 'remark'], undefined),
    stage: mapStage(pick(obj, ['stage', 'current_stage', 'stage_name', 'status', 'pipeline_status'], '')),
    declineReason: pick(obj, ['decline_reason', 'declineReason', 'reason'], undefined),
    interviewDate: pick(obj, ['interview_date', 'interviewDate', 'scheduled_date'], undefined),
    interviewNote: pick(obj, ['interview_note', 'interviewNote'], undefined),
    documents: (() => {
      const docs = obj['documents'] ?? obj['document_list'];
      return Array.isArray(docs) ? docs.map(mapDocument) : undefined;
    })(),
    section: obj['section'],
    rollNumber: pick(obj, ['roll_number', 'rollNumber', 'roll_no'], undefined),
    firstDayOfSchool: pick(obj, ['first_day_of_school', 'firstDayOfSchool'], undefined),
    annualFee: obj['annual_fee'] ?? obj['annualFee'] ?? obj['fee'],
    whatsappSent: obj['whatsapp_sent'] ?? obj['whatsappSent'] ?? obj['wa_sent'],
    welcomeWhatsappSent: obj['welcome_whatsapp_sent'] ?? obj['welcomeWhatsappSent'] ?? obj['welcome_wa_sent'],
    counselorNote: pick(obj, ['counselor_note', 'counselorNote', 'counsellor_note'], undefined),
    statusHistory: (() => {
      const hist = obj['status_history'] ?? obj['statusHistory'] ?? obj['history'];
      return Array.isArray(hist) ? hist : undefined;
    })(),
  };
};

// ─── Array extraction ─────────────────────────────────────────────────────────

const extractRawEnquiries = (raw: unknown, depth = 0): RawEnquiryItem[] => {
  if (depth > 3) return [];
  if (Array.isArray(raw)) return raw as RawEnquiryItem[];
  if (!raw || typeof raw !== 'object') return [];
  const obj = raw as Record<string, unknown>;
  const arrayKeys = ['data', 'enquiries', 'list', 'interviews', 'docs', 'records', 'items', 'result'];
  for (const key of arrayKeys) {
    const val = obj[key];
    if (Array.isArray(val)) return val as RawEnquiryItem[];
    if (val && typeof val === 'object') {
      const nested = extractRawEnquiries(val, depth + 1);
      if (nested.length > 0) return nested;
    }
  }
  for (const v of Object.values(obj)) {
    if (Array.isArray(v)) return v as RawEnquiryItem[];
  }
  return [];
};

/**
 * Extract a single AdmissionDocumentRecord from GET /getadmissiondocument/{documentId}.
 * Handles all common Django REST envelope shapes.
 */
const extractDocumentRecord = (raw: unknown): AdmissionDocumentRecord | null => {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Record<string, unknown>;

  // Unwrap envelope: { data: {...} } | { document: {...} } | { file: {...} } | bare object
  const candidate =
    (obj['data'] && typeof obj['data'] === 'object' && !Array.isArray(obj['data']) ? obj['data'] : null) ??
    (obj['document'] && typeof obj['document'] === 'object' ? obj['document'] : null) ??
    (obj['file'] && typeof obj['file'] === 'object' ? obj['file'] : null) ??
    (obj['record'] && typeof obj['record'] === 'object' ? obj['record'] : null) ??
    obj;

  const rec = candidate as Record<string, unknown>;

  const id = String(rec['id'] ?? rec['document_id'] ?? rec['doc_id'] ?? '');
  const fileName = String(rec['file_name'] ?? rec['filename'] ?? rec['name'] ?? rec['document_name'] ?? '');
  const fileUrl = String(rec['file_url'] ?? rec['url'] ?? rec['file_path'] ?? rec['path'] ?? '');

  if (!id || !fileName) return null;

  return {
    id,
    enquiry_id: String(rec['enquiry_id'] ?? rec['enquiryId'] ?? ''),
    file_name: fileName,
    file_url: fileUrl,
    file_type: rec['file_type'] != null ? String(rec['file_type']) : undefined,
    uploaded_at: rec['uploaded_at'] != null ? String(rec['uploaded_at'] ?? rec['created_at'] ?? rec['timestamp']) : undefined,
    size_bytes: typeof rec['size_bytes'] === 'number' ? rec['size_bytes']
      : typeof rec['size'] === 'number' ? rec['size']
      : typeof rec['file_size'] === 'number' ? rec['file_size']
      : undefined,
  };
};

// ─── Payload builder ──────────────────────────────────────────────────────────

const toSnake = (input: NewEnquiryFormData) => ({
  parent_name: input.parentName,
  phone: input.parentPhone,
  email: input.parentEmail ?? '',
  student_name: input.studentName,
  date_of_birth: input.dateOfBirth ?? '',
  class: input.classApplyingFor,
  enquire_date: input.enquiryDate,
  enquire_source: input.source,
  referred_by: input.referredBy ?? '',
  notes: input.notes ?? '',
  school_code: SCHOOL_CODE,
});

// ─── XHR upload helper ────────────────────────────────────────────────────────
// XHR is used (not fetch/axios) to get real upload-progress events.

export interface UploadProgressEvent {
  loaded: number;
  total: number;
  percent: number;
}

/**
 * Metadata for one document returned after a successful upload.
 * documentId is the ID used to call GET /tenant/getadmissiondocument/{documentId}.
 */
export interface UploadedDocumentMeta {
  documentId: string;
  fileName: string;
}

function getAxiosBaseURL(): string {
  // @ts-ignore
  return (api.defaults?.baseURL as string | undefined) ?? '';
}

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  const token = getAuthToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const tenantId = getTenantId();
  if (tenantId) headers['X-Tenant-Id'] = tenantId;
  return headers;
}

function xhrUpload(
  url: string,
  formData: FormData,
  onProgress?: (e: UploadProgressEvent) => void,
  signal?: AbortSignal,
): Promise<unknown> {
  return new Promise<unknown>((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress({
          loaded: event.loaded,
          total: event.total,
          percent: Math.round((event.loaded / event.total) * 100),
        });
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try { resolve(JSON.parse(xhr.responseText)); }
        catch { resolve(null); }
      } else {
        const bodyText = xhr.responseText ?? '';
        let message = `Upload failed (HTTP ${xhr.status})`;
        try {
          const body = JSON.parse(bodyText);
          message = body?.detail ?? body?.message ?? body?.error ?? bodyText;
        } catch {
          message = bodyText ? `${message} — ${bodyText.slice(0, 200)}` : message;
        }
        if (import.meta.env.DEV) {
          console.error(`[xhrUpload] ${xhr.status} ${url} body:`, bodyText.slice(0, 500));
        }
        reject(new Error(message));
      }
    });

    xhr.addEventListener('error', () => reject(new Error('Network error — upload could not complete')));
    xhr.addEventListener('abort', () => reject(new Error('Upload cancelled')));

    if (signal) signal.addEventListener('abort', () => xhr.abort());

    xhr.open('POST', url);
    Object.entries(getAuthHeaders()).forEach(([k, v]) => xhr.setRequestHeader(k, v));
    xhr.send(formData);
  });
}

/**
 * Parse document IDs from the upload response body.
 * Handles all common response shapes from Django REST:
 *   { data: [{ id, file_name }] }
 *   { document_ids: ['...'] }
 *   { id: '...', file_name: '...' }   ← single document upload
 */
function parseUploadedDocumentMeta(body: unknown, files: File[]): UploadedDocumentMeta[] {
  if (!body || typeof body !== 'object') return [];
  const obj = body as Record<string, unknown>;

  // Shape: { data: [ { id, file_name, ... } ] }
  for (const key of ['data', 'documents', 'files', 'records']) {
    const val = obj[key];
    if (Array.isArray(val) && val.length > 0) {
      const result: UploadedDocumentMeta[] = [];
      val.forEach((item: any, i) => {
        const id = String(item?.id ?? item?.document_id ?? item?.doc_id ?? '');
        if (id) result.push({ documentId: id, fileName: item?.file_name ?? item?.name ?? files[i]?.name ?? `doc-${i + 1}` });
      });
      if (result.length) return result;
    }
  }

  // Shape: { document_ids: ['uuid1', 'uuid2'] }
  for (const key of ['document_ids', 'doc_ids', 'ids']) {
    const val = obj[key];
    if (Array.isArray(val) && val.length > 0) {
      return val
        .filter((id): id is string => typeof id === 'string' && id.length > 0)
        .map((id, i) => ({ documentId: id, fileName: files[i]?.name ?? `doc-${i + 1}` }));
    }
  }

  // Shape: single record { id: 'uuid', file_name: '...' }
  const singleId = String(obj['id'] ?? obj['document_id'] ?? obj['doc_id'] ?? '');
  if (singleId) {
    return [{ documentId: singleId, fileName: String(obj['file_name'] ?? obj['name'] ?? files[0]?.name ?? 'document') }];
  }

  return [];
}

// ─── API surface ──────────────────────────────────────────────────────────────

export const admissionsApi = {

  /** GET /tenant/getenquiries?school_code=... */
  async getEnquiries(): Promise<Enquiry[]> {
    try {
      const { data } = await api.get<GetAllEnquiriesResponse>('/tenant/getenquiries', {
        params: { school_code: SCHOOL_CODE },
      });
      const raw = extractRawEnquiries(data);
      const mapped = raw.map(mapEnquiry);
      if (import.meta.env.DEV) {
        console.groupCollapsed('[admissions] GET /tenant/getenquiries');
        console.log('items:', mapped.length, '| school_code:', SCHOOL_CODE);
        if (raw[0]) { console.log('first raw:', raw[0]); console.log('first mapped:', mapped[0]); }
        console.groupEnd();
      }
      return mapped;
    } catch (err: any) {
      const ctx = err?.response?.data ?? err?.message;
      console.error('[admissions] getEnquiries failed', ctx);
      throw new Error(ctx?.message ?? ctx?.error ?? 'Failed to fetch enquiries');
    }
  },

  /** GET /tenant/getinterviewlist */
  async getInterviewList(): Promise<Enquiry[]> {
    try {
      const { data } = await api.get<GetAllEnquiriesResponse>('/tenant/getinterviewlist');
      const raw = extractRawEnquiries(data);
      return raw.map(mapEnquiry);
    } catch (err: any) {
      const ctx = err?.response?.data ?? err?.message;
      console.error('[admissions] getInterviewList failed', ctx);
      throw new Error(ctx?.message ?? ctx?.error ?? 'Failed to fetch interview list');
    }
  },

  /** GET /tenant/getdocsverificationlist */
  async getDocsVerificationList(): Promise<Enquiry[]> {
    try {
      const { data } = await api.get<GetAllEnquiriesResponse>('/tenant/getdocsverificationlist');
      const raw = extractRawEnquiries(data);
      return raw.map(mapEnquiry);
    } catch (err: any) {
      const ctx = err?.response?.data ?? err?.message;
      console.error('[admissions] getDocsVerificationList failed', ctx);
      throw new Error(ctx?.message ?? ctx?.error ?? 'Failed to fetch docs verification list');
    }
  },

  /** GET /tenant/getenquiries — compute pipeline stats from all enquiries */
  async getPipelineStats(): Promise<PipelineStats> {
    try {
      const { data } = await api.get<GetAllEnquiriesResponse>('/tenant/getenquiries');
      const obj = data as Record<string, unknown>;

      // Strategy 1: Use counts object if present (most efficient)
      const countsObj =
        (obj['counts'] && typeof obj['counts'] === 'object' && !Array.isArray(obj['counts'])
          ? (obj['counts'] as Record<string, unknown>)
          : null);
      if (countsObj) {
        const extractCount = (keys: string[]): number => {
          for (const k of keys) {
            const v = countsObj[k];
            if (typeof v === 'number') return v;
          }
          return 0;
        };
        const enquiries = extractCount(['enquiry', 'enquiries']);
        const interviews = extractCount(['interview', 'interviews']);
        const docsVerified = extractCount(['docs_verified', 'docs_verification', 'docs', 'doc_verified']);
        const confirmed = extractCount(['confirmed']);
        const declined = extractCount(['declined', 'rejected']);
        const total = enquiries + interviews + docsVerified + confirmed + declined;
        const conversionRate = total > 0 ? (confirmed / total) * 100 : 0;
        if (import.meta.env.DEV) {
          console.log('[admissions] getPipelineStats (direct counts):', {
            enquiries, interviews, docsVerified, confirmed, declined, conversionRate,
          });
        }
        return { enquiries, interviews, docsVerified, confirmed, declined, conversionRate };
      }

      // Strategy 2: Iterate through items
      const items = extractRawEnquiries(data);
      let enquiries = 0;
      let interviews = 0;
      let docsVerified = 0;
      let confirmed = 0;
      let declined = 0;

      for (const item of items) {
        const itemObj = item as Record<string, unknown>;
        const rawStage = String(
          itemObj['stage'] ?? itemObj['current_stage'] ?? itemObj['stage_name'] ?? itemObj['status'] ?? itemObj['pipeline_status'] ?? '',
        );
        const stage = mapStage(rawStage);
        if (stage === 'enquiry') enquiries++;
        else if (stage === 'interview') interviews++;
        else if (stage === 'docs_verified') docsVerified++;
        else if (stage === 'confirmed') confirmed++;
        else if (stage === 'declined') declined++;
      }

      const total = enquiries + interviews + docsVerified + confirmed + declined;
      const conversionRate = total > 0 ? (confirmed / total) * 100 : 0;

      if (import.meta.env.DEV) {
        console.log('[admissions] getPipelineStats from /tenant/getenquiries:', {
          enquiries, interviews, docsVerified, confirmed, declined, conversionRate,
          totalItems: items.length,
        });
      }

      return { enquiries, interviews, docsVerified, confirmed, declined, conversionRate };
    } catch (err: any) {
      const ctx = err?.response?.data ?? err?.message;
      console.error('[admissions] getPipelineStats via /tenant/getenquiries failed', ctx);
      throw new Error(ctx?.message ?? ctx?.error ?? 'Failed to fetch pipeline stats');
    }
  },

  /** POST /tenant/createadmissions */
  async addEnquiry(input: NewEnquiryFormData): Promise<Enquiry> {
    const payload = toSnake(input);
    try {
      const { data } = await api.post<GetAllEnquiriesResponse>('/tenant/createadmissions', payload);
      const raw = extractRawEnquiries(data);
      return raw.length > 0 ? mapEnquiry(raw[0]) : ({} as Enquiry);
    } catch (err: any) {
      const ctx = err?.response?.data ?? err?.message;
      console.error('[admissions] addEnquiry failed', { payload, response: ctx });
      throw new Error(ctx?.message ?? JSON.stringify(ctx) ?? err?.message ?? 'Failed to create enquiry');
    }
  },

  /** PUT /tenant/shortlist-to-interview/{id} */
  async shortlistToInterview(id: string): Promise<void> {
    try {
      await api.put<StageChangeResponse>(`/tenant/shortlist-to-interview/${id}`);
    } catch (err: any) {
      const status = err?.response?.status;
      const ctx = err?.response?.data ?? err?.message;
      const body = typeof ctx === 'object' ? JSON.stringify(ctx) : String(ctx ?? '');
      console.error(`[admissions] shortlistToInterview failed (HTTP ${status})`, { id, body: body.slice(0, 500) });
      throw new Error(ctx?.message ?? ctx?.error ?? `Failed to shortlist for interview (HTTP ${status})`);
    }
  },

  /** PUT /tenant/shortlist-to-docs/{id} */
  async shortlistToDocs(id: string): Promise<void> {
    try {
      await api.put<StageChangeResponse>(`/tenant/shortlist-to-docs/${id}`);
    } catch (err: any) {
      const status = err?.response?.status;
      const ctx = err?.response?.data ?? err?.message;
      const body = typeof ctx === 'object' ? JSON.stringify(ctx) : String(ctx ?? '');
      console.error(`[admissions] shortlistToDocs failed (HTTP ${status})`, { id, body: body.slice(0, 500) });
      throw new Error(ctx?.message ?? ctx?.error ?? `Failed to shortlist for docs (HTTP ${status})`);
    }
  },

  /** POST /tenant/confirm-admission/{id} */
  async confirmAdmission(id: string, input: ConfirmAdmissionFormData): Promise<void> {
    const payload = {
      section: input.section,
      roll_number: input.rollNumber,
      first_day_of_school: input.firstDayOfSchool,
      notes: input.notes ?? '',
    };
    try {
      await api.post(`/tenant/confirm-admission/${id}`, payload);
    } catch (err: any) {
      const ctx = err?.response?.data ?? err?.message;
      console.error('[admissions] confirmAdmission failed', { id, payload, response: ctx });
      throw new Error(ctx?.message ?? ctx?.error ?? 'Failed to confirm admission');
    }
  },

  /** POST /tenant/decline-admission/{id} */
  async declineAdmission(id: string, reason: string): Promise<void> {
    try {
      await api.post(`/tenant/decline-admission/${id}`, { reason });
    } catch (err: any) {
      const ctx = err?.response?.data ?? err?.message;
      console.error('[admissions] declineAdmission failed', { id, reason, response: ctx });
      throw new Error(ctx?.message ?? ctx?.error ?? 'Failed to decline admission');
    }
  },

  // ─── Document upload ─────────────────────────────────────────────────────

  /**
   * POST /tenant/uploadadmissiondocument/{enquiryId}
   *
   * Used by: InterviewCard
   *
   * Uploads files as multipart/form-data (field name: "documents").
   * Uses XHR so progress events are available.
   * Returns UploadedDocumentMeta[] — each item contains the documentId
   * needed to call getAdmissionDocument() in DocsVerifiedCard.
   */
  async uploadAdmissionDocuments(
    enquiryId: string,
    files: File[],
    onProgress?: (e: UploadProgressEvent) => void,
    signal?: AbortSignal,
  ): Promise<UploadedDocumentMeta[]> {
    if (!enquiryId) throw new Error('enquiryId is required');
    if (!files.length) throw new Error('No files provided');

    const formData = new FormData();
    // Django REST expects the field name "file" by convention
    files.forEach((file) => formData.append('file', file));

    const base = getAxiosBaseURL().replace(/\/$/, '');
    const url = `${base}/tenant/uploadadmissiondocument/${enquiryId}`;

    if (import.meta.env.DEV) {
      console.log('[admissions] POST', url, '| files:', files.map((f) => `${f.name} (${f.type}, ${f.size}B)`));
      console.log('[admissions] FormData keys:', [...formData.keys()]);
    }

    const responseBody = await xhrUpload(url, formData, onProgress, signal);
    const meta = parseUploadedDocumentMeta(responseBody, files);

    if (import.meta.env.DEV) {
      console.log('[admissions] upload → documentIds:', meta.map((m) => m.documentId));
    }

    return meta;
  },

  // ─── Document fetch ──────────────────────────────────────────────────────

  /**
   * GET /tenant/getadmissiondocument/{documentId}
   *
   * Used by: DocsVerifiedCard
   *
   * Fetches metadata for one uploaded document by its server-assigned ID.
   * Returns null on 404 (document deleted / ID stale) instead of throwing,
   * so the card degrades gracefully.
   */
  async getAdmissionDocument(documentId: string): Promise<AdmissionDocumentRecord | null> {
    if (!documentId) return null;

    const url = `/tenant/getadmissiondocument/${documentId}`;

    try {
      const { data } = await api.get<GetAdmissionDocumentResponse>(url);
      const record = extractDocumentRecord(data);
      if (!record) {
        console.warn('[admissions] getAdmissionDocument: unparseable response', { url, data });
        return null;
      }
      return record;
    } catch (err: any) {
      const status: number | undefined = err?.response?.status;
      if (status === 404) {
        console.warn('[admissions] getAdmissionDocument: not found', { documentId });
        return null;
      }
      const ctx = err?.response?.data ?? err?.message;
      console.error('[admissions] getAdmissionDocument failed', { url, status, response: ctx });
      throw new Error(ctx?.message ?? ctx?.error ?? 'Failed to fetch document');
    }
  },

  /**
   * Batch-fetch document records by IDs in parallel.
   * Used by DocsVerifiedCard to display all uploaded files for an enquiry.
   * Dropped results (null / 404) are filtered out silently.
   */
  async getAdmissionDocumentsByIds(documentIds: string[]): Promise<AdmissionDocumentRecord[]> {
    if (!documentIds.length) return [];

    const settled = await Promise.allSettled(
      documentIds.map((id) => admissionsApi.getAdmissionDocument(id)),
    );

    return settled
      .filter((r): r is PromiseFulfilledResult<AdmissionDocumentRecord | null> => r.status === 'fulfilled')
      .map((r) => r.value)
      .filter((v): v is AdmissionDocumentRecord => v !== null);
  },

  // ─── Document list by enquiry ────────────────────────────────────────────

  /**
   * Extract an array of AdmissionDocumentRecord from a list API response.
   * Handles: { data: [...] }, { documents: [...] }, { files: [...] }, bare [...]
   */
  extractDocumentRecords(raw: unknown): AdmissionDocumentRecord[] {
    if (!raw || typeof raw !== 'object') return [];
    const obj = raw as Record<string, unknown>;

    for (const key of ['data', 'documents', 'files', 'records', 'list', 'items']) {
      const val = obj[key];
      if (Array.isArray(val)) {
        return val
          .map((item) => {
            if (!item || typeof item !== 'object') return null;
            return extractDocumentRecord({ data: item }) ?? extractDocumentRecord(item);
          })
          .filter((r): r is AdmissionDocumentRecord => r !== null);
      }
    }

    // Bare array at root
    if (Array.isArray(obj['0'] ?? null)) {
      return (obj as unknown as unknown[])
        .map((item: unknown) => {
          if (!item || typeof item !== 'object') return null;
          return extractDocumentRecord({ data: item }) ?? extractDocumentRecord(item);
        })
        .filter((r): r is AdmissionDocumentRecord => r !== null);
    }

    return [];
  },

  /**
   * GET /tenant/getadmissiondocuments/{enquiryId}
   *
   * Optional — not all backends expose a list-by-enquiry endpoint.
   * Document records are typically embedded in the Enquiry object from
   * GET /tenant/getenquiries and mapped via mapDocument() above.
   *
   * Returns empty array on 404/error so callers degrade gracefully.
   */
  async getAdmissionDocuments(enquiryId: string): Promise<AdmissionDocumentRecord[]> {
    if (!enquiryId) return [];

    const url = `/tenant/getadmissiondocuments/${enquiryId}`;

    try {
      const { data } = await api.get<GetAdmissionDocumentsResponse>(url);
      const records = admissionsApi.extractDocumentRecords(data);
      return records;
    } catch {
      return [];
    }
  },
};
