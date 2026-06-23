export interface ClassItem {
  id: string;
  className: string;
  sections: SectionItem[];
  classTeacher: string;
  totalStudents: number;
  subjectCount?: number;
  capacity: number;
  status: "ACTIVE" | "INACTIVE";
}

export interface SectionItem {
  id: string;
  name: string;
  classTeacher: string;
  totalStudents: number;
  subjects: SubjectItem[];
  subjectCount?: number;
}

export interface SubjectItem {
  id: string;
  name: string;
  subjectCode: string;
  teacher: string;
}

export interface CreateClassPayload {
  class_name: string;
  academicYearId: string;
}

export interface ClassApiResponse {
  status: boolean;
  message?: string;
  data?: {
    id: string;
    class_name: string;
    academicYearId: string;
  };
}

export interface BulkAddClassesResponse {
  status: boolean;
  message: string;
  inserted: number;
  skipped: number;
  data: Array<{
    id: string;
    class_name: string;
    academicYearId: string;
  }>;
}

export interface BulkAddSectionsResponse {
  status: boolean;
  message: string;
  inserted: number;
  skipped: number;
  data: Array<{
    id: string;
    sectionName: string;
    classId: string;
    academicYearId: string;
    totalStrength: number;
    classTeacherId: string;
  }>;
}

export interface BulkAddSubjectsResponse {
  status: boolean;
  message: string;
  inserted: number;
  skipped: number;
  data: SubjectRecord[];
}

export interface AddSectionPayload {
  sectionName: string;
  classTeacherId: string;
  classId: string;
  academicYearId: string;
  totalStrength: number;
}

export interface CreateSectionResponse {
  status: boolean;
  message?: string;
  data?: {
    id?: string;
    sectionName?: string;
    classTeacherId?: string;
    classId?: string;
    academicYearId?: string;
    totalStrength?: number;
  };
}

export interface AddSubjectPayload {
  subject_name: string;
  class_id: string;
  sectionid: string;
  teacher_id: string;
  academicYearId: string;
}

export interface SubjectApiResponse {
  status: boolean;
  message?: string;
  data?: {
    id: string;
    subject_name: string;
    class_id: string;
    section_id: string;
    teacher_id: string;
    academic_year_id: string;
  };
}

export interface GetSectionsByClassIdResponse {
  status: boolean;
  count?: number;
  data: Array<{
    id: string;
    sectionName?: string;
    section_name?: string;
    classTeacherId?: string;
    class_teacher_id?: string;
    totalStrength?: number;
    total_strength?: number;
    subjectCount?: number;
    subject_count?: number;
    totalSubjects?: number;
    classId?: string;
    class_id?: string;
    academicYearId?: string;
    academic_year_id?: string;
  }>;
}

export interface GetAllSubjectsResponse {
  status: boolean;
  count?: number;
  data: Array<{
    id: string;
    subject_name: string;
    subject_code?: string;
    class_id: string;
    section_id: string;
    teacher_id: string;
    academic_year_id: string;
    teacher_name?: string;
  }>;
}
