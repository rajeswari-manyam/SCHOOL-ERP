export type TemplateCategory = "UTILITY" | "MARKETING" | "AUTHENTICATION";
export type TemplateLanguage = "Telugu" | "English" | "Telugu+English" | "Hindi";
export type MetaStatus = "APPROVED" | "PENDING" | "REJECTED";
export type TemplateTab = "all" | "pending" | "rejected" | "by-school";

export interface WhatsAppTemplate {
  id: string;
  name: string;
  preview: string;
  category: TemplateCategory;
  language: TemplateLanguage;
  metaStatus: MetaStatus;
  schools: number;
  createdAt: string;
  body?: string;
  variables?: string[];
}

export interface TemplateStats {
  approved: number;
  approvedWeekDelta: number;
  pendingApproval: number;
  rejected: number;
  schoolsUsingWA: number;
}

export interface TemplateFilters {
  search: string;
  category: TemplateCategory | "ALL";
  language: TemplateLanguage | "ALL";
  status: MetaStatus | "ALL";
  tab: TemplateTab;
  page: number;
  pageSize: number;
}

export interface TemplatesResponse {
  data: WhatsAppTemplate[];
  total: number;
  page: number;
  pageSize: number;
}

export interface TemplateFormValues {
  name: string;
  category: TemplateCategory;
  language: TemplateLanguage;
  body: string;
  variables: string[];
}
