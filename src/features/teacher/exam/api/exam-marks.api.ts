import type {
  ExamSelector,
  StudentMarkEntry,
  SubmittedExam,
  PublishedResult,
} from "../types/exam-marks.types";

// In a real app these would be axios/fetch calls to your backend
export const examMarksApi = {
  /** Load students for a given exam selector */
  loadStudents: async (selector: ExamSelector): Promise<StudentMarkEntry[]> => {
    // const res = await axios.get("/api/teacher/exams/students", { params: selector });
    // return res.data;
    void selector;
    return Promise.resolve([]);
  },

  /** Save draft marks (auto-save or manual) */
  saveDraft: async (
    selector: ExamSelector,
    entries: StudentMarkEntry[]
  ): Promise<void> => {
    // await axios.post("/api/teacher/exams/draft", { selector, entries });
    void selector; void entries;
  },

  /** Submit marks for review */
  submitMarks: async (
    selector: ExamSelector,
    entries: StudentMarkEntry[]
  ): Promise<void> => {
    // await axios.post("/api/teacher/exams/submit", { selector, entries });
    void selector; void entries;
  },

  /** Fetch all submitted exams for this teacher */
  getSubmittedExams: async (): Promise<SubmittedExam[]> => {
    // const res = await axios.get("/api/teacher/exams/submitted");
    // return res.data;
    return Promise.resolve([]);
  },

  /** Fetch published results */
  getPublishedResults: async (): Promise<PublishedResult[]> => {
    // const res = await axios.get("/api/teacher/exams/published");
    // return res.data;
    return Promise.resolve([]);
  },

  /** Download result report PDF */
  downloadReport: async (resultId: string): Promise<void> => {
    // const res = await axios.get(`/api/teacher/exams/published/${resultId}/pdf`, { responseType: "blob" });
    void resultId;
  },
};
