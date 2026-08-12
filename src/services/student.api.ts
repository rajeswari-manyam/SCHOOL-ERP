import api from "@/config/axios";
import { getErrorMessage } from "@/utils/getErrorMessage";
// A student's parentDetail is a single combined father+mother record — the
// backend no longer returns separate per-relation rows.
export interface ParentDetail {
  id: string;
  father_name: string;
  mother_name: string;
  father_phone: string;
  mother_phone: string;
  father_email: string;
  mother_email: string;
  father_occupation?: string;
  mother_occupation?: string;
  father_image?: string;
  mother_image?: string;
  address?: string;
}

export interface Student {
  id: string;
  first_name: string;
  last_name: string;
  gender: string;
  date_of_birth: string;
  blood_group: string;
  address: string;
  photo?: string | null;

  class_id: string;
  sectionId: string;
  academicYearId: string;

  roll_number: string;
  admission_number: string;
  admission_date: string;
  status: "active" | "inactive";

  school_id: string;
  school_code: string;

  parentId?: string | null;

  createdAt: string;
  updatedAt: string;

  classDetail?: {
    id: string;
    class_name: string;
  };

  sectionDetail?: {
    id: string;
    sectionName: string;
  };

  // ADD THESE
  academicYear?: {
    id: string;
    yearName: string;
  };

  studentName?: string;

  parentDetail?: ParentDetail[];

  classTeacher?: {
    id?: string;
    employee_id?: string;
    first_name: string;
    last_name: string | null;
    phone?: string;
    email?: string;
    photo?: string | null;
  } | null;
}

export interface ApiResponse<T> {
  status: boolean;
  data: T;
}

export const getStudentById = async (
  studentId: string
): Promise<Student> => {
  const response = await api.get<ApiResponse<Student>>(
    `/tenant/getstudentsById/${studentId}`
  );
  return response.data.data;
};
/* ===== Merged from school-students.api.ts (Student type aliased to AdminStudentUI to avoid collision with the Student interface above) ===== */
import type { CreateStudentPayload, UpdateStudentPayload, UpdateParentPayload, Student as AdminStudentUI } from "@/features/school-admin/students/types/student.types";
import type { StudentImportResponse } from "@/features/school-admin/students/types/studentImport.types";
import { getAllClasses } from "@/services/class.api";
import { getSectionsByClassId, getAllSections } from "@/services/section.api";

const toCamelCase = (obj: unknown): unknown => {
  if (Array.isArray(obj)) return obj.map(toCamelCase);
  if (obj !== null && typeof obj === "object") {
    const source = obj as Record<string, unknown>;
    return Object.keys(source).reduce((acc, key) => {
      const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
      acc[camelKey] = toCamelCase(source[key]);
      return acc;
    }, {} as Record<string, unknown>);
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
  students: AdminStudentUI[],
  classMap: Record<string, string>,
  sectionMap: Record<string, string>,
): AdminStudentUI[] =>
  students.map((s) => {
    // class_id is a legacy/snake_case key that may still be present on the raw object
    // even though it isn't part of the AdminStudentUI type — cast narrowly instead of
    // `any` so the fallback lookup keeps working without widening the type.
    const extra = s as unknown as { class_id?: string };
    return {
      ...s,
      class: classMap[s.class] ?? classMap[extra.class_id ?? ""] ?? (s.class || ""),
      section: sectionMap[s.section] ?? sectionMap[s.sectionId ?? ""] ?? (s.section || ""),
    };
  });

export const studentsApi = {
  getAll: async (academicYearId?: string | null): Promise<AdminStudentUI[]> => {
    const params: Record<string, string> = {};
    if (academicYearId) params.academicYearId = academicYearId;
    const { data } = await api.get<unknown>("/tenant/getallstudents", { params });
    let list: unknown[] = [];
    if (Array.isArray(data)) {
      list = data;
    } else if (data && typeof data === "object") {
      const obj = data as Record<string, unknown>;
      if (Array.isArray(obj.students)) list = obj.students;
      else if (Array.isArray(obj.data)) list = obj.data;
      else return [];
    } else {
      return [];
    }
    return list.map((raw: unknown) => {
      const s = toCamelCase(raw) as Record<string, unknown>;
      const classDetail = s.classDetail as Record<string, unknown> | undefined;
      const sectionDetail = s.sectionDetail as Record<string, unknown> | undefined;
      const cls = classDetail?.className ?? classDetail?.class_name ?? findField(s, ["class", "className", "class_name", "classId", "class_id", "Class", "cls"]) ?? "";
      const sec = sectionDetail?.sectionName ?? sectionDetail?.section_name ?? findField(s, ["section", "sectionName", "section_name", "sectionId", "section_id", "Section", "sec"]) ?? "";
      const studentName = (s.studentName ?? "") as string;
      const nameParts = studentName.trim().split(/\s+/);
      const firstName = s.firstName ?? s.first ?? s.givenName ?? nameParts[0] ?? "";
      const lastName = s.lastName ?? s.last ?? s.familyName ?? s.surName ?? (nameParts.length > 1 ? nameParts.slice(1).join(" ") : "") ?? "";
      // The list endpoint nests the combined father+mother record under "parents"
      // (getById uses "parentDetail") — check both so sibling auto-fill works either way.
      const parentDetail = ((s.parents as Array<Record<string, unknown>> | undefined)?.[0]
        ?? (s.parentDetail as Array<Record<string, unknown>> | undefined)?.[0]) as Record<string, unknown> | undefined;
      return {
        ...s,
        class: typeof cls === "string" && cls ? cls : "",
        section: typeof sec === "string" && sec ? sec : "",
        admissionNo: s.admissionNo ?? s.admissionNumber ?? s.admissionId ?? s.admission ?? "",
        firstName,
        lastName,
        parentPhone: s.parentPhone ?? s.parentPhoneNumber ?? parentDetail?.fatherPhone ?? s.phone ?? s.mobile ?? "",
        feeStatus: (String(s.feeStatus ?? s.fee ?? s.feePaymentStatus ?? "PENDING")).toUpperCase(),
        status: (String(s.status ?? s.studentStatus ?? "ACTIVE")).toUpperCase(),
        parentId: s.parentId ?? parentDetail?.id ?? "",
        fatherName: s.fatherName ?? parentDetail?.fatherName ?? "",
        fatherPhone: s.fatherPhone ?? parentDetail?.fatherPhone ?? "",
        fatherOccupation: s.fatherOccupation ?? parentDetail?.fatherOccupation ?? "",
        fatherEmail: s.fatherEmail ?? parentDetail?.fatherEmail ?? "",
        motherName: s.motherName ?? parentDetail?.motherName ?? "",
        motherPhone: s.motherPhone ?? parentDetail?.motherPhone ?? "",
        motherOccupation: s.motherOccupation ?? parentDetail?.motherOccupation ?? "",
        motherEmail: s.motherEmail ?? parentDetail?.motherEmail ?? "",
        residentialAddress: s.residentialAddress ?? s.address ?? "",
      } as AdminStudentUI;
    });
  },
  getById: async (id: string): Promise<AdminStudentUI | undefined> => {
    const { data } = await api.get<unknown>(`/tenant/getstudentsById/${id}`);
    let raw: unknown = data;
    if (raw && typeof raw === "object" && !Array.isArray(raw)) {
      const obj = raw as Record<string, unknown>;
      if (obj.data && typeof obj.data === "object") raw = obj.data;
    }
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

    // parentDetail is a single combined father+mother record (no per-relation rows anymore)
    const parentRecord = parentDetail?.[0] as Record<string, unknown> | undefined;

    return {
      ...camel,
      id: camel.id as string,
      firstName,
      lastName,
      admissionNo: (camel.admissionNo ?? camel.admissionNumber ?? camel.admissionId ?? camel.admission ?? "") as string,
      class: cls,
      section: sec,
      dob: (camel.dob ?? camel.dateOfBirth ?? camel.date_of_birth ?? "") as string,
      gender: gender as AdminStudentUI["gender"],
      bloodGroup: (camel.bloodGroup ?? camel.blood_group ?? undefined) as AdminStudentUI["bloodGroup"],
      residentialAddress: (camel.residentialAddress ?? camel.address ?? "") as string,
      rollNumber: camel.rollNumber !== undefined ? Number(camel.rollNumber) : undefined,
      admittedOn: (camel.admittedOn ?? camel.admissionDate ?? camel.admission_date ?? "") as string,
      academicYear: (academicYear?.yearName ?? academicYear?.year ?? camel.academicYear ?? "") as string,
      parentPhone: (camel.parentPhone ?? camel.parentPhoneNumber ?? parentRecord?.fatherPhone ?? camel.phone ?? camel.mobile ?? "") as string,
      fatherName: (camel.fatherName ?? parentRecord?.fatherName ?? "") as string,
      fatherPhone: (camel.fatherPhone ?? parentRecord?.fatherPhone ?? "") as string,
      fatherOccupation: (camel.fatherOccupation ?? parentRecord?.fatherOccupation ?? "") as string,
      motherName: (camel.motherName ?? parentRecord?.motherName ?? "") as string,
      motherPhone: (camel.motherPhone ?? parentRecord?.motherPhone ?? "") as string,
      motherOccupation: (camel.motherOccupation ?? parentRecord?.motherOccupation ?? "") as string,
      fatherEmail: (camel.fatherEmail ?? parentRecord?.fatherEmail ?? "") as string,
      motherEmail: (camel.motherEmail ?? parentRecord?.motherEmail ?? "") as string,
      emergencyContact: (camel.emergencyContact ?? parentRecord?.fatherPhone ?? "") as string,
      whatsappNumber: (camel.whatsappNumber ?? parentRecord?.fatherPhone ?? "") as string,
      feeStatus: (String(camel.feeStatus ?? camel.fee ?? camel.feePaymentStatus ?? "PAID")).toUpperCase() as AdminStudentUI["feeStatus"],
      status: (String(camel.status ?? camel.studentStatus ?? "ACTIVE")).toUpperCase() as AdminStudentUI["status"],
      classId: (camel.classId ?? camel.class_id ?? classDetail?.id ?? "") as string,
      sectionId: (camel.sectionId ?? camel.section_id ?? sectionDetail?.id ?? "") as string,
      academicYearId: (camel.academicYearId ?? academicYear?.id ?? "") as string,
      parentId: (camel.parentId ?? parentRecord?.id ?? "") as string,
      parentImage: (camel.fatherImage ?? parentRecord?.fatherImage ?? "") as string,
      motherImage: (camel.motherImage ?? parentRecord?.motherImage ?? "") as string,
    } as AdminStudentUI;
  },
  createStudent: async (payload: CreateStudentPayload): Promise<AdminStudentUI> => {
    // Backend expects multipart/form-data (so it can accept an optional photo file).
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;
      formData.append(key, value instanceof File ? value : String(value));
    });

    let raw: unknown;
    try {
      const res = await api.post("/tenant/createstudents", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      raw = res.data;
    } catch (err) {
      throw new Error(getErrorMessage(err, "Failed to create student"));
    }
    const obj = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
    if (obj?.status === false) {
      throw new Error((obj?.message as string) ?? "AdminStudentUI creation failed");
    }
    const record = obj?.data && typeof obj.data === "object" && !Array.isArray(obj.data)
      ? obj.data as Record<string, unknown>
      : obj;
    const camel = toCamelCase(record) as Record<string, unknown>;
    if (!camel.id) {
      throw new Error("AdminStudentUI creation failed — no ID returned");
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
    } as AdminStudentUI;
  },

  /**
   * ⚠️ PENDING BACKEND INTEGRATION.
   *
   * The backend team has not yet provided the Student Excel Import API —
   * its HTTP method, endpoint, multipart field name, and response shape are
   * all unconfirmed. Do NOT guess these. This intentionally throws so the
   * Import UI (useStudentImport → ImportStudentsExcelPage) shows a clear
   * "not connected yet" state instead of pretending to succeed.
   *
   * When the real API is provided, replace this body with the actual call —
   * it must resolve to a StudentImportResponse. Do not change the Import UI
   * itself; it already renders whatever this returns.
   */
  importFromExcel: async (_file: File): Promise<StudentImportResponse> => {
    throw new Error(
      "Student Excel import is not connected to a backend API yet. The import screen is fully built — " +
      "it will start working as soon as studentsApi.importFromExcel() is wired to the real endpoint."
    );
  },

  bulkCreateStudents: async (students: CreateStudentPayload[]): Promise<AdminStudentUI[]> => {
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
      } as AdminStudentUI;
    });
  },

  updateParent: async (parentId: string, payload: UpdateParentPayload): Promise<void> => {
    const hasFiles = Object.values(payload).some((v) => v instanceof File);

    if (hasFiles) {
      const body = Object.entries(payload).reduce((fd, [key, value]) => {
        if (value === undefined || value === null || value === "") return fd;
        if (Array.isArray(value)) {
          value.forEach((v) => fd.append(key, String(v)));
        } else {
          fd.append(key, value instanceof File ? value : String(value));
        }
        return fd;
      }, new FormData());

      const { data: raw } = await api.put(`/tenant/updateparentById/${parentId}`, body, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (raw && typeof raw === "object" && (raw as Record<string, unknown>).status === false) {
        throw new Error(((raw as Record<string, unknown>).message as string) ?? "Parent update failed");
      }
    } else {
      const cleaned: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(payload)) {
        if (value === undefined || value === null || value === "") continue;
        cleaned[key] = value;
      }
      const { data: raw } = await api.put(`/tenant/updateparentById/${parentId}`, cleaned);
      if (raw && typeof raw === "object" && (raw as Record<string, unknown>).status === false) {
        throw new Error(((raw as Record<string, unknown>).message as string) ?? "Parent update failed");
      }
    }
  },

  deleteStudent: async (id: string): Promise<void> => {
    await api.delete(`/tenant/deletestudentById/${id}`);
  },

  updateStudent: async (id: string, payload: UpdateStudentPayload): Promise<AdminStudentUI> => {
    // Only switch to multipart when a new photo file is actually attached —
    // keeps the plain-JSON path (already working) untouched otherwise.
    const hasPhoto = payload.photo instanceof File;
    const body: UpdateStudentPayload | FormData = hasPhoto
      ? Object.entries(payload).reduce((fd, [key, value]) => {
          if (value === undefined || value === null || value === "") return fd;
          fd.append(key, value instanceof File ? value : String(value));
          return fd;
        }, new FormData())
      : payload;

    const { data: raw } = await api.put(
      `/tenant/updatestudentById/${id}`,
      body,
      hasPhoto ? { headers: { "Content-Type": "multipart/form-data" } } : undefined
    );

    if (raw && typeof raw === "object") {
      const obj = raw as Record<string, unknown>;
      if (obj?.status === false) {
        throw new Error((obj?.message as string) ?? "Update failed");
      }
      const item = obj?.data && typeof obj.data === "object" && !Array.isArray(obj.data)
        ? obj.data as Record<string, unknown>
        : obj;
      const camel = toCamelCase(item) as Record<string, unknown>;
      if (camel.id) return camel as unknown as AdminStudentUI;
    }

    throw new Error("Invalid response from server");
  },
};