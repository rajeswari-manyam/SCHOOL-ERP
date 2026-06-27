import api from "@/config/axios";
import type { Payslip, AnnualSummary, SalaryEarning, SalaryDeduction } from "@/features/teacher/payslips/types/payslip.types";

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function mapApiPayslip(raw: any): Payslip {
  const monthNum = Number(raw.month ?? 0);
  const yearNum  = Number(raw.year  ?? 0);

  const earnings: SalaryEarning[] = [
    { label: "Base Salary",           amount: raw.base_salary          ?? 0 },
    ...(raw.hra               > 0 ? [{ label: "HRA",                    amount: raw.hra               }] : []),
    ...(raw.transport_allowance > 0 ? [{ label: "Transport Allowance",  amount: raw.transport_allowance }] : []),
    ...(raw.other_allowance   > 0 ? [{ label: "Other Allowance",        amount: raw.other_allowance   }] : []),
    ...(raw.bonus             > 0 ? [{ label: "Bonus",                  amount: raw.bonus             }] : []),
    ...(raw.overtime          > 0 ? [{ label: "Overtime",               amount: raw.overtime          }] : []),
    ...(raw.extra_class_payment > 0 ? [{ label: "Extra Class Payment",  amount: raw.extra_class_payment }] : []),
  ];

  const deductions: SalaryDeduction[] = [
    ...(raw.professional_tax  > 0 ? [{ label: "Professional Tax",       amount: raw.professional_tax  }] : []),
    ...(raw.pf                > 0 ? [{ label: "Provident Fund (PF)",    amount: raw.pf                }] : []),
    ...(raw.tds_monthly       > 0 ? [{ label: "TDS",                    amount: raw.tds_monthly       }] : []),
    ...(raw.leave_deduction   > 0 ? [{ label: "Leave Deduction",        amount: raw.leave_deduction   }] : []),
  ];

  const rawStatus = (raw.payment_status ?? "").toLowerCase();
  const status: Payslip["status"] =
    rawStatus === "paid"       ? "PAID"       :
    rawStatus === "processing" ? "PROCESSING" : "PENDING";

  const presentDays = raw.present_days ?? 0;
  const absentDays  = raw.absent_days  ?? 0;

  return {
    id:               raw.id ?? "",
    month:            String(monthNum),
    year:             String(yearNum),
    monthLabel:       `${MONTH_NAMES[monthNum - 1] ?? "Unknown"} ${yearNum}`,
    status,
    employeeId:       raw.staff_id   ?? "",
    employeeName:     raw.staff_name ?? "",
    designation:      raw.designation ?? "Teacher",
    department:       raw.department  ?? "",
    bankAccount:      raw.bankAccount ?? "—",
    pan:              raw.pan         ?? "—",
    earnings,
    grossSalary:      raw.gross_salary     ?? 0,
    deductions,
    totalDeductions:  raw.total_deductions ?? 0,
    netSalary:        raw.net_salary       ?? 0,
    attendance: {
      workingDays: presentDays + absentDays,
      presentDays,
      absentDays,
      halfDays:   raw.half_days   ?? 0,
      leaveDays:  raw.leave_days  ?? 0,
    },
  };
}

export const payslipApi = {
  getPayslips: async (staffId: string, month?: string, year?: string): Promise<Payslip[]> => {
    const params: Record<string, string> = { staff_id: staffId };
    if (month) params.month = month;
    if (year)  params.year  = year;
    const { data } = await api.get("/tenant/getallpayslips", { params });
    let list: any[] = [];
    if (Array.isArray(data))                              list = data;
    else if (data?.payslips && Array.isArray(data.payslips)) list = data.payslips;
    else if (data?.data    && Array.isArray(data.data))  list = data.data;
    return list.map(mapApiPayslip);
  },

  getPayslip: async (id: string): Promise<Payslip | null> => {
    const { data } = await api.get(`/tenant/teacher/payslips/${id}`);
    return data ? mapApiPayslip(data) : null;
  },

  downloadPdf: async (payslipId: string): Promise<void> => {
    const res = await api.get(`/tenant/downloadpayslip/${payslipId}`, { responseType: "blob" });
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
      return data ?? null;
    } catch {
      return null;
    }
  },
};
