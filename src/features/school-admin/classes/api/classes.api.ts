import api from "@/config/axios";
import { getAllClasses, getSectionsByClassId, getSectionById } from "@/services/class.api";
import { getSubjectsBySectionId } from "@/services/subject.api";
import type { ClassItem, SectionItem, SubjectItem, CreateClassPayload, ClassApiResponse, AddSectionPayload, AddSubjectPayload, CreateSectionResponse } from "../types/classes.types";

export const fetchClasses = async (academicYearId?: string | null): Promise<ClassItem[]> => {
  const params = academicYearId ? { academicYearId } : {};
  const classesRes = await getAllClasses(params);

  if (!classesRes.status || !Array.isArray(classesRes.data)) {
    return [];
  }

  const grouped = new Map<string, typeof classesRes.data[0][]>();
  for (const record of classesRes.data) {
    const key = record.class_name;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(record);
  }

  const classes: ClassItem[] = [];
  for (const [className, records] of grouped) {
    const first = records[0];
    classes.push({
      id: first.id,
      className,
      sections: [],
      classTeacher: first.class_teacher,
      totalStudents: records.reduce((sum, r) => sum + (r.total_strength || 0), 0),
      capacity: records.reduce((sum, r) => sum + (r.capacity || 0), 0),
      status: "ACTIVE",
    });
  }

  return classes.sort((a, b) => Number(a.className) - Number(b.className));
};

const toSectionItem = (record: Record<string, unknown>): SectionItem => ({
  id: (record.id as string) || "",
  name: (record.sectionName || record.section_name || "") as string,
  classTeacher: (record.classTeacherId || record.class_teacher_id || "") as string,
  totalStudents: Number(record.totalStrength ?? record.total_strength ?? 0),
  subjects: [],
});

export const fetchSectionsByClassId = async (classId: string): Promise<SectionItem[]> => {
  const res = await getSectionsByClassId(classId);
  const records = Array.isArray(res)
    ? res
    : Array.isArray(res?.data)
      ? res.data
      : Array.isArray((res as Record<string, unknown>)?.sections)
        ? (res as Record<string, unknown>).sections as Record<string, unknown>[]
        : null;
  if (records) {
    return records.map(toSectionItem);
  }
  return [];
};

export const fetchSectionById = async (sectionId: string): Promise<SectionItem | null> => {
  const res = await getSectionById(sectionId);
  const record = res?.data;
  if (record) {
    return toSectionItem(record as unknown as Record<string, unknown>);
  }
  return null;
};

const toSubjectItem = (record: Record<string, unknown>): SubjectItem => ({
  id: (record.id as string) || "",
  name: (record.subject_name as string) || "",
  subjectCode: (record.subject_code as string) || "",
  teacher: (record.teacher_name as string) || "",
});

export const fetchSubjectsBySectionId = async (sectionId: string): Promise<SubjectItem[]> => {
  const res = await getSubjectsBySectionId(sectionId);
  const records = Array.isArray(res)
    ? res
    : Array.isArray(res?.data)
      ? res.data
      : Array.isArray((res as Record<string, unknown>)?.subjects)
        ? (res as Record<string, unknown>).subjects as Record<string, unknown>[]
        : null;
  if (records) {
    return records.map(toSubjectItem);
  }
  return [];
};

export const addClass = async (payload: CreateClassPayload): Promise<ClassItem> => {
  const body = { class_name: payload.class_name, academicYearId: payload.academicYearId };
  try {
    const { data } = await api.post<ClassApiResponse>("/tenant/class", body);
    if (!data?.status) {
      throw new Error(data?.message || "Server returned unsuccessful status");
    }
    const id = data?.data?.id || `cls-${Date.now()}`;
    return {
      id,
      className: payload.class_name,
      sections: [],
      classTeacher: "",
      totalStudents: 0,
      capacity: 0,
      status: "ACTIVE",
    };
  } catch (err: unknown) {
    const responseDetail = (err as { response?: { data?: unknown }; message?: string })?.response?.data ?? (err as { message?: string })?.message ?? "Unknown error";
    const detailStr = typeof responseDetail === "object" ? JSON.stringify(responseDetail, null, 2) : String(responseDetail);
    console.error("addClass failed", { url: "/tenant/class", payload: body, response: detailStr });
    const fullMsg = [`POST /tenant/class`, `Payload: ${JSON.stringify(body)}`, `Response: ${detailStr}`].join("\n");
    throw new Error(fullMsg);
  }
};

export const addSection = async (payload: AddSectionPayload): Promise<SectionItem> => {
  try {
    const { data } = await api.post<CreateSectionResponse>("/tenant/createsections", payload);
    if (!data?.status) {
      throw new Error(data?.message || "Server returned unsuccessful status");
    }

    const sectionData = data?.data;
    return {
      id: sectionData?.id || `sec-${Date.now()}`,
      name: sectionData?.sectionName || payload.sectionName,
      classTeacher: sectionData?.classTeacherId || payload.classTeacherId,
      totalStudents: Number(sectionData?.totalStrength ?? payload.totalStrength ?? 0),
      subjects: [],
    };
  } catch (err: unknown) {
    const responseDetail = (err as { response?: { data?: unknown }; message?: string })?.response?.data ?? (err as { message?: string })?.message ?? "Unknown error";
    const detailStr = typeof responseDetail === "object" ? JSON.stringify(responseDetail, null, 2) : String(responseDetail);
    console.error("addSection failed", { url: "/tenant/createsections", payload, response: detailStr });
    throw new Error(`POST /tenant/createsections\nPayload: ${JSON.stringify(payload)}\nResponse: ${detailStr}`);
  }
};

export const addSubject = async (payload: AddSubjectPayload): Promise<SubjectItem> => {
  try {
    const { data } = await api.post("/tenant/subjects", payload);
    if (!data?.status) {
      throw new Error(data?.message || "Server returned unsuccessful status");
    }
    const record = data?.data;
    return {
      id: record?.id || `sub-${Date.now()}`,
      name: record?.subject_name || payload.subject_name,
      subjectCode: record?.subject_code || "",
      teacher: record?.teacher_name || "",
    };
  } catch (err: unknown) {
    const responseDetail = (err as { response?: { data?: unknown }; message?: string })?.response?.data ?? (err as { message?: string })?.message ?? "Unknown error";
    const detailStr = typeof responseDetail === "object" ? JSON.stringify(responseDetail, null, 2) : String(responseDetail);
    console.error("addSubject failed", { url: "/tenant/subjects", payload, response: detailStr });
    throw new Error(`POST /tenant/subjects\nPayload: ${JSON.stringify(payload)}\nResponse: ${detailStr}`);
  }
};
