import api from "@/config/axios";

export interface AcademicYearRecord {
  id: string;
  yearName: string;
  startDate: string;
  endDate: string;
  active: boolean;
}

export interface GetAllAcademicYearsResponse {
  status: boolean;
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
    if (data?.status && data?.data) {
      return data.data;
    }
    return null;
  } catch {
    return null;
  }
};
const FALLBACK_ACADEMIC_YEARS: AcademicYearRecord[] = [
  { id: "ay-2025-26", yearName: "2025-2026", startDate: "2025-06-01", endDate: "2026-05-31", active: true },
  { id: "ay-2024-25", yearName: "2024-2025", startDate: "2024-06-01", endDate: "2025-05-31", active: false },
];

export const getAllAcademicYears = async (): Promise<GetAllAcademicYearsResponse> => {
  try {
    const { data } = await api.get<GetAllAcademicYearsResponse>("/tenant/getallacademicyears");
    if (data?.status && Array.isArray(data?.data) && data.data.length > 0) {
      return data;
    }
  } catch {
    // fallback to local values when the backend is unavailable
  }

  return { status: true, data: FALLBACK_ACADEMIC_YEARS };
};