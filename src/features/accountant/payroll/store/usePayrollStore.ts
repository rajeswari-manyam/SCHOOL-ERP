import { create } from "zustand";
import {
  initialStaffData,
  attendanceDeductionsData,
  initialSalaryData,
  initialHistory,
} from "../data/payroll.data";

import type {
  StaffPayroll,
  PayrollSummary,
  AttendanceDeduction,
  PayrollHistory,
  SalaryConfig,
  SalaryFormData,
} from "../types/payroll.types";

type PayrollStore = {

  staffData: StaffPayroll[];
  isProcessed: boolean;
  processedDate: string | null;
  processedBy: string | null;

  summary: PayrollSummary;

  processPayroll: (input: {
    paymentMode: string;
    paymentDate: string;
    approvalNote?: string;
  }) => void;

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
 
  staffData: initialStaffData,
  isProcessed: false,
  processedDate: null,
  processedBy: null,

  summary: {
    totalStaff: initialStaffData.length,
    totalGross: initialStaffData.reduce((s, x) => s + x.gross, 0),
    totalDeductions: initialStaffData.reduce((s, x) => s + x.deductions, 0),
    totalNet: initialStaffData.reduce((s, x) => s + x.net, 0),
    month: "April",
    year: 2025,
    processingDueDate: "1 May 2025",
  },

  processPayroll: () => {
    set((state) => ({
      staffData: state.staffData.map((s) => ({
        ...s,
        status: "Processed",
      })),
      isProcessed: true,
      processedDate: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      processedBy: "Ramu Teja",
    }));
  },

  getAttendanceDeductions: () => attendanceDeductionsData,


  salaryData: initialSalaryData,
  editingStaff: null,
  isEditing: false,

  openEditModal: (staff) =>
    set({
      editingStaff: staff,
      isEditing: true,
    }),

  closeEditModal: () =>
    set({
      editingStaff: null,
      isEditing: false,
    }),

  updateSalary: (id, data) => {
    set((state) => ({
      salaryData: state.salaryData.map((s) => {
        if (s.id !== id) return s;

        const gross =
          data.basicSalary +
          data.hra +
          data.transportAllowance +
          data.otherAllowance;

        const net =
          gross -
          (data.pfPercentage / 100) * gross -
          data.professionalTax -
          data.tds;

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

  history: initialHistory,
}));