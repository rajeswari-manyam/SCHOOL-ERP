// ─── Pipeline Stage ───────────────────────────────────────────────────────────
export type AdmissionStage =
  | "ENQUIRY"
  | "INTERVIEW"
  | "DOCS_VERIFIED"
  | "CONFIRMED"
  | "DECLINED";

// ─── Enquiry Source ───────────────────────────────────────────────────────────
export type EnquirySource =
  | "Walk-in"
  | "Phone Inquiry"
  | "Social Media"
  | "Referral"
  | "Website"
  | "Newspaper Ad";

// ─── Document status ──────────────────────────────────────────────────────────
export interface AdmissionDocument {
  id: string;
  name: string;
  verified: boolean;
}

// ─── Core enquiry record ─────────────────────────────────────────────────────
export interface Admission {
  id: string;
  admissionNo?: string; // assigned on confirmation
  // Student
  studentName: string;
  dob?: string;
  // Parent
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  // Academic
  classApplied: string;
  section?: string;
  rollNumber?: number;
  annualFee?: number;
  firstDayOfSchool?: string;
  // Pipeline
  stage: AdmissionStage;
  source: EnquirySource;
  referredBy?: string;
  enquiryDate: string;
  // Interview
  interviewDate?: string;
  interviewTime?: string;
  interviewNote?: string;
  // Documents
  documents?: AdmissionDocument[];
  // Decline reason
  declineReason?: string;
  // WhatsApp
  whatsappSent?: boolean;
  welcomeWhatsappSent?: boolean;
  // Notes
  notes?: string;
  // Counselor note
  counselorNote?: string;
}

// ─── Form data for adding new enquiry ────────────────────────────────────────
export interface AddEnquiryFormData {
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  studentName: string;
  dob: string;
  classApplied: string;
  source: EnquirySource | "";
  referredBy: string;
  enquiryDate: string;
  notes: string;
}

// ─── Form data for confirming admission ──────────────────────────────────────
export interface ConfirmAdmissionFormData {
  section: string;
  rollNumber: string;
  firstDayOfSchool: string;
  annualFee: string;
  notes: string;
}

// ─── Pipeline summary stats ───────────────────────────────────────────────────
export interface AdmissionStats {
  enquiries: number;
  interviews: number;
  docsVerified: number;
  confirmed: number;
  declined: number;
  conversionRate: number;
}

export interface AdmissionApplication {
  id: string;
  studentName: string;
  class: string;
  parentName: string;
  phone: string;
  status: string;
  appliedAt: string;
}