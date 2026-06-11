export type PipelineStage = 'enquiry' | 'interview' | 'docs_verified' | 'confirmed' | 'declined';

export type EnquirySource = 'walk-in' | 'social_media' | 'referral' | 'phone' | 'website' | 'other';

export type DocumentStatus = 'verified' | 'pending' | 'missing';

export interface Document {
  name: string;
  status: DocumentStatus;
  /** ID for fetching full file record via /tenant/getadmissiondocument/{id} */
  id?: string;
  /** Display filename */
  file_name?: string;
  /** Direct URL to open/download the file */
  file_url?: string;
}

export interface StatusHistoryEntry {
  status: string;
  date: string;
  note?: string;
}

export interface Enquiry {
  id: string;
  admissionNo?: string;
  studentName: string;
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  dateOfBirth?: string;
  classApplyingFor: string;
  enquiryDate: string;
  source: EnquirySource;
  referredBy?: string;
  notes?: string;
  stage: PipelineStage;
  declineReason?: string;
  interviewDate?: string;
  interviewNote?: string;
  documents?: Document[];
  section?: string;
  rollNumber?: string;
  firstDayOfSchool?: string;
  annualFee?: number;
  statusHistory?: StatusHistoryEntry[];
  whatsappSent?: boolean;
  welcomeWhatsappSent?: boolean;
  counselorNote?: string;
}

export interface PipelineStats {
  enquiries: number;
  interviews: number;
  docsVerified: number;
  confirmed: number;
  declined: number;
  conversionRate: number;
}

export interface NewEnquiryFormData {
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  studentName: string;
  dateOfBirth?: string;
  classApplyingFor: string;
  enquiryDate: string;
  source: EnquirySource;
  referredBy?: string;
  notes?: string;
}

export interface ConfirmAdmissionFormData {
  section: string;
  rollNumber: string;
  firstDayOfSchool: string;
  notes?: string;
}

export interface PipelineColumn {
  id: PipelineStage;
  label: string;
  color: string;
  badgeColor: string;
  count: number;
}

// ─── Document upload / fetch ─────────────────────────────────────────────────

/** One uploaded file record returned by GET /tenant/getadmissiondocument/ */
export interface AdmissionDocumentRecord {
  id: string;
  enquiry_id: string;
  file_name: string;
  file_url: string;
  file_type?: string;
  uploaded_at?: string;
  size_bytes?: number;
}

export interface GetAdmissionDocumentResponse {
  status?: boolean;
  message?: string;
  data?: AdmissionDocumentRecord | { document?: AdmissionDocumentRecord };
  document?: AdmissionDocumentRecord;
}

export interface GetAdmissionDocumentsResponse {
  status?: boolean;
  message?: string;
  data?: AdmissionDocumentRecord[] | { documents?: AdmissionDocumentRecord[] };
  documents?: AdmissionDocumentRecord[];
  files?: AdmissionDocumentRecord[];
}

export interface UploadAdmissionDocumentResponse {
  status?: boolean;
  message?: string;
  data?: AdmissionDocumentRecord[];
}

// ─── Raw API response shapes (snake_case) ────────────────────────────────────

export interface RawEnquiryItem {
  enquiry_id?: string;
  id?: string;
  _id?: string;
  student_name?: string;
  studentName?: string;
  studentname?: string;
  student?: string;
  name?: string;
  parent_name?: string;
  parentName?: string;
  parentname?: string;
  parent?: string;
  parent_phone?: string;
  parentPhone?: string;
  parentphone?: string;
  phone?: string;
  mobile?: string;
  parent_email?: string;
  parentEmail?: string;
  email?: string;
  date_of_birth?: string;
  dateOfBirth?: string;
  dob?: string;
  birth_date?: string;
  class_applying_for?: string;
  classApplyingFor?: string;
  class?: string;
  class_name?: string;
  className?: string;
  applying_class?: string;
  enquiry_date?: string;
  enquiryDate?: string;
  enquire_date?: string;
  date?: string;
  created_at?: string;
  createdAt?: string;
  enquiry_source?: string;
  source?: string;
  enquire_source?: string;
  source_name?: string;
  lead_source?: string;
  referred_by?: string;
  referredBy?: string;
  referrer?: string;
  notes?: string;
  note?: string;
  remark?: string;
  counselor_note?: string;
  counselorNote?: string;
  counsellor_note?: string;
  stage?: string;
  current_stage?: string;
  stage_name?: string;
  status?: string;
  pipeline_status?: string;
  decline_reason?: string;
  declineReason?: string;
  reason?: string;
  interview_date?: string;
  interviewDate?: string;
  scheduled_date?: string;
  interview_note?: string;
  interviewNote?: string;
  section?: string;
  roll_number?: string;
  rollNumber?: string;
  roll_no?: string;
  first_day_of_school?: string;
  firstDayOfSchool?: string;
  annual_fee?: number;
  annualFee?: number;
  fee?: number;
  whatsapp_sent?: boolean;
  whatsappSent?: boolean;
  wa_sent?: boolean;
  welcome_whatsapp_sent?: boolean;
  welcomeWhatsappSent?: boolean;
  welcome_wa_sent?: boolean;
  admission_no?: string;
  admissionNo?: string;
  admission_number?: string;
  documents?: Document[];
  document_list?: Document[];
  status_history?: StatusHistoryEntry[];
  statusHistory?: StatusHistoryEntry[];
  history?: StatusHistoryEntry[];
}

export interface GetAllEnquiriesResponse {
  status?: boolean;
  message?: string;
  data?: RawEnquiryItem[] | { enquiries?: RawEnquiryItem[]; list?: RawEnquiryItem[]; records?: RawEnquiryItem[] };
  enquiries?: RawEnquiryItem[];
  list?: RawEnquiryItem[];
  records?: RawEnquiryItem[];
  result?: RawEnquiryItem[];
}

export interface GetInterviewListResponse {
  status?: boolean;
  message?: string;
  data?: RawEnquiryItem[] | { list?: RawEnquiryItem[]; interviews?: RawEnquiryItem[] };
  list?: RawEnquiryItem[];
  interviews?: RawEnquiryItem[];
}

export interface GetDocsVerificationListResponse {
  status?: boolean;
  message?: string;
  data?: RawEnquiryItem[] | { list?: RawEnquiryItem[]; docs?: RawEnquiryItem[] };
  list?: RawEnquiryItem[];
  docs?: RawEnquiryItem[];
}

export interface StageChangeResponse {
  status?: boolean;
  message?: string;
  data?: RawEnquiryItem;
}
