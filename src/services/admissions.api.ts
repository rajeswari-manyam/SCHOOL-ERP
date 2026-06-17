import api from '@/config/axios';
import { getAuthToken, getTenantId } from '@/store/authStore';
import type {
  Enquiry, PipelineStage, NewEnquiryFormData, ConfirmAdmissionFormData, PipelineStats,
  RawEnquiryItem, GetAllEnquiriesResponse, StageChangeResponse,
  AdmissionDocumentRecord, GetAdmissionDocumentResponse, GetAdmissionDocumentsResponse,
} from '@/features/school-admin/admissions/types';

// ─── Dynamic helpers ──────────────────────────────────────────────────────────

/** Always read fresh from localStorage so it works even if user logs in after module load */
function getSchoolCode(): string {
  return import.meta.env.VITE_SCHOOL_CODE ?? localStorage.getItem('schoolcode') ?? '';
}

// ─── Stage mapping ────────────────────────────────────────────────────────────

const STAGE_MAP: Record<string, PipelineStage> = {
  // exact
  enquiry: 'enquiry',
  interview: 'interview',
  docs_verified: 'docs_verified',
  confirmed: 'confirmed',
  declined: 'declined',
  // aliases from backend
  docs_verification: 'docs_verified',
  doc_verified: 'docs_verified',
  'docs-verified': 'docs_verified',
  docs: 'docs_verified',
  shortlisted: 'interview',
  interviewing: 'interview',
  'for-interview': 'interview',
  admitted: 'confirmed',
  enrolled: 'confirmed',
  rejected: 'declined',
  cancelled: 'declined',
};

const mapStage = (val?: string): PipelineStage => {
  if (!val) return 'enquiry';
  return STAGE_MAP[val.toLowerCase().trim()] ?? 'enquiry';
};

// ─── Field pickers ────────────────────────────────────────────────────────────

const pick = <T>(obj: Record<string, any>, keys: string[], fallback: T): T => {
  for (const k of keys) {
    const v = obj[k];
    if (v !== undefined && v !== null && v !== '') return v as T;
  }
  return fallback;
};

// ─── Response mappers ─────────────────────────────────────────────────────────

const mapDocument = (doc: any) => ({
  name:     doc?.name ?? doc?.document_name ?? doc?.doc_name ?? doc?.title ?? doc?.label ?? '',
  status:   (doc?.status ?? doc?.document_status ?? 'pending') as 'verified' | 'pending' | 'missing',
  id:       doc?.id ?? doc?.document_id ?? undefined,
  file_name: doc?.file_name ?? doc?.filename ?? doc?.original_name ?? undefined,
  file_url:  doc?.file_url ?? doc?.url ?? doc?.file_path ?? doc?.path ?? undefined,
});

const mapEnquiry = (item: RawEnquiryItem): Enquiry => {
  const o = item as Record<string, any>;
  return {
    id:               pick(o, ['enquiry_id', 'id', '_id'], ''),
    admissionNo:      pick(o, ['admission_no', 'admissionNo', 'admission_number'], undefined),
    studentName:      pick(o, ['student_name', 'studentName', 'student', 'name'], ''),
    parentName:       pick(o, ['parent_name', 'parentName', 'parent'], ''),
    parentPhone:      pick(o, ['parent_phone', 'parentPhone', 'phone', 'mobile'], ''),
    parentEmail:      pick(o, ['parent_email', 'parentEmail', 'email'], undefined),
    dateOfBirth:      pick(o, ['date_of_birth', 'dateOfBirth', 'dob'], undefined),
    classApplyingFor: pick(o, ['class_applying_for', 'classApplyingFor', 'class', 'class_name', 'className'], ''),
    enquiryDate:      pick(o, ['enquiry_date', 'enquire_date', 'enquiryDate', 'createdAt', 'created_at'], ''),
    source:           pick(o, ['enquiry_source', 'enquire_source', 'source', 'lead_source'], 'other') as Enquiry['source'],
    referredBy:       pick(o, ['referred_by', 'referredBy', 'referrer'], undefined),
    notes:            pick(o, ['notes', 'note', 'remark'], undefined),
    stage:            mapStage(pick(o, ['stage', 'status', 'current_stage', 'pipeline_status'], '')),
    declineReason:    pick(o, ['decline_reason', 'declineReason', 'reason'], undefined),
    interviewDate:    pick(o, ['interview_date', 'interviewDate', 'scheduled_date'], undefined),
    interviewNote:    pick(o, ['interview_note', 'interviewNote'], undefined),
    documents:        (() => {
      const docs = o['documents'] ?? o['document_list'];
      return Array.isArray(docs) ? docs.map(mapDocument) : undefined;
    })(),
    section:          o['section'],
    rollNumber:       pick(o, ['roll_number', 'rollNumber', 'roll_no'], undefined),
    firstDayOfSchool: pick(o, ['first_day_of_school', 'firstDayOfSchool'], undefined),
    annualFee:        o['annual_fee'] ?? o['annualFee'] ?? o['fee'],
    whatsappSent:     o['whatsapp_sent'] ?? o['whatsappSent'] ?? o['wa_sent'],
    welcomeWhatsappSent: o['welcome_whatsapp_sent'] ?? o['welcomeWhatsappSent'],
    counselorNote:    pick(o, ['counselor_note', 'counselorNote', 'counsellor_note'], undefined),
    statusHistory:    (() => {
      const h = o['status_history'] ?? o['statusHistory'] ?? o['history'];
      return Array.isArray(h) ? h : undefined;
    })(),
  };
};

// ─── Extract arrays from various envelope shapes ──────────────────────────────

const extractList = (raw: unknown, depth = 0): RawEnquiryItem[] => {
  if (depth > 3 || !raw) return [];
  if (Array.isArray(raw)) return raw as RawEnquiryItem[];
  if (typeof raw !== 'object') return [];
  const o = raw as Record<string, unknown>;
  for (const k of ['data', 'enquiries', 'list', 'interviews', 'docs', 'records', 'items', 'result']) {
    const v = o[k];
    if (Array.isArray(v)) return v as RawEnquiryItem[];
    if (v && typeof v === 'object') {
      const nested = extractList(v, depth + 1);
      if (nested.length) return nested;
    }
  }
  for (const v of Object.values(o)) {
    if (Array.isArray(v)) return v as RawEnquiryItem[];
  }
  return [];
};

/** Extract the counts object returned by every API endpoint */
const extractCounts = (raw: unknown): Record<string, number> | null => {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const c = o['counts'];
  if (c && typeof c === 'object' && !Array.isArray(c)) return c as Record<string, number>;
  return null;
};

const num = (obj: Record<string, number>, keys: string[]): number => {
  for (const k of keys) if (typeof obj[k] === 'number') return obj[k];
  return 0;
};

// ─── Document helpers ─────────────────────────────────────────────────────────

const extractDocumentRecord = (raw: unknown): AdmissionDocumentRecord | null => {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const candidate = (
    (o['data'] && typeof o['data'] === 'object' && !Array.isArray(o['data']) ? o['data'] : null) ??
    (o['document'] && typeof o['document'] === 'object' ? o['document'] : null) ??
    o
  ) as Record<string, unknown>;

  const id       = String(candidate['id'] ?? candidate['document_id'] ?? '');
  const fileName = String(candidate['file_name'] ?? candidate['filename'] ?? candidate['original_name'] ?? candidate['name'] ?? '');
  if (!id || !fileName) return null;

  return {
    id,
    enquiry_id:  String(candidate['enquiry_id'] ?? candidate['admission_id'] ?? ''),
    file_name:   fileName,
    file_url:    String(candidate['file_url'] ?? candidate['url'] ?? candidate['file_path'] ?? candidate['path'] ?? ''),
    file_type:   candidate['file_type'] != null ? String(candidate['file_type']) : undefined,
    uploaded_at: candidate['uploaded_at'] != null ? String(candidate['uploaded_at'] ?? candidate['created_at']) : undefined,
    size_bytes:  typeof candidate['size_bytes'] === 'number' ? candidate['size_bytes']
               : typeof candidate['file_size'] === 'number' ? candidate['file_size']
               : undefined,
  };
};

const extractDocumentList = (raw: unknown): AdmissionDocumentRecord[] => {
  if (!raw || typeof raw !== 'object') return [];
  const o = raw as Record<string, unknown>;
  for (const k of ['data', 'documents', 'files', 'records', 'list', 'items']) {
    const v = o[k];
    if (Array.isArray(v)) {
      return v
        .map((item) => extractDocumentRecord({ data: item }) ?? extractDocumentRecord(item))
        .filter((r): r is AdmissionDocumentRecord => r !== null);
    }
  }
  return [];
};

// ─── XHR upload (supports progress) ──────────────────────────────────────────

export interface UploadProgressEvent { loaded: number; total: number; percent: number }
export interface UploadedDocumentMeta { documentId: string; fileName: string }

function getAxiosBaseURL(): string {
  // @ts-ignore
  return (api.defaults?.baseURL as string | undefined) ?? '';
}

function getAuthHeaders(): Record<string, string> {
  const h: Record<string, string> = {};
  const token = getAuthToken();
  if (token) h['Authorization'] = `Bearer ${token}`;
  const tid = getTenantId();
  if (tid) h['X-Tenant-Id'] = tid;
  return h;
}

function xhrUpload(
  url: string,
  formData: FormData,
  onProgress?: (e: UploadProgressEvent) => void,
  signal?: AbortSignal,
): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress({ loaded: e.loaded, total: e.total, percent: Math.round((e.loaded / e.total) * 100) });
      }
    });
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try { resolve(JSON.parse(xhr.responseText)); } catch { resolve(null); }
      } else {
        const text = xhr.responseText ?? '';
        let msg = `Upload failed (HTTP ${xhr.status})`;
        try { const b = JSON.parse(text); msg = b?.detail ?? b?.message ?? b?.error ?? text; } catch {}
        reject(new Error(msg));
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

function parseUploadMeta(body: unknown, files: File[]): UploadedDocumentMeta[] {
  if (!body || typeof body !== 'object') return [];
  const o = body as Record<string, unknown>;

  for (const k of ['data', 'documents', 'files', 'records']) {
    const v = o[k];
    if (Array.isArray(v) && v.length) {
      return v
        .map((item: any, i) => {
          const id = String(item?.id ?? item?.document_id ?? '');
          return id ? { documentId: id, fileName: item?.file_name ?? item?.original_name ?? files[i]?.name ?? `doc-${i + 1}` } : null;
        })
        .filter(Boolean) as UploadedDocumentMeta[];
    }
  }

  const singleId = String(o['id'] ?? o['document_id'] ?? '');
  if (singleId) {
    return [{ documentId: singleId, fileName: String(o['file_name'] ?? o['original_name'] ?? files[0]?.name ?? 'document') }];
  }
  return [];
}

// ─── Error helper ─────────────────────────────────────────────────────────────

function apiError(err: any, fallback: string): Error {
  const ctx = err?.response?.data ?? err?.message ?? err;
  return new Error(
    (typeof ctx === 'object' ? ctx?.message ?? ctx?.error ?? JSON.stringify(ctx) : ctx) ?? fallback,
  );
}

// ─── Payload builder (enquiry creation) ──────────────────────────────────────

const toCreatePayload = (input: NewEnquiryFormData) => ({
  parent_name:    input.parentName,
  phone:          input.parentPhone,
  email:          input.parentEmail ?? '',
  student_name:   input.studentName,
  date_of_birth:  input.dateOfBirth ?? '',
  class:          input.classApplyingFor,
  enquire_date:   input.enquiryDate,
  enquire_source: input.source,
  referred_by:    input.referredBy ?? '',
  notes:          input.notes ?? '',
  school_code:    getSchoolCode(),
});

// ─── Public API ───────────────────────────────────────────────────────────────

export const admissionsApi = {

  // ── Stage lists ──────────────────────────────────────────────────────────

  /** GET /tenant/getenquiries?school_code=... → stage "enquiry" records */
  async getEnquiries(academicYearId?: string | null): Promise<Enquiry[]> {
    const params: Record<string, string> = { school_code: getSchoolCode() };
    if (academicYearId) params.academicYearId = academicYearId;
    try {
      const { data } = await api.get<GetAllEnquiriesResponse>('/tenant/getenquiries', { params });
      return extractList(data).map(mapEnquiry);
    } catch (err) { throw apiError(err, 'Failed to fetch enquiries'); }
  },

  /** GET /tenant/getinterviewlist?school_code=... → stage "interview" records */
  async getInterviewList(academicYearId?: string | null): Promise<Enquiry[]> {
    const params: Record<string, string> = { school_code: getSchoolCode() };
    if (academicYearId) params.academicYearId = academicYearId;
    try {
      const { data } = await api.get<GetAllEnquiriesResponse>('/tenant/getinterviewlist', { params });
      return extractList(data).map(mapEnquiry);
    } catch (err) { throw apiError(err, 'Failed to fetch interview list'); }
  },

  /** GET /tenant/getdocsverificationlist?school_code=... → stage "docs_verified" records */
  async getDocsVerificationList(academicYearId?: string | null): Promise<Enquiry[]> {
    const params: Record<string, string> = { school_code: getSchoolCode() };
    if (academicYearId) params.academicYearId = academicYearId;
    try {
      const { data } = await api.get<GetAllEnquiriesResponse>('/tenant/getdocsverificationlist', { params });
      return extractList(data).map(mapEnquiry);
    } catch (err) { throw apiError(err, 'Failed to fetch docs verification list'); }
  },

  /** GET /tenant/getconfirmedadmissions?school_code=... → stage "confirmed" records */
  async getConfirmedAdmissions(academicYearId?: string | null): Promise<Enquiry[]> {
    const params: Record<string, string> = { school_code: getSchoolCode() };
    if (academicYearId) params.academicYearId = academicYearId;
    try {
      const { data } = await api.get<GetAllEnquiriesResponse>('/tenant/getconfirmedadmissions', { params });
      return extractList(data).map(mapEnquiry);
    } catch (err) { throw apiError(err, 'Failed to fetch confirmed admissions'); }
  },

  /** GET /tenant/getdeclinedadmissions?school_code=... → stage "declined" records */
  async getDeclinedAdmissions(academicYearId?: string | null): Promise<Enquiry[]> {
    const params: Record<string, string> = { school_code: getSchoolCode() };
    if (academicYearId) params.academicYearId = academicYearId;
    try {
      const { data } = await api.get<GetAllEnquiriesResponse>('/tenant/getdeclinedadmissions', { params });
      return extractList(data).map(mapEnquiry);
    } catch (err) { throw apiError(err, 'Failed to fetch declined admissions'); }
  },

  // ── Stats (reads counts object from any stage endpoint) ──────────────────

  /** GET /tenant/getenquiries — counts object is returned by every endpoint */
  async getPipelineStats(academicYearId?: string | null): Promise<PipelineStats> {
    const params: Record<string, string> = { school_code: getSchoolCode() };
    if (academicYearId) params.academicYearId = academicYearId;
    try {
      const { data } = await api.get<GetAllEnquiriesResponse>('/tenant/getenquiries', { params });
      const counts = extractCounts(data);
      if (counts) {
        const enquiries    = num(counts, ['enquiry', 'enquiries']);
        const interviews   = num(counts, ['interview', 'interviews']);
        const docsVerified = num(counts, ['docs_verification', 'docs_verified', 'docs']);
        const confirmed    = num(counts, ['confirmed']);
        const declined     = num(counts, ['declined', 'rejected']);
        const total        = enquiries + interviews + docsVerified + confirmed + declined;
        return { enquiries, interviews, docsVerified, confirmed, declined, conversionRate: total ? (confirmed / total) * 100 : 0 };
      }
      // Fallback: count from list items (should not normally reach here)
      const items = extractList(data);
      let [enquiries, interviews, docsVerified, confirmed, declined] = [0, 0, 0, 0, 0];
      for (const item of items.map(mapEnquiry)) {
        if (item.stage === 'enquiry')       enquiries++;
        else if (item.stage === 'interview')     interviews++;
        else if (item.stage === 'docs_verified') docsVerified++;
        else if (item.stage === 'confirmed')     confirmed++;
        else if (item.stage === 'declined')      declined++;
      }
      const total = enquiries + interviews + docsVerified + confirmed + declined;
      return { enquiries, interviews, docsVerified, confirmed, declined, conversionRate: total ? (confirmed / total) * 100 : 0 };
    } catch (err) { throw apiError(err, 'Failed to fetch pipeline stats'); }
  },

  // ── Create enquiry ────────────────────────────────────────────────────────

  /** POST /tenant/createadmissions */
  async addEnquiry(input: NewEnquiryFormData): Promise<Enquiry> {
    const payload = toCreatePayload(input);
    try {
      const { data } = await api.post<GetAllEnquiriesResponse>('/tenant/createadmissions', payload);
      const list = extractList(data);
      return list.length ? mapEnquiry(list[0]) : ({} as Enquiry);
    } catch (err) { throw apiError(err, 'Failed to create enquiry'); }
  },

  // ── Stage transitions ─────────────────────────────────────────────────────

  /** PUT /tenant/shortlist-to-interview/{id} */
  async shortlistToInterview(id: string): Promise<void> {
    try {
      await api.put<StageChangeResponse>(`/tenant/shortlist-to-interview/${id}`);
    } catch (err) { throw apiError(err, 'Failed to move to interview stage'); }
  },

  /** PUT /tenant/shortlist-to-docs/{id} */
  async shortlistToDocs(id: string): Promise<void> {
    try {
      await api.put<StageChangeResponse>(`/tenant/shortlist-to-docs/${id}`);
    } catch (err) { throw apiError(err, 'Failed to move to docs verification stage'); }
  },

  /** PUT /tenant/confirm-admission/{id} */
  async confirmAdmissionDirect(id: string): Promise<void> {
    try {
      await api.put(`/tenant/confirm-admission/${id}`);
    } catch (err) { throw apiError(err, 'Failed to confirm admission'); }
  },

  /** PUT /tenant/decline-admission/{id} */
  async declineAdmissionDirect(id: string): Promise<void> {
    try {
      await api.put(`/tenant/decline-admission/${id}`);
    } catch (err) { throw apiError(err, 'Failed to decline admission'); }
  },

  // ── Legacy modal-based confirm (kept for ConfirmAdmissionModal) ───────────

  /** PUT /tenant/confirm-admission/{id} (modal flow with extra form data) */
  async confirmAdmission(id: string, _input: ConfirmAdmissionFormData): Promise<void> {
    try {
      await api.put(`/tenant/confirm-admission/${id}`);
    } catch (err) { throw apiError(err, 'Failed to confirm admission'); }
  },

  // ── Document upload ───────────────────────────────────────────────────────

  /** POST /tenant/uploadadmissiondocument/{enquiryId} (multipart) */
  async uploadAdmissionDocuments(
    enquiryId: string,
    files: File[],
    onProgress?: (e: UploadProgressEvent) => void,
    signal?: AbortSignal,
  ): Promise<UploadedDocumentMeta[]> {
    if (!enquiryId) throw new Error('enquiryId is required');
    if (!files.length) throw new Error('No files provided');

    const formData = new FormData();
    files.forEach((f) => formData.append('file', f));

    const url = `${getAxiosBaseURL().replace(/\/$/, '')}/tenant/uploadadmissiondocument/${enquiryId}`;
    const body = await xhrUpload(url, formData, onProgress, signal);
    return parseUploadMeta(body, files);
  },

  // ── Document fetch ────────────────────────────────────────────────────────

  /** GET /tenant/getadmissiondocuments/{enquiryId} */
  async getAdmissionDocuments(enquiryId: string): Promise<AdmissionDocumentRecord[]> {
    if (!enquiryId) return [];
    try {
      const { data } = await api.get<GetAdmissionDocumentsResponse>(`/tenant/getadmissiondocuments/${enquiryId}`);
      return extractDocumentList(data);
    } catch { return []; }
  },

  /** GET /tenant/getadmissiondocument/{documentId} */
  async getAdmissionDocument(documentId: string): Promise<AdmissionDocumentRecord | null> {
    if (!documentId) return null;
    try {
      const { data } = await api.get<GetAdmissionDocumentResponse>(`/tenant/getadmissiondocument/${documentId}`);
      return extractDocumentRecord(data);
    } catch (err: any) {
      if (err?.response?.status === 404) return null;
      throw apiError(err, 'Failed to fetch document');
    }
  },

  /** Batch fetch document records by IDs */
  async getAdmissionDocumentsByIds(documentIds: string[]): Promise<AdmissionDocumentRecord[]> {
    if (!documentIds.length) return [];
    const settled = await Promise.allSettled(documentIds.map((id) => admissionsApi.getAdmissionDocument(id)));
    return settled
      .filter((r): r is PromiseFulfilledResult<AdmissionDocumentRecord | null> => r.status === 'fulfilled')
      .map((r) => r.value)
      .filter((v): v is AdmissionDocumentRecord => v !== null);
  },
};
