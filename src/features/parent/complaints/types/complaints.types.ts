export type ComplaintCategory =
  | "Academic"
  | "Fee"
  | "Transport"
  | "Staff"
  | "Facility"
  | "Other";

export type ComplaintStatus = "pending" | "submitted" | "resolved";

export interface ComplaintAttachee {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
}

export interface Complaint {
  id: string;
  subject: string;
  category: ComplaintCategory;
  description: string;
  attachees: string[]; // child ids
  photoFile?: File | null;
  status: ComplaintStatus;
  referenceNo?: string;
  submittedAt?: string;
}