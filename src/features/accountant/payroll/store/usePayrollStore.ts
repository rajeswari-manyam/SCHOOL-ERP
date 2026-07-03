import { create } from "zustand";
import type {
  StaffPayroll,
  PayrollSummary,
  AttendanceDeduction,
  PayrollHistory,
  SalaryConfig,
  SalaryFormData,
  PaySalaryFormData,
} from "../types/payroll.types";

type PayrollStore = {
  staffData: StaffPayroll[];
  isProcessed: boolean;
  processedDate: string | null;
  processedBy: string | null;

  summary: PayrollSummary;

  /** Generates payroll records — moves all Draft staff to Pending */
  processPayroll: (input: { paymentMode: string; paymentDate: string; approvalNote?: string }) => void;

  /** Pay a single employee's salary */
  paySalary: (staffId: string, data: PaySalaryFormData) => void;

  /** Pay multiple employees at once */
  paySelected: (ids: string[], data: PaySalaryFormData) => void;

  getAttendanceDeductions: () => AttendanceDeduction[];

  salaryData: SalaryConfig[];
  editingStaff: SalaryConfig | null;
  isEditing: boolean;

  openEditModal: (staff: SalaryConfig | null) => void;
  closeEditModal: () => void;
  updateSalary: (id: string, data: SalaryFormData) => void;

  history: PayrollHistory[];
};

export const usePayrollStore = create<PayrollStore>((set) => ({
  staffData: [],
  isProcessed: false,
  processedDate: null,
  processedBy: null,

  summary: {
    totalStaff: 0,
    totalGross: 0,
    totalDeductions: 0,
    totalNet: 0,
    month: new Date().toLocaleString("en-IN", { month: "long" }),
    year: new Date().getFullYear(),
    processingDueDate: "",
  },

  processPayroll: () => {
    set((state) => ({
      staffData: state.staffData.map((s) =>
        s.status === "Draft" ? { ...s, status: "Pending" } : s
      ),
      isProcessed: true,
      processedDate: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      processedBy: "Ramu Teja",
    }));
  },

  paySalary: (staffId, data) => {
    set((state) => ({
      staffData: state.staffData.map((s) => {
        if (s.id !== staffId) return s;
        const adj = data.bonus + data.overtime + data.extraClass - data.leaveDeductions - data.otherDeductions;
        const newNet = s.gross + adj - s.deductions;
        return {
          ...s,
          bonus: data.bonus,
          overtime: data.overtime,
          extraClass: data.extraClass,
          leaveDeductions: data.leaveDeductions,
          otherDeductions: data.otherDeductions,
          adjustments: adj,
          net: newNet,
          status: "Paid",
          paymentDate: data.paymentDate,
          paymentMethod: data.paymentMethod,
          remarks: data.remarks,
        };
      }),
    }));
  },

  paySelected: (ids, data) => {
    set((state) => ({
      staffData: state.staffData.map((s) => {
        if (!ids.includes(s.id)) return s;
        const adj = data.bonus + data.overtime + data.extraClass - data.leaveDeductions - data.otherDeductions;
        const newNet = s.gross + adj - s.deductions;
        return {
          ...s,
          bonus: data.bonus,
          overtime: data.overtime,
          extraClass: data.extraClass,
          leaveDeductions: data.leaveDeductions,
          otherDeductions: data.otherDeductions,
          adjustments: adj,
          net: newNet,
          status: "Paid",
          paymentDate: data.paymentDate,
          paymentMethod: data.paymentMethod,
          remarks: data.remarks,
        };
      }),
    }));
  },

  getAttendanceDeductions: () => [],

  salaryData: [],
  editingStaff: null,
  isEditing: false,

  openEditModal: (staff) => set({ editingStaff: staff, isEditing: true }),
  closeEditModal: () => set({ editingStaff: null, isEditing: false }),

  updateSalary: (id, data) => {
    set((state) => ({
      salaryData: state.salaryData.map((s) => {
        if (s.id !== id) return s;
        const gross = data.basicSalary + data.hra + data.transportAllowance + data.otherAllowance;
        const net   = gross - (data.pfPercentage / 100) * gross - data.professionalTax - data.tds;
        return {
          ...s,
          basic: data.basicSalary,
          hra: data.hra,
          transport: data.transportAllowance,
          other: data.otherAllowance,
          pfPercentage: data.pfPercentage,
          professionalTax: data.professionalTax,
          effectiveFrom: data.effectiveFrom,
          gross,
          net,
        };
      }),
      editingStaff: null,
      isEditing: false,
    }));
  },

  history: [],
}));
