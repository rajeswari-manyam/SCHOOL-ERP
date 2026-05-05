import axios from "@/config/axios";
import type {
  PlatformConfigData,
  DialogConfig,
  RazorpayConfig,
  EmailSmsConfig,
  FeatureFlag,
  N8nWorkflow,
  ConfigTemplate,
  ConfigTemplateFormValues,
} from "../types/config.types";

export const configApi = {
  getConfig: async (): Promise<PlatformConfigData> => {
    const { data } = await axios.get("/super-admin/config");
    return data;
  },
  saveDialog: async (payload: DialogConfig): Promise<void> => {
    await axios.put("/super-admin/config/dialog", payload);
  },
  testDialog: async (): Promise<{ success: boolean; message: string }> => {
    const { data } = await axios.post("/super-admin/config/dialog/test");
    return data;
  },
  saveRazorpay: async (payload: RazorpayConfig): Promise<void> => {
    await axios.put("/super-admin/config/razorpay", payload);
  },
  testRazorpay: async (): Promise<{ success: boolean }> => {
    const { data } = await axios.post("/super-admin/config/razorpay/test");
    return data;
  },
  saveEmailSms: async (payload: EmailSmsConfig): Promise<void> => {
    await axios.put("/super-admin/config/email-sms", payload);
  },
  getFeatureFlags: async (): Promise<FeatureFlag[]> => {
    const { data } = await axios.get("/super-admin/config/feature-flags");
    return data?.data ?? data;
  },
  toggleFlag: async (id: string, enabled: boolean): Promise<void> => {
    await axios.patch(`/super-admin/config/feature-flags/${id}`, { enabled });
  },
  getWorkflows: async (): Promise<N8nWorkflow[]> => {
    const { data } = await axios.get("/super-admin/config/n8n-workflows");
    return data?.data ?? data;
  },
  getTemplates: async (): Promise<ConfigTemplate[]> => {
    const { data } = await axios.get("/super-admin/config/wa-templates");
    return data?.data ?? data;
  },
  createTemplate: async (payload: ConfigTemplateFormValues): Promise<ConfigTemplate> => {
    const { data } = await axios.post("/super-admin/config/wa-templates", payload);
    return data;
  },
  assignTemplateToSchools: async (
    templateId: string,
    payload: { schoolIds: string[] }
  ): Promise<void> => {
    await axios.post(`/super-admin/config/wa-templates/${templateId}/assign`, payload);
  },
  syncTemplatesFromMeta: async (): Promise<void> => {
    await axios.post("/super-admin/config/wa-templates/sync");
  },
  resetConfig: async (): Promise<void> => {
    await axios.post("/super-admin/config/reset");
  },
  saveAllSettings: async (payload: PlatformConfigData): Promise<void> => {
    await axios.put("/super-admin/config", payload);
  },
};
