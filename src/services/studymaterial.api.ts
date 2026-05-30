// src/features/studymaterial/api/studymaterial.api.ts

import api from "@/config/axios";

/* ================= TYPES ================= */

export interface StudyMaterial {
  id: string;
  class_id: string | null;
  className: string;
  section: string;
  subject_id: string | null;
  subjectName: string;
  pdf: string | null;
  upload_date: string;
  download: number;
  open_link: string;
  school_code: string;
  createdAt: string;
  updatedAt: string;
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

// GET Study Materials By Class Name
export const getStudyMaterialByClassName = async (
  className: string
): Promise<StudyMaterialListResponse> => {
  const { data } = await api.get<StudyMaterialListResponse>(
    `/tenant/getstudymaterialByClassName`,
    {
      params: { className },
    }
  );
  return data;
};