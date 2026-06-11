import axios from "@/config/axios";
import type {
  TeacherTimetableData,
  TeacherTimetableQuery,
  UpcomingExam,
  ExamsTimetableQuery,
} from "../types/timetable.types";

export const timetableApi = {
  getTeacherTimetable: async (
    params: TeacherTimetableQuery,
  ): Promise<TeacherTimetableData> => {
    const { data } = await axios.get<TeacherTimetableData>(
      "/teacher/timetable",
      { params },
    );
    return data;
  },

  getExamsTimetable: async (
    params: ExamsTimetableQuery,
  ): Promise<UpcomingExam[]> => {
    const { data } = await axios.get<UpcomingExam[]>(
      "/teacher/timetable/exams",
      { params },
    );
    return data;
  },
};
