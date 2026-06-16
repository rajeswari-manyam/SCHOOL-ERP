import api from "@/config/axios";
import { getAllClasses, getAcademicYearClasses, getAllStaff } from "@/services/class.api";
import { getSectionsByClassIdFromApi, getSectionById } from "@/services/section.api";
import { getSubjectsBySectionId, getAllSubjects, type SubjectRecord } from "@/services/subject.api";
import type { ClassItem, SectionItem, SubjectItem, CreateClassPayload, ClassApiResponse, AddSectionPayload, AddSubjectPayload, CreateSectionResponse } from "@/features/school-admin/classes/types/classes.types";

export const fetchClasses = async (academicYearId?: string | null): Promise<ClassItem[]> => {
  let classesRes: { status: boolean; data: import("@/services/class.api").ClassRecord[] };

  if (academicYearId) {
    const res = await getAcademicYearClasses(academicYearId);
    classesRes = res;
  } else {
    const params: import("@/services/class.api").GetAllClassesParams = {};
    const res = await getAllClasses(params);
    classesRes = res;
  }

  if (!classesRes?.status || !Array.isArray(classesRes.data)) {
    throw new Error(classesRes?.status === false
      ? "Server returned unsuccessful status for classes"
      : "Invalid response format from /tenant/getallclasses"
    );
  }

  const grouped = new Map<string, typeof classesRes.data[0][]>();
  for (const record of classesRes.data) {
    const key = record.class_name;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(record);
  }

  const classSectionTotals = await Promise.all(
    [...grouped.entries()].map(async ([className, records]) => {
      const first = records[0];
      const [sectionRes, subjectsRes] = await Promise.all([
        getSectionsByClassIdFromApi(first.id).catch(() => null),
        getAllSubjects({ class_id: first.id }).catch(() => null),
      ]) as [{ data?: unknown } | null, { data?: unknown; count?: number } | null];
      const sectionRecords = asArray<Record<string, unknown>>(sectionRes?.data) ?? [];
      const subjectRecords = asArray<SubjectRecord>(subjectsRes?.data) ?? [];
      const subjectCount = subjectsRes?.count ?? subjectRecords.length;
      const subjectCountBySection = new Map<string, number>();
      for (const subject of subjectRecords) {
        const sectionId = String((subject as SubjectRecord & { sectionid?: string }).sectionid ?? subject.section_id ?? "");
        if (!sectionId) continue;
        subjectCountBySection.set(sectionId, (subjectCountBySection.get(sectionId) ?? 0) + 1);
      }
      const sectionStudentTotal = sectionRecords.reduce((sum, item) => sum + getStudentCount(item), 0);
      return {
        className,
        first,
        records,
        sectionRecords,
        sectionStudentTotal,
        subjectCount,
        subjectCountBySection,
      };
    })
  );

  const classes: ClassItem[] = [];
  for (const { className, first, records, sectionRecords, sectionStudentTotal, subjectCount, subjectCountBySection } of classSectionTotals) {
    const derivedTotalStudents = sectionStudentTotal || records.reduce((sum, r) => sum + getStudentCount(r as unknown as Record<string, unknown>), 0);

    const sectionsCount = Number(first.sections_count) || sectionRecords.length;
    classes.push({
      id: first.id,
      className,
      sections: sectionRecords.map((r) => ({
        id: String(r.id ?? ""),
        name: String(r.sectionName ?? r.section_name ?? ""),
        classTeacher: String(r.classTeacherName ?? r.class_teacher_name ?? r.classTeacherId ?? r.class_teacher_id ?? ""),
        totalStudents: getStudentCount(r),
        subjectCount: subjectCountBySection.get(String(r.id)) ?? 0,
        subjects: [],
      })).concat(
        sectionRecords.length < sectionsCount
          ? Array.from({ length: sectionsCount - sectionRecords.length }, (_, i) => ({
              id: `${first.id}-ph-${i}`,
              name: "",
              classTeacher: "",
              totalStudents: 0,
              subjectCount: 0,
              subjects: [],
            }))
          : []
      ),
      classTeacher: first.class_teacher ?? "",
      totalStudents: derivedTotalStudents,
      subjectCount,
      capacity: records.reduce((sum, r) => sum + (Number(r.capacity) || 0), 0),
      status: "ACTIVE",
    });
  }

  return classes.sort((a, b) => Number(a.className) - Number(b.className));
};

const getStudentCount = (record: Record<string, unknown>): number => {
  const value = Number(
    record.classStrength ??
    record.class_strength ??
    record.totalStrength ??
    record.total_strength ??
    record.studentCount ??
    record.student_count ??
    record.studentsCount ??
    record.students_count ??
    record.totalStudents ??
    record.total_students ??
    record.strength ??
    record.students ??
    0
  );
  return Number.isFinite(value) ? value : 0;
};

const toSectionItem = (record: Record<string, unknown>, teacherMap: Map<string, string> = new Map()): SectionItem => {
  const teacherId = String(record.classTeacherId ?? record.class_teacher_id ?? "");
  const teacherName = String(record.classTeacherName ?? record.class_teacher_name ?? record.teacherName ?? record.teacher_name ?? "");
  const resolvedTeacher = teacherName || teacherMap.get(teacherId) || teacherId;
  const subjectCount = Number(
    record.subjectCount ??
    record.subject_count ??
    record.totalSubjects ??
    record.total_subjects ??
    0
  );

  return {
    id: (record.id as string) || "",
    name: (record.sectionName || record.section_name || "") as string,
    classTeacher: resolvedTeacher,
    totalStudents: getStudentCount(record),
    subjects: [],
    subjectCount: Number.isFinite(subjectCount) ? subjectCount : 0,
  };
};

const asArray = <T>(value: unknown): T[] | null => (Array.isArray(value) ? (value as T[]) : null);

export const fetchSectionsByClassId = async (classId: string): Promise<SectionItem[]> => {
  const [sectionRes, subjectsRes, staffRes] = await Promise.all([
    getSectionsByClassIdFromApi(classId).catch(() => null),
    getAllSubjects({ class_id: classId }).catch(() => null),
    getAllStaff().catch(() => null),
  ]);

  const records =
    asArray<Record<string, unknown>>(sectionRes?.data) ??
    [];

  const teacherMap = new Map<string, string>();
  const staffRecords = asArray<{ id?: string; name?: string }>(staffRes?.data) ?? [];
  for (const staff of staffRecords) {
    if (staff.id && staff.name) teacherMap.set(staff.id, staff.name);
  }

  const subjectsBySection = new Map<string, SubjectItem[]>();
  const subjectRecords = asArray<SubjectRecord>(subjectsRes?.data) ?? [];

  if (subjectsRes?.status && subjectRecords.length) {
    for (const r of subjectRecords) {
      const sid = r.section_id;
      if (!sid) continue;
      if (!subjectsBySection.has(sid)) subjectsBySection.set(sid, []);
      subjectsBySection.get(sid)!.push(toSubjectItem(r));
    }
  }

  return records.map((r) => {
    const section = toSectionItem(r, teacherMap);
    const sectionSubjects = subjectsBySection.get(String(r.id ?? ""));
    if (sectionSubjects && sectionSubjects.length) {
      section.subjects = sectionSubjects;
      section.subjectCount = section.subjectCount || sectionSubjects.length;
    }
    return section;
  });
};

export const fetchSectionById = async (sectionId: string): Promise<SectionItem | null> => {
  const [res, staffRes] = await Promise.all([
    getSectionById(sectionId),
    getAllStaff().catch(() => null),
  ]);
  const record = res ? ((res as { data?: unknown }).data ?? res) : null;
  if (record) {
    const teacherMap = new Map<string, string>();
    const staffRecords = asArray<{ id?: string; name?: string }>(staffRes?.data) ?? [];
    for (const staff of staffRecords) {
      if (staff.id && staff.name) teacherMap.set(staff.id, staff.name);
    }
    return toSectionItem(record as unknown as Record<string, unknown>, teacherMap);
  }
  return null;
};

const toSubjectItem = (record: SubjectRecord | Record<string, unknown>): SubjectItem => ({
  id: String((record as Record<string, unknown>).id ?? ""),
  name: String((record as Record<string, unknown>).subject_name ?? ""),
  subjectCode: String((record as Record<string, unknown>).subject_code ?? ""),
  teacher: String((record as Record<string, unknown>).teacher_name ?? ""),
});

export const fetchSubjectsBySectionId = async (sectionId: string): Promise<SubjectItem[]> => {
  const res = await getSubjectsBySectionId(sectionId);
  const records =
    asArray<SubjectRecord>(res?.data) ??
    asArray<Record<string, unknown>>((res as { subjects?: unknown } | undefined)?.subjects) ??
    [];

  return records.map((item) => toSubjectItem(item));
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
