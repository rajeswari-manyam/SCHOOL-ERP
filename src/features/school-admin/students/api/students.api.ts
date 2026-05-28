import api from "@/config/axios";
import type { CreateStudentPayload, Student, FeePayment, StudentDocument, StudentAttendanceDay } from "../types/student.types";

export const MOCK_ATTENDANCE: StudentAttendanceDay[] = [
  { date: "2025-03-31", status: null },
  { date: "2025-04-01", status: "present" },
  { date: "2025-04-02", status: "present" },
  { date: "2025-04-03", status: "present" },
  { date: "2025-04-04", status: "present" },
  { date: "2025-04-05", status: "absent" },
  { date: "2025-04-06", status: null },
  { date: "2025-04-07", status: "present" },
  { date: "2025-04-08", status: "present" },
  { date: "2025-04-09", status: "present" },
  { date: "2025-04-10", status: "present" },
  { date: "2025-04-11", status: "present" },
  { date: "2025-04-12", status: null },
  { date: "2025-04-13", status: null },
  { date: "2025-04-14", status: "present" },
];

export const MOCK_FEE_PAYMENTS: FeePayment[] = [
  { id: "1", date: "6 APR 2025", description: "Tuition Fee — April 2025", amount: 8500, status: "PENDING" },
  { id: "2", date: "5 MAR 2025", description: "Tuition Fee — Mar 2025", amount: 8500, status: "PAID", mode: "UPI", receiptNo: "RCP-0847" },
  { id: "3", date: "3 FEB 2025", description: "Tuition Fee — Feb 2025", amount: 8500, status: "PAID", mode: "Cash", receiptNo: "RCP-0721" },
  { id: "4", date: "5 JAN 2025", description: "Tuition Fee — Jan 2025", amount: 8500, status: "PAID", mode: "UPI", receiptNo: "RCP-0612" },
  { id: "5", date: "3 JAN 2025", description: "Exam Fee — Q3", amount: 2000, status: "PAID", mode: "Cash", receiptNo: "RCP-0601" },
  { id: "6", date: "5 DEC 2024", description: "Tuition Fee — Dec 2024", amount: 8500, status: "PAID", mode: "UPI", receiptNo: "RCP-0524" },
  { id: "7", date: "5 NOV 2024", description: "Tuition Fee — Nov 2024", amount: 8500, status: "PAID", mode: "Cash", receiptNo: "RCP-0445" },
];

export const MOCK_DOCUMENTS: StudentDocument[] = [
  { id: "1", name: "Birth Certificate", type: "pdf", size: "2.3 MB", verified: true },
  { id: "2", name: "Previous TC", type: "pdf", size: "850 KB", verified: true },
  { id: "3", name: "Aadhar Card", type: "pdf", size: "2.4 MB", verified: true },
  { id: "4", name: "Caste Certificate", type: "pdf", size: "11 MB", verified: true },
  { id: "5", name: "Passport Photo", type: "image", size: "450 KB", verified: true },
];

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

export const studentsApi = {
  getAll: async (): Promise<Student[]> => {
    const { data } = await api.get("/tenant/getallstudents");
    const rawJson = JSON.stringify(data);
    console.log("getAll students raw response:", rawJson);
    let list: any[] = [];
    if (Array.isArray(data)) list = data;
    else if (data?.students && Array.isArray(data.students)) list = data.students;
    else if (data?.data && Array.isArray(data.data)) list = data.data;
    else {
      console.warn("getAll students: unexpected response shape", data);
      return [];
    }
    const mapped = list.map(toCamelCase).map((s: any) => ({
      ...s,
      admissionNo: s.admissionNo ?? s.admissionNumber ?? s.admissionId ?? s.admission ?? "",
      firstName: s.firstName ?? s.first?? s.givenName ?? "",
      lastName: s.lastName ?? s.last ?? s.familyName ?? s.surName ?? "",
      parentPhone: s.parentPhone ?? s.parentPhoneNumber ?? s.phone ?? s.mobile ?? "",
      feeStatus: s.feeStatus ?? s.fee ?? s.feePaymentStatus ?? "PENDING",
      status: s.status ?? s.studentStatus ?? "ACTIVE",
    })) as Student[];
    console.log("getAll students mapped count:", mapped.length, "first:", JSON.stringify(mapped[0]));
    return mapped;
  },
  getById: async (id: string): Promise<Student | undefined> => {
    const { data } = await api.get<Student>(`/tenant/getstudent/${id}`);
    return data;
  },
  createStudent: async (payload: CreateStudentPayload): Promise<Student> => {
    try {
      const { data } = await api.post<Student>("/tenant/createstudents", payload);
      console.log("createStudent success", { url: "/tenant/createstudents", payload, response: data });
      return data;
    } catch (err: any) {
      console.error("createStudent failed", {
        url: "/tenant/createstudents",
        payload,
        response: err?.response?.data ?? err?.message,
      });
      const message = err?.response?.data?.message ?? JSON.stringify(err?.response?.data) ?? err?.message ?? "Failed to create student";
      throw new Error(message);
    }
  },
};