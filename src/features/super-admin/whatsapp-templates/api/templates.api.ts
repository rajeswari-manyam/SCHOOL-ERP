import axios from "@/config/axios";
import type {
  TemplateFilters, TemplatesResponse,
  WhatsAppTemplate, TemplateFormValues,
} from "../types/templates.types";

export const templatesApi = {
  getTemplates: async (filters: Partial<TemplateFilters>): Promise<TemplatesResponse> => {
    const { data } = await axios.get("/super-admin/whatsapp-templates", { params: filters });
    return data;
  },

  getTemplate: async (id: string): Promise<WhatsAppTemplate> => {
    const { data } = await axios.get(`/super-admin/whatsapp-templates/${id}`);
    return data;
  },

  getStats: async (): Promise<import("../types/templates.types").TemplateStats> => {
    const { data } = await axios.get("/super-admin/whatsapp-templates/stats");
    return data;
  },

  createTemplate: async (payload: TemplateFormValues): Promise<WhatsAppTemplate> => {
    const { data } = await axios.post("/super-admin/whatsapp-templates", payload);
    return data;
  },

  updateTemplate: async (id: string, payload: Partial<TemplateFormValues>): Promise<WhatsAppTemplate> => {
    const { data } = await axios.patch(`/super-admin/whatsapp-templates/${id}`, payload);
    return data;
  },

  deleteTemplate: async (id: string): Promise<void> => {
    await axios.delete(`/super-admin/whatsapp-templates/${id}`);
  },

  submitToMeta: async (ids: string[]): Promise<void> => {
    await axios.post("/super-admin/whatsapp-templates/submit-meta", { ids });
  },
};
