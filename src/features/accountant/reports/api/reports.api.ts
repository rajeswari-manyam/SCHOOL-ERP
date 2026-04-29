import { axios } from "@/config/axios";
import type {
  Report,
  ReportCreateInput,
  ReportUpdateInput,
} from "../types/reports.types";

export const fetchReports = async (): Promise<Report[]> => {
  const { data } = await axios.get("/accountant/reports");
  return data;
};

export const createReport = async (
  input: ReportCreateInput,
): Promise<Report> => {
  const { data } = await axios.post("/accountant/reports", input);
  return data;
};

export const updateReport = async (
  id: string,
  input: ReportUpdateInput,
): Promise<Report> => {
  const { data } = await axios.put(`/accountant/reports/${id}`, input);
  return data;
};

export const deleteReport = async (id: string): Promise<void> => {
  await axios.delete(`/accountant/reports/${id}`);
};
