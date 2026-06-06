export type ComplaintCategory =
  | "Academic"
  | "Fee"
  | "Transport"
  | "Staff"
  | "Facility"
  | "Other";

export type ComplaintPriority = "low" | "medium" | "high";

export type ComplaintStatus = "pending" | "submitted" | "resolved";

export interface ComplaintAttachee {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
}

/** UI-layer complaint (what the store and components work with) */
export interface Complaint {
  id: string;
  subject: string;
  category: ComplaintCategory;
  description: string;
  priority: ComplaintPriority;
  attachees: string[];      // child ids — "regarding"
  photoFile?: File | null;
  photos?: string[];        // uploaded URLs from API
  status: ComplaintStatus;
  referenceNo?: string;
  submittedAt?: string;
  resolution?: string | null;
  resolved_at?: string | null;
}
