import type { Payslip, AnnualSummary } from "../types/payslip.types";

// In a real app these would be axios/fetch calls to your backend
export const payslipApi = {
  /** Fetch all payslips for the logged-in teacher */
  getPayslips: async (): Promise<Payslip[]> => {
    // const res = await axios.get("/api/teacher/payslips");
    // return res.data;
    return Promise.resolve([]);
  },

  /** Fetch single payslip by id */
  getPayslip: async (id: string): Promise<Payslip | null> => {
    // const res = await axios.get(`/api/teacher/payslips/${id}`);
    // return res.data;
    void id;
    return Promise.resolve(null);
  },

  /** Download payslip PDF for a given month */
  downloadPdf: async (payslipId: string): Promise<void> => {
    // const res = await axios.get(`/api/teacher/payslips/${payslipId}/pdf`, { responseType: "blob" });
    // triggerDownload(res.data, `payslip-${payslipId}.pdf`);
    void payslipId;
  },

  /** Send payslip to teacher's WhatsApp */
  sendToWhatsApp: async (payslipId: string): Promise<void> => {
    // await axios.post(`/api/teacher/payslips/${payslipId}/whatsapp`);
    void payslipId;
  },

  /** Download annual salary statement */
  downloadAnnualStatement: async (year: number): Promise<void> => {
    // const res = await axios.get(`/api/teacher/payslips/annual/${year}`, { responseType: "blob" });
    void year;
  },

  /** Fetch annual summary */
  getAnnualSummary: async (year: number): Promise<AnnualSummary | null> => {
    void year;
    return Promise.resolve(null);
  },
};
