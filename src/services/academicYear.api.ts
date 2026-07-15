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

// Modules copied automatically by the Academic Year Setup carry-forward flow
export const DEFAULT_CARRY_FORWARD_MODULES: CarryForwardModule[] = [
  "classes",
  "sections",
  "subjects",
  "subjectAssignments",
  "staff",
  "departments",
];

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

// ── Carry Forward status (no backend status endpoint — derived locally) ───
// The backend has no GET /tenant/carryforwardstatus route (404). We replace it
// with two pieces the backend *does* support / we can track client-side:
//   1. Eligibility  → does the previous academic year actually have records to
//                      copy? Answered by calling the working previewCarryForward
//                      endpoint and checking the returned counts.
//   2. Completion   → has carry-forward already been run for a target year?
//                      Not knowable from the backend at all right now, so it's
//                      tracked in localStorage, set the moment carryForward()
//                      succeeds for that target year.

// Stores which modules were carried forward per target year — not just a
// done/not-done bit — so the Setup Guide can only mark a step complete when
// the module(s) it actually depends on were part of the carry-forward run.
const CF_COMPLETED_STORAGE_KEY = "cf_completed_years";

const readCompletedMap = (): Record<string, CarryForwardModule[]> => {
  try {
    const parsed = JSON.parse(localStorage.getItem(CF_COMPLETED_STORAGE_KEY) ?? "{}");
    // Migrate the old boolean-flag shape ({ [yearId]: true }) to the module-list shape
    // by treating a legacy `true` as "all default modules were carried forward".
    const migrated: Record<string, CarryForwardModule[]> = {};
    for (const [yearId, value] of Object.entries(parsed)) {
      migrated[yearId] = value === true
        ? DEFAULT_CARRY_FORWARD_MODULES
        : Array.isArray(value) ? (value as CarryForwardModule[]) : [];
    }
    return migrated;
  } catch {
    return {};
  }
};

/** True when carry-forward has already run (in this browser) for the given target academic year. */
export const isCarryForwardCompleted = (targetAcademicYearId: string): boolean =>
  (readCompletedMap()[targetAcademicYearId] ?? []).length > 0;

/** The modules actually carried forward (in this browser) for the given target academic year. */
export const getCarryForwardModules = (targetAcademicYearId: string): CarryForwardModule[] =>
  readCompletedMap()[targetAcademicYearId] ?? [];

/** Marks carry-forward as done for a target academic year — call right after carryForward() succeeds. */
export const markCarryForwardCompleted = (targetAcademicYearId: string, modules: CarryForwardModule[]): void => {
  const map = readCompletedMap();
  map[targetAcademicYearId] = modules;
  try {
    localStorage.setItem(CF_COMPLETED_STORAGE_KEY, JSON.stringify(map));
  } catch {
    // best-effort — if storage is unavailable, we just re-check every session
  }
};

/**
 * Whether there's anything worth carrying forward from `sourceAcademicYearId`.
 * Uses the working previewCarryForward endpoint instead of the missing status route.
 */
export const checkCarryForwardEligibility = async (sourceAcademicYearId: string): Promise<boolean> => {
  try {
    const res = await previewCarryForward({
      sourceAcademicYearId,
      modules: DEFAULT_CARRY_FORWARD_MODULES,
    });
    return Array.isArray(res?.data) && res.data.some((item) => (item.count ?? 0) > 0);
  } catch {
    // On error, never block the user with the wizard — assume nothing to carry forward.
    return false;
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
