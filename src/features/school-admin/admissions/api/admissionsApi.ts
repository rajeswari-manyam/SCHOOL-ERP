import api from '@/config/axios';
import type {
  Enquiry, PipelineStage, NewEnquiryFormData, ConfirmAdmissionFormData, PipelineStats,
  RawEnquiryItem, GetAllEnquiriesResponse, StageChangeResponse,
} from '../types';

const SCHOOL_CODE = import.meta.env.VITE_SCHOOL_CODE ?? localStorage.getItem("schoolcode") ?? "";

// ─── Field mapping ───────────────────────────────────────────────────────────

const ALLOWED_STAGES: Record<string, PipelineStage> = {
  enquiry: 'enquiry', interview: 'interview', docs_verified: 'docs_verified',
  confirmed: 'confirmed', declined: 'declined',
};

const STAGE_ALIASES: Record<string, PipelineStage> = {
  shortlisted: 'interview', interviewing: 'interview', 'for-interview': 'interview',
  docs: 'docs_verified', doc_verified: 'docs_verified', 'docs-verified': 'docs_verified',
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

// ─── Array extraction (handles nested & varied response shapes) ─────────────

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

// ─── Payload builder ────────────────────────────────────────────────────────

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

export const admissionsApi = {
  /** GET /tenant/getenquiries?school_code=... */
  async getEnquiries(): Promise<Enquiry[]> {
    try {
      const { data } = await api.get<GetAllEnquiriesResponse>('/tenant/getenquiries', {
        params: { school_code: SCHOOL_CODE },
      });
      const raw = extractRawEnquiries(data);
      const mapped = raw.length > 0 ? raw.map(mapEnquiry) : [];

      console.groupCollapsed('[admissions] GET /tenant/getenquiries');
      console.log('school_code:', SCHOOL_CODE);
      console.log('raw response:', data);
      console.log('extracted items:', raw.length);
      console.log('mapped enquiries:', mapped.length);
      if (raw.length > 0) {
        console.log('first raw item:', raw[0]);
        console.log('first mapped item:', mapped[0]);
      }
      console.groupEnd();

      return mapped;
    } catch (err: any) {
      const ctx = err?.response?.data ?? err?.message;
      console.error('getEnquiries failed', { url: '/tenant/getenquiries', response: ctx });
      throw new Error(ctx?.message ?? ctx?.error ?? 'Failed to fetch enquiries');
    }
  },

  /** GET /tenant/getinterviewlist */
  async getInterviewList(): Promise<Enquiry[]> {
    try {
      const { data } = await api.get<GetAllEnquiriesResponse>('/tenant/getinterviewlist');
      const raw = extractRawEnquiries(data);
      const mapped = raw.length > 0 ? raw.map(mapEnquiry) : [];

      console.groupCollapsed('[admissions] GET /tenant/getinterviewlist');
      console.log('raw response:', data);
      console.log('extracted items:', raw.length);
      console.log('mapped enquiries:', mapped.length);
      if (raw.length > 0) {
        console.log('first raw item:', raw[0]);
        console.log('first mapped item:', mapped[0]);
      }
      console.groupEnd();

      return mapped;
    } catch (err: any) {
      const ctx = err?.response?.data ?? err?.message;
      console.error('getInterviewList failed', { url: '/tenant/getinterviewlist', response: ctx });
      throw new Error(ctx?.message ?? ctx?.error ?? 'Failed to fetch interview list');
    }
  },

  /** GET /tenant/getdocsverificationlist */
  async getDocsVerificationList(): Promise<Enquiry[]> {
    try {
      const { data } = await api.get<GetAllEnquiriesResponse>('/tenant/getdocsverificationlist');
      const raw = extractRawEnquiries(data);
      const mapped = raw.length > 0 ? raw.map(mapEnquiry) : [];

      console.groupCollapsed('[admissions] GET /tenant/getdocsverificationlist');
      console.log('raw response:', data);
      console.log('extracted items:', raw.length);
      console.log('mapped enquiries:', mapped.length);
      if (raw.length > 0) {
        console.log('first raw item:', raw[0]);
        console.log('first mapped item:', mapped[0]);
      }
      console.groupEnd();

      return mapped;
    } catch (err: any) {
      const ctx = err?.response?.data ?? err?.message;
      console.error('getDocsVerificationList failed', { url: '/tenant/getdocsverificationlist', response: ctx });
      throw new Error(ctx?.message ?? ctx?.error ?? 'Failed to fetch docs verification list');
    }
  },

  /** GET /tenant/admissions/stats */
  async getPipelineStats(): Promise<PipelineStats> {
    try {
      const { data } = await api.get<PipelineStats>('/tenant/admissions/stats');
      return data;
    } catch (err: any) {
      const ctx = err?.response?.data ?? err?.message;
      console.error('getPipelineStats failed', { url: '/tenant/admissions/stats', response: ctx });
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
      console.error('createEnquiry failed', { url: '/tenant/createadmissions', payload, response: ctx });
      const message = ctx?.message ?? JSON.stringify(ctx) ?? err?.message ?? 'Failed to create enquiry';
      throw new Error(message);
    }
  },

  /** PATCH /tenant/shortlist-to-interview/{id} */
  async shortlistToInterview(id: string): Promise<void> {
    try {
      await api.put<StageChangeResponse>(`/tenant/shortlist-to-interview/${id}`);
    } catch (err: any) {
      const ctx = err?.response?.data ?? err?.message;
      console.error('shortlistToInterview failed', { id, response: ctx });
      throw new Error(ctx?.message ?? ctx?.error ?? 'Failed to shortlist for interview');
    }
  },

  /** PATCH /tenant/shortlist-to-docs/{id} */
  async shortlistToDocs(id: string): Promise<void> {
    try {
      await api.put<StageChangeResponse>(`/tenant/shortlist-to-docs/${id}`);
    } catch (err: any) {
      const ctx = err?.response?.data ?? err?.message;
      console.error('shortlistToDocs failed', { id, response: ctx });
      throw new Error(ctx?.message ?? ctx?.error ?? 'Failed to shortlist for docs');
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
      console.error('confirmAdmission failed', { id, payload, response: ctx });
      throw new Error(ctx?.message ?? ctx?.error ?? 'Failed to confirm admission');
    }
  },

  /** POST /tenant/decline-admission/{id} */
  async declineAdmission(id: string, reason: string): Promise<void> {
    try {
      await api.post(`/tenant/decline-admission/${id}`, { reason });
    } catch (err: any) {
      const ctx = err?.response?.data ?? err?.message;
      console.error('declineAdmission failed', { id, reason, response: ctx });
      throw new Error(ctx?.message ?? ctx?.error ?? 'Failed to decline admission');
    }
  },
};
