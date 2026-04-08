import { axios } from "@/config/axios";
import {
  TimetableEntry,
  TimetableCreateInput,
  TimetableUpdateInput,
} from "../types/timetable.types";

export const fetchTimetable = async (): Promise<TimetableEntry[]> => {
  const { data } = await axios.get("/timetable");
  return data;
};

export const createTimetableEntry = async (
  input: TimetableCreateInput,
): Promise<TimetableEntry> => {
  const { data } = await axios.post("/timetable", input);
  return data;
};

export const updateTimetableEntry = async (
  id: string,
  input: TimetableUpdateInput,
): Promise<TimetableEntry> => {
  const { data } = await axios.put(`/timetable/${id}`, input);
  return data;
};

export const deleteTimetableEntry = async (id: string): Promise<void> => {
  await axios.delete(`/timetable/${id}`);
};
