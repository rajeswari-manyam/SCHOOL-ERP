// src/services/studymaterial.api.ts

import api from "@/config/axios";

/* ================= TYPES ================= */

export interface StudyMaterialNestedRef {
  id: string;
  name: string;
}

export interface StudyMaterial {
  id: string;
  class: StudyMaterialNestedRef | null;
  section: StudyMaterialNestedRef | null;
  subject: StudyMaterialNestedRef | null;
  teacher: StudyMaterialNestedRef | null;
  title: string;
  description?: string;
  upload_date: string;
  upload_type: string;
  pdf: string | null;
  open_link?: string;
  download?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface StudyMaterialResponse {
  status: boolean;
  message?: string;
  data: StudyMaterial;
}

export interface StudyMaterialListResponse {
  status: boolean;
  count: number;
  data: StudyMaterial[];
}

export interface StudyMaterialFilterParams {
  class_id?: string;
  section_id?: string;
  teacher_id?: string;
}

/* ================= API CALLS ================= */

// CREATE Study Material
export const createStudyMaterial = async (
  formData: FormData
): Promise<StudyMaterialResponse> => {
  const { data } = await api.post<StudyMaterialResponse>(
    "/tenant/createstudymaterial",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data;
};

// GET ALL Study Materials
export const getAllStudyMaterials = async (): Promise<StudyMaterialListResponse> => {
  const { data } = await api.get<StudyMaterialListResponse>(
    "/tenant/getallstudymaterials"
  );
  return data;
};

// GET Study Material By ID
export const getStudyMaterialById = async (
  id: string
): Promise<StudyMaterialResponse> => {
  const { data } = await api.get<StudyMaterialResponse>(
    `/tenant/getstudymaterialById/${id}`
  );
  return data;
};

// GET Study Materials By Filter (class_id, section_id, teacher_id)
export const getStudyMaterialsByFilter = async (
  params: StudyMaterialFilterParams
): Promise<StudyMaterialListResponse> => {
  const { data } = await api.get<StudyMaterialListResponse>(
    "/tenant/getstudymaterialsbyfilter",
    { params }
  );
  return data;
};

// UPDATE Study Material
export const updateStudyMaterial = async (
  id: string,
  formData: FormData
): Promise<StudyMaterialResponse> => {
  const { data } = await api.put<StudyMaterialResponse>(
    `/tenant/updatestudymaterialById/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data;
};

// DELETE Study Material
export const deleteStudyMaterial = async (id: string): Promise<{ status: boolean; message: string }> => {
  const { data } = await api.delete(
    `/tenant/deletestudymaterialById/${id}`
  );
  return data;
};

// DOWNLOAD Study Material (returns file blob)
export const downloadStudyMaterial = async (id: string): Promise<Blob> => {
  const { data } = await api.get<Blob>(
    `/tenant/downloadstudymaterial/${id}`,
    { responseType: "blob" }
  );
  return data;
};
