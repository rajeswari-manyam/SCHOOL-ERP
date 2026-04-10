// import { api } from "@/config/axios";
// import type{ Homework, CreateHomeworkInput, UpdateHomeworkInput } from "../types/homework.types";

// export const fetchHomework = async (): Promise<Homework[]> => {
//   const { data } = await api.get("/teacher/homework");
//   return data;
// };

// export const createHomework = async (input: CreateHomeworkInput): Promise<Homework> => {
//   const { data } = await api.post("/teacher/homework", input);
//   return data;
// };

// export const updateHomework = async (id: string, input: UpdateHomeworkInput): Promise<Homework> => {
//   const { data } = await api.put(`/teacher/homework/${id}` , input);
//   return data;
// };

// export const deleteHomework = async (id: string): Promise<void> => {
//   await api.delete(`/teacher/homework/${id}`);
// };
