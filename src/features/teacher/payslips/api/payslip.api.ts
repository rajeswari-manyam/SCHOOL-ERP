import api from "@/config/axios";
import type { Payslip, AnnualSummary } from "../types/payslip.types";

const toCamelCase = (obj: any): any => {
  if (Array.isArray(obj)) return obj.map(toCamelCase);
  if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
      acc[camelKey] = toCamelCase(obj[key]);
      return acc;
    }, {} as Record<string, any>);
  }
  return obj;
};

export const payslipApi = {
  getPayslips: async (staffId: string, month?: string, year?: string): Promise<Payslip[]> => {
    void staffId;
    const params: Record<string, string> = { staff_id: "5b165170-41f3-489f-b7fe-dea209b55bac" };
    if (month) params.month = month;
    if (year) params.year = year;
    const { data } = await api.get("/tenant/getallpayslips", { params });
    console.log("getPayslips RAW response:", JSON.stringify(data));
    let list: any[] = [];
    if (Array.isArray(data)) list = data;
    else if (data?.payslips && Array.isArray(data.payslips)) list = data.payslips;
    else if (data?.data && Array.isArray(data.data)) list = data.data;
    else console.warn("getPayslips: unexpected shape", data);
    const result = list.map(toCamelCase) as Payslip[];
    if (result.length > 0) console.log("getPayslips FIRST item (camelCase):", JSON.stringify(result[0]));
    return result;
  },

  getPayslip: async (id: string): Promise<Payslip | null> => {
    const { data } = await api.get(`/tenant/teacher/payslips/${id}`);
    return data ? (toCamelCase(data) as Payslip) : null;
  },

  downloadPdf: async (payslipId: string): Promise<void> => {
    const res = await api.get(`/tenant/teacher/payslips/${payslipId}/pdf`, { responseType: "blob" });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `payslip-${payslipId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  sendToWhatsApp: async (payslipId: string): Promise<void> => {
    await api.post(`/tenant/teacher/payslips/${payslipId}/whatsapp`);
  },

  downloadAnnualStatement: async (year: number): Promise<void> => {
    const res = await api.get(`/tenant/teacher/payslips/annual/${year}`, { responseType: "blob" });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `annual-statement-${year}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  getAnnualSummary: async (staffId: string, year: number): Promise<AnnualSummary | null> => {
    try {
      const { data } = await api.get(`/tenant/teacher/payslips/annual/${year}/summary`, {
        params: { staff_id: staffId },
      });
      return data ? (toCamelCase(data) as AnnualSummary) : null;
    } catch {
      return null;
    }
  },
};
