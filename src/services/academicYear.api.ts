import api from "@/config/axios";

export interface AcademicYearRecord {
  id: string;
  yearName: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  active: boolean; // alias kept for backward compatibility
  createdAt?: string;
  updatedAt?: string;
}

export interface GetAllAcademicYearsResponse {
  status: boolean;
  count?: number;
  totalPages?: number;
  currentPage?: number;
  data: AcademicYearRecord[];
}

export interface AcademicYearById {
  id: string;
  yearName: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const getAcademicYearById = async (id: string): Promise<AcademicYearById | null> => {
  try {
    const { data } = await api.get(`/tenant/getacademicyearById/${id}`);
    if (data?.status && data?.data) return data.data;
    return null;
  } catch {
    return null;
  }
};

const normalise = (raw: any): AcademicYearRecord => ({
  id:         raw.id,
  yearName:   raw.yearName,
  startDate:  raw.startDate,
  endDate:    raw.endDate,
  isActive:   raw.isActive ?? raw.active ?? false,
  active:     raw.isActive ?? raw.active ?? false,
  createdAt:  raw.createdAt,
  updatedAt:  raw.updatedAt,
});

export const selectAcademicYear = async (academicYearId: string): Promise<{ status: boolean; message: string }> => {
  const { data } = await api.patch("/academic-years/select", { academicYearId });
  return data;
};

export const getAllAcademicYears = async (): Promise<GetAllAcademicYearsResponse> => {
  const { data } = await api.get("/tenant/getallacademicyears");
  if (!data?.status || !Array.isArray(data?.data)) {
    throw new Error("Failed to fetch academic years");
  }
  return {
    status:      data.status,
    count:       data.count,
    totalPages:  data.totalPages,
    currentPage: data.currentPage,
    data:        data.data.map(normalise),
  };
};

// ── Carry Forward ──────────────────────────────────────────────────────────

// Supported module keys (must match backend string values exactly)
export type CarryForwardModule =
  | "classes"
  | "sections"
  | "subjects"
  | "subjectAssignments"
  | "staff"
  | "departments";

export interface CarryForwardPreviewPayload {
  sourceAcademicYearId: string;
  modules: CarryForwardModule[];
}

export interface CarryForwardExecutePayload {
  sourceAcademicYearId: string;
  targetAcademicYearId: string;
  modules: CarryForwardModule[];
}

export interface CarryForwardPreviewItem {
  name: string;
  count: number;
}

export interface CarryForwardPreviewResponse {
  status: boolean;
  data: CarryForwardPreviewItem[];
}

export interface CarryForwardResult {
  status: boolean;
  message?: string;
}

export const previewCarryForward = async (
  payload: CarryForwardPreviewPayload,
): Promise<CarryForwardPreviewResponse> => {
  const { data } = await api.post("/tenant/carryforwardpreview", payload);
  return data;
};

export const carryForward = async (
  payload: CarryForwardExecutePayload,
): Promise<CarryForwardResult> => {
  const { data } = await api.post("/tenant/carryforwardexecute", payload);
  return data;
};

// ── Student Promotion ──────────────────────────────────────────────────────

export interface CarryForwardStatusResponse {
  status: boolean;
  completed: boolean;
  yearStatuses?: Record<string, boolean>;
}

export const getCarryForwardStatus = async (): Promise<CarryForwardStatusResponse> => {
  try {
    const { data } = await api.get("/tenant/academic-years/carry-forward/status");
    return data;
  } catch {
    // On error, treat as complete so the user isn't stuck in the wizard.
    return { status: true, completed: true };
  }
};

export type PromotionAction = "PROMOTE" | "REPEAT" | "DROPOUT" | "TRANSFERRED" | "GRADUATED";

export interface StudentPromotionEntry {
  studentId: string;
  classId: string;
  sectionId: string;
  action: PromotionAction;
}

export interface PromoteStudentsPayload {
  sourceAcademicYearId: string;
  targetAcademicYearId: string;
  students: StudentPromotionEntry[];
}

export const promoteStudents = async (
  payload: PromoteStudentsPayload,
): Promise<{ status: boolean; message: string }> => {
  const { data } = await api.post("/tenant/student-promotions", payload);
  return data;
};
