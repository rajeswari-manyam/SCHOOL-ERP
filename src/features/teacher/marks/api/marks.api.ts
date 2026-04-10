// import { api } from "@/config/axios";
// import type{ MarkEntry, CreateMarkEntryInput, UpdateMarkEntryInput } from "../types/marks.types";

// export const fetchMarks = async (): Promise<MarkEntry[]> => {
//   const { data } = await api.get("/teacher/marks");
//   return data;
// };

// export const createMarkEntry = async (input: CreateMarkEntryInput): Promise<MarkEntry> => {
//   const { data } = await api.post("/teacher/marks", input);
//   return data;
// };

// export const updateMarkEntry = async (id: string, input: UpdateMarkEntryInput): Promise<MarkEntry> => {
//   const { data } = await api.put(`/teacher/marks/${id}` , input);
//   return data;
// };

// export const deleteMarkEntry = async (id: string): Promise<void> => {
//   await api.delete(`/teacher/marks/${id}`);
// };
