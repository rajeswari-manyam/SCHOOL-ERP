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
