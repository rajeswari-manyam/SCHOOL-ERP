import api from "@/config/axios";
import type { CreateStudentPayload, UpdateStudentPayload, Student, FeePayment, StudentDocument, StudentAttendanceDay } from "@/features/school-admin/students/types/student.types";
import { getAllClasses } from "@/services/class.api";
import { getSectionsByClassId, getAllSections } from "@/services/section.api";

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

const findField = (obj: Record<string, unknown>, keys: string[]): unknown => {
  for (const key of keys) {
    const v = obj[key];
    if (v !== undefined && v !== null) return v;
  }
  return undefined;
};

export interface ClassOption {
  id: string;
  value: string;
  label: string;
}

export const fetchClassesList = async (academicYearId: string | null): Promise<ClassOption[]> => {
  const params: import("@/services/class.api").GetAllClassesParams = {};
  if (academicYearId) params.academicYearId = academicYearId;
  const res = await getAllClasses(params);
  if (!res?.status || !Array.isArray(res.data)) return [];
  const seen = new Set<string>();
  const options: ClassOption[] = [];
  for (const record of res.data) {
    const name = record.class_name?.trim();
    if (name && !seen.has(name)) {
      seen.add(name);
      options.push({ id: record.id, value: name, label: name });
    }
  }
  return options.sort((a, b) => Number(a.value) - Number(b.value));
};

export const fetchSectionsList = async (classId: string): Promise<ClassOption[]> => {
  const records = await getSectionsByClassId(classId);
  return records.map((r) => {
    const name = (r.sectionName ?? "").trim();
    const id = r.id;
    return { id, value: name, label: name };
  }).filter((o) => o.value !== "");
};

export const buildClassSectionMaps = async (academicYearId: string | null): Promise<{
  classMap: Record<string, string>;
  sectionMap: Record<string, string>;
}> => {
  const classParams: import("@/services/class.api").GetAllClassesParams = {};
  if (academicYearId) classParams.academicYearId = academicYearId;
  const classMap: Record<string, string> = {};
  const sectionMap: Record<string, string> = {};

  try {
    const classRes = await getAllClasses(classParams);
    if (classRes?.status && Array.isArray(classRes.data)) {
      for (const r of classRes.data) {
        if (r.id && r.class_name) classMap[r.id] = r.class_name;
      }
    }
  } catch {
    console.warn("Failed to fetch class list for name resolution");
  }

  try {
    const sectionRes = await getAllSections();
    const sectionData = Array.isArray(sectionRes) ? sectionRes : null;
    if (sectionData) {
      for (const r of sectionData) {
        const sid = (r.id ?? "") as string;
        const name = (r.sectionName ?? "").trim();
        if (sid && name) sectionMap[sid] = name;
      }
    }
  } catch {
    console.warn("Failed to fetch section list for name resolution");
  }

  return { classMap, sectionMap };
};

export const resolveStudentNames = (
  students: Student[],
  classMap: Record<string, string>,
  sectionMap: Record<string, string>,
): Student[] =>
  students.map((s) => ({
    ...s,
    class: classMap[s.class] ?? classMap[(s as any).class_id] ?? (s.class || ""),
    section: sectionMap[s.section] ?? sectionMap[(s as any).sectionId] ?? (s.section || ""),
  }));

export const studentsApi = {
  getAll: async (academicYearId?: string | null): Promise<Student[]> => {
    const params: Record<string, string> = {};
    if (academicYearId) params.academicYearId = academicYearId;
    const { data } = await api.get("/tenant/getallstudents", { params });
    let list: any[] = [];
    if (Array.isArray(data)) list = data;
    else if (data?.students && Array.isArray(data.students)) list = data.students;
    else if (data?.data && Array.isArray(data.data)) list = data.data;
    else return [];
    return list.map((raw: any) => {
      const s = toCamelCase(raw) as Record<string, unknown>;
      const classDetail = s.classDetail as Record<string, unknown> | undefined;
      const sectionDetail = s.sectionDetail as Record<string, unknown> | undefined;
      const cls = classDetail?.className ?? classDetail?.class_name ?? findField(s, ["class", "className", "class_name", "classId", "class_id", "Class", "cls"]) ?? "";
      const sec = sectionDetail?.sectionName ?? sectionDetail?.section_name ?? findField(s, ["section", "sectionName", "section_name", "sectionId", "section_id", "Section", "sec"]) ?? "";
      const studentName = (s.studentName ?? "") as string;
      const nameParts = studentName.trim().split(/\s+/);
      const firstName = s.firstName ?? s.first ?? s.givenName ?? nameParts[0] ?? "";
      const lastName = s.lastName ?? s.last ?? s.familyName ?? s.surName ?? (nameParts.length > 1 ? nameParts.slice(1).join(" ") : "") ?? "";
      return {
        ...s,
        class: typeof cls === "string" && cls ? cls : "",
        section: typeof sec === "string" && sec ? sec : "",
        admissionNo: s.admissionNo ?? s.admissionNumber ?? s.admissionId ?? s.admission ?? "",
        firstName,
        lastName,
        parentPhone: s.parentPhone ?? s.parentPhoneNumber ?? s.phone ?? s.mobile ?? "",
        feeStatus: (String(s.feeStatus ?? s.fee ?? s.feePaymentStatus ?? "PENDING")).toUpperCase(),
        status: (String(s.status ?? s.studentStatus ?? "ACTIVE")).toUpperCase(),
      } as Student;
    });
  },
  getById: async (id: string): Promise<Student | undefined> => {
    const { data } = await api.get(`/tenant/getstudentsById/${id}`);
    let raw: any = data;
    if (raw?.data && typeof raw.data === "object") raw = raw.data;
    const camel = toCamelCase(raw) as Record<string, unknown>;
    if (!camel.id) return undefined;

    // Resolve class and section names from nested detail objects first, then fall back to flat fields
    const classDetail = camel.classDetail as Record<string, unknown> | undefined;
    const sectionDetail = camel.sectionDetail as Record<string, unknown> | undefined;
    const academicYear = camel.academicYear as Record<string, unknown> | undefined;
    const parentDetail = camel.parentDetail as Array<Record<string, unknown>> | undefined;

    const className = (classDetail?.className ?? classDetail?.class_name ?? classDetail?.name ?? "") as string;
    const sectionName = (sectionDetail?.sectionName ?? sectionDetail?.name ?? "") as string;
    const cls = className || (findField(camel, ["class", "Class"]) as string | undefined) || "";
    const sec = sectionName || (findField(camel, ["section", "Section"]) as string | undefined) || "";

    // Capitalize gender to match the Gender type ("Male" | "Female" | "Other")
    const rawGender = String(camel.gender ?? "").trim();
    const gender = rawGender ? (rawGender.charAt(0).toUpperCase() + rawGender.slice(1).toLowerCase()) : "";

    // Parse studentName into firstName and lastName if the API returns a combined name
    const studentName = (camel.studentName ?? "") as string;
    const nameParts = studentName.trim().split(/\s+/);
    const firstName = (camel.firstName ?? camel.first ?? camel.givenName ?? nameParts[0] ?? "") as string;
    const lastName = (camel.lastName ?? camel.last ?? camel.familyName ?? camel.surName ?? nameParts.slice(1).join(" ") ?? "") as string;

    // Extract parent info from parentDetail array
    const father = parentDetail?.find((p) => /father/i.test(String(p.relation ?? "")));
    const mother = parentDetail?.find((p) => /mother/i.test(String(p.relation ?? "")));
    const primaryParent = parentDetail?.[0];

    return {
      ...camel,
      id: camel.id as string,
      firstName,
      lastName,
      admissionNo: (camel.admissionNo ?? camel.admissionNumber ?? camel.admissionId ?? camel.admission ?? "") as string,
      class: cls,
      section: sec,
      dob: (camel.dob ?? camel.dateOfBirth ?? camel.date_of_birth ?? "") as string,
      gender: gender as Student["gender"],
      bloodGroup: (camel.bloodGroup ?? camel.blood_group ?? undefined) as Student["bloodGroup"],
      residentialAddress: (camel.residentialAddress ?? camel.address ?? "") as string,
      rollNumber: camel.rollNumber !== undefined ? Number(camel.rollNumber) : undefined,
      admittedOn: (camel.admittedOn ?? camel.admissionDate ?? camel.admission_date ?? "") as string,
      academicYear: (academicYear?.yearName ?? academicYear?.year ?? camel.academicYear ?? "") as string,
      parentPhone: (camel.parentPhone ?? camel.parentPhoneNumber ?? primaryParent?.phone ?? primaryParent?.parentPhone ?? camel.phone ?? camel.mobile ?? "") as string,
      fatherName: (camel.fatherName ?? father?.parentName ?? father?.name ?? "") as string,
      fatherPhone: (camel.fatherPhone ?? father?.phone ?? "") as string,
      fatherOccupation: (camel.fatherOccupation ?? father?.occupation ?? "") as string,
      motherName: (camel.motherName ?? mother?.parentName ?? mother?.name ?? "") as string,
      motherPhone: (camel.motherPhone ?? mother?.phone ?? "") as string,
      email: (camel.email ?? primaryParent?.email ?? "") as string,
      emergencyContact: (camel.emergencyContact ?? primaryParent?.phone ?? "") as string,
      whatsappNumber: (camel.whatsappNumber ?? primaryParent?.phone ?? "") as string,
      feeStatus: (String(camel.feeStatus ?? camel.fee ?? camel.feePaymentStatus ?? "PAID")).toUpperCase() as Student["feeStatus"],
      status: (String(camel.status ?? camel.studentStatus ?? "ACTIVE")).toUpperCase() as Student["status"],
      classId: (camel.classId ?? camel.class_id ?? classDetail?.id ?? "") as string,
      sectionId: (camel.sectionId ?? camel.section_id ?? sectionDetail?.id ?? "") as string,
      academicYearId: (camel.academicYearId ?? academicYear?.id ?? "") as string,
      parentId: (camel.parentId ?? primaryParent?.id ?? "") as string,
    } as Student;
  },
  createStudent: async (payload: CreateStudentPayload): Promise<Student> => {
    const { data: raw } = await api.post("/tenant/createstudents", payload);
    const obj = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
    if (obj?.status === false) {
      throw new Error((obj?.message as string) ?? "Student creation failed");
    }
    const record = obj?.data && typeof obj.data === "object" && !Array.isArray(obj.data)
      ? obj.data as Record<string, unknown>
      : obj;
    const camel = toCamelCase(record) as Record<string, unknown>;
    if (!camel.id) {
      throw new Error("Student creation failed — no ID returned");
    }
    const classDetail = camel.classDetail as Record<string, unknown> | undefined;
    const sectionDetail = camel.sectionDetail as Record<string, unknown> | undefined;
    const cls = classDetail?.className ?? classDetail?.class_name ?? findField(camel, ["class", "className", "class_name", "classId", "class_id", "Class", "cls"]);
    const sec = sectionDetail?.sectionName ?? sectionDetail?.section_name ?? findField(camel, ["section", "sectionName", "section_name", "sectionId", "section_id", "Section", "sec"]);
    return {
      ...camel,
      class: typeof cls === "string" && cls ? cls : "",
      section: typeof sec === "string" && sec ? sec : "",
      admissionNo: camel.admissionNo ?? camel.admissionNumber ?? camel.admissionId ?? camel.admission ?? "",
      firstName: camel.firstName ?? camel.first ?? camel.givenName ?? "",
      lastName: camel.lastName ?? camel.last ?? camel.familyName ?? camel.surName ?? "",
      parentPhone: camel.parentPhone ?? camel.parentPhoneNumber ?? camel.phone ?? camel.mobile ?? "",
      feeStatus: (String(camel.feeStatus ?? camel.fee ?? camel.feePaymentStatus ?? "PENDING")).toUpperCase(),
      status: (String(camel.status ?? camel.studentStatus ?? "ACTIVE")).toUpperCase(),
    } as Student;
  },

  bulkCreateStudents: async (students: CreateStudentPayload[]): Promise<Student[]> => {
    const { data: raw } = await api.post("/tenant/students/bulk", { students });
    const obj = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
    if (obj?.status === false) {
      throw new Error((obj?.message as string) ?? "Bulk creation failed");
    }
    const list = Array.isArray(obj?.data) ? (obj.data as Record<string, unknown>[]) : [];
    return list.map((record) => {
      const camel = toCamelCase(record) as Record<string, unknown>;
      return {
        ...camel,
        admissionNo: camel.admissionNo ?? camel.admissionNumber ?? "",
        firstName: camel.firstName ?? camel.first ?? "",
        lastName: camel.lastName ?? camel.last ?? "",
        parentPhone: camel.parentPhone ?? camel.phone ?? "",
        feeStatus: "PENDING",
        status: "ACTIVE",
      } as Student;
    });
  },

  updateParent: async (parentId: string, payload: { parent_name?: string; phone?: string }): Promise<void> => {
    const { data: raw } = await api.put(`/tenant/updateparentById/${parentId}`, payload);
    if (raw && typeof raw === "object" && (raw as Record<string, unknown>).status === false) {
      throw new Error(((raw as Record<string, unknown>).message as string) ?? "Parent update failed");
    }
  },

  deleteStudent: async (id: string): Promise<void> => {
    await api.delete(`/tenant/deletestudentById/${id}`);
  },

  updateStudent: async (id: string, payload: UpdateStudentPayload): Promise<Student> => {
    const { data: raw } = await api.put(`/tenant/updatestudentById/${id}`, payload);

    if (raw && typeof raw === "object") {
      const obj = raw as Record<string, unknown>;
      if (obj?.status === false) {
        throw new Error((obj?.message as string) ?? "Update failed");
      }
      const item = obj?.data && typeof obj.data === "object" && !Array.isArray(obj.data)
        ? obj.data as Record<string, unknown>
        : obj;
      const camel = toCamelCase(item) as Record<string, unknown>;
      if (camel.id) return camel as unknown as Student;
    }

    throw new Error("Invalid response from server");
  },
};
