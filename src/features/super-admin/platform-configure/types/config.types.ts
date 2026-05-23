export type ConfigTab = "integrations" | "wa-templates" | "feature-flags" | "n8n-workflows";
export type RazorpayMode = "LIVE" | "TEST";
export type SmsProvider = "Twilio" | "MSG91" | "Kaleyra";

export interface DialogConfig {
  apiKey: string;
  partnerId: string;
  webhookUrl: string;
  baseUrl: string;
  connected: boolean;
  lastTested?: string;
}

export interface RazorpayConfig {
  keyId: string;
  keySecret: string;
  webhookSecret: string;
  mode: RazorpayMode;
  active: boolean;
}

export interface EmailSmsConfig {
  smtpHost: string;
  fromEmail: string;
  smsProvider: SmsProvider;
}

export interface PlatformConfigData {
  dialog: DialogConfig;
  razorpay: RazorpayConfig;
  emailSms: EmailSmsConfig;
}

export type TemplateCategory = "Utility" | "Marketing" | "Authentication";
export type TemplateLanguage = "Telugu" | "English" | "Telugu+English" | "Hindi";

export interface ConfigTemplateFormValues {
  name: string;
  category: TemplateCategory;
  language: TemplateLanguage;
  body: string;
  variables?: string[];
}

export interface ConfigTemplateAssignPayload {
  assignTo: "ALL" | "SPECIFIC";
  schoolIds?: string[];
}

export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  scope: "global" | "per-school";
}

export interface N8nWorkflow {
  id: string;
  name: string;
  trigger: string;
  status: "active" | "inactive" | "error";
  lastRun?: string;
}

export interface ConfigTemplate {
  id: string;
  name: string;
  category: "Utility" | "Marketing" | "Authentication";
  language: string;
  metaStatus: "Approved" | "Pending" | "Rejected";
  usedBy: number;
  lastSubmitted: string;
}
