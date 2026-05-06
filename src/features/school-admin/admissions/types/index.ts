export type PipelineStage = 'enquiry' | 'interview' | 'docs_verified' | 'confirmed' | 'declined';

export type EnquirySource = 'walk-in' | 'social_media' | 'referral' | 'phone' | 'website' | 'other';

export type DocumentStatus = 'verified' | 'pending' | 'missing';

export interface Document {
  name: string;
  status: DocumentStatus;
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
