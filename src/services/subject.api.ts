import api from "@/config/axios";

export interface SubjectRecord {
  id: string;
  subject_name: string;
  subject_code?: string;
  class_id: string;
  section_id: string;
  teacher_id: string;
  academic_year_id: string;
  teacher_name?: string;
}

export interface GetAllSubjectsParams {
  class_id?: string;
  section_id?: string;
  academicYearId?: string;
}

export interface GetAllSubjectsResponse {
  status: boolean;
  count?: number;
  data: SubjectRecord[];
}

export interface CreateSubjectPayload {
  subject_name: string;
  class_id: string;
  sectionid: string;
  teacher_id: string;
  academicYearId: string;
}

export interface CreateSubjectResponse {
  status: boolean;
  message?: string;
  data?: SubjectRecord;
}

export interface SubjectDetail {
  id: string;
  subject_name: string;
  class_id: string;
  class_name: string;
  teacher_id: string;
  teacher_name: string;
  sectionid: string;
  section_name: string;
  academicYearId: string;
  createdAt: string;
  updatedAt: string;
}

export const getSubjectById = async (id: string): Promise<SubjectDetail> => {
  const { data } = await api.get<{ status: boolean; data: SubjectDetail }>(
    `/tenant/getsubjectById/${id}`
  );
  return data.data;
};

export const getAllSubjects = async (
  params?: GetAllSubjectsParams
): Promise<GetAllSubjectsResponse> => {
  const { data } = await api.get<GetAllSubjectsResponse>(
    "/tenant/getallsubjects",
    { params }
  );
  return data;
};

export interface GetSubjectsBySectionIdResponse {
  status: boolean;
  count?: number;
  data: SubjectRecord[];
}

export const getSubjectsBySectionId = async (
  sectionId: string
): Promise<GetSubjectsBySectionIdResponse> => {
  const { data } = await api.get<GetSubjectsBySectionIdResponse>(
    `/tenant/getsubjectsBySectionId/${sectionId}`
  );
  return data;
};

export const createSubject = async (
  payload: CreateSubjectPayload
): Promise<CreateSubjectResponse> => {
  const { data } = await api.post<CreateSubjectResponse>(
    "/tenant/subjects",
    payload
  );
  return data;
};

export interface BulkCreateSubjectPayload {
  subject_name: string;
  class_id: string;
  sectionid: string;
  teacher_id: string;
  academicYearId: string;
}

export interface BulkCreateSubjectsResponse {
  status: boolean;
  message: string;
  inserted: number;
  skipped: number;
  data: SubjectRecord[];
}

export const bulkCreateSubjects = async (
  items: BulkCreateSubjectPayload[]
): Promise<BulkCreateSubjectsResponse> => {
  const { data } = await api.post<BulkCreateSubjectsResponse>(
    "/tenant/subjects/bulk",
    { subjects: items }
  );
  return data;
};
