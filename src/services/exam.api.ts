import api from "@/config/axios";

// ── Types ────────────────────────────────────────────────────────────────────
export interface ExamRecord {
  id: string;
  exam_name: string;
  academicYearId: string;
  createdAt: string;
  updatedAt?: string;
  // Nested object returned by GET /tenant/getallexams
  academicYear?: {
    id: string;
    yearName: string;
  } | null;
}

export interface ExamPayload {
  exam_name: string;
  academicYearId: string;
}

// ── Endpoint constants (confirmed from Postman) ───────────────────────────────
const EP = {
  getAll: "/tenant/getallexams",   // GET  — list all exams
  getOne: "/tenant/getexam",       // GET  /:id
  create: "/tenant/createexam",    // POST — confirmed ✓
  update: "/tenant/updateexam",    // PUT  /:id
  remove: "/tenant/deleteexam",    // DELETE /:id
} as const;

// ── Helpers ──────────────────────────────────────────────────────────────────
const extractList = (res: unknown): ExamRecord[] => {
  const r = res as Record<string, unknown>;
  for (const key of ["data", "exams", "result", "records", "examNames"]) {
    if (Array.isArray(r[key])) return r[key] as ExamRecord[];
  }
  if (Array.isArray(res)) return res as ExamRecord[];
  return [];
};

// ── API calls ────────────────────────────────────────────────────────────────

/** GET all exams */
export const getAllExams = async (): Promise<ExamRecord[]> => {
  const res = await api.get(EP.getAll);
  return extractList(res.data);
};

/** GET single exam by ID */
export const getExamById = async (id: string): Promise<ExamRecord> => {
  const res = await api.get(`${EP.getOne}/${id}`);
  return (res.data?.data ?? res.data) as ExamRecord;
};

/** POST create exam */
export const createExam = async (payload: ExamPayload): Promise<ExamRecord> => {
  const res = await api.post(EP.create, payload);
  return (res.data?.data ?? res.data) as ExamRecord;
};

/** PUT update exam */
export const updateExam = async (
  id: string,
  payload: Partial<ExamPayload>
): Promise<ExamRecord> => {
  const res = await api.put(`${EP.update}/${id}`, payload);
  return (res.data?.data ?? res.data) as ExamRecord;
};

/** DELETE exam */
export const deleteExam = async (id: string): Promise<void> => {
  await api.delete(`${EP.remove}/${id}`);
};