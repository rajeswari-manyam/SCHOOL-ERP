// import { api } from "@/config/axios";
// import type { TimetableEntry, CreateTimetableEntryInput, UpdateTimetableEntryInput } from "../types/timetable.types";

// export const fetchTimetable = async (): Promise<TimetableEntry[]> => {
//   const { data } = await api.get("/teacher/timetable");
//   return data;
// };

// export const createTimetableEntry = async (input: CreateTimetableEntryInput): Promise<TimetableEntry> => {
//   const { data } = await api.post("/teacher/timetable", input);
//   return data;
// };

// export const updateTimetableEntry = async (id: string, input: UpdateTimetableEntryInput): Promise<TimetableEntry> => {
//   const { data } = await api.put(`/teacher/timetable/${id}` , input);
//   return data;
// };

// export const deleteTimetableEntry = async (id: string): Promise<void> => {
//   await api.delete(`/teacher/timetable/${id}`);
// };
