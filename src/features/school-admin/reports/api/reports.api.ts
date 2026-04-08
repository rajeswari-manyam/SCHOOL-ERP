import { axios } from "@/config/axios";
import {
  Report,
  ReportCreateInput,
  ReportUpdateInput,
} from "../types/reports.types";

export const fetchReports = async (): Promise<Report[]> => {
  const { data } = await axios.get("/reports");
  return data;
};

export const createReport = async (
  input: ReportCreateInput,
): Promise<Report> => {
  const { data } = await axios.post("/reports", input);
  return data;
};

export const updateReport = async (
  id: string,
  input: ReportUpdateInput,
): Promise<Report> => {
  const { data } = await axios.put(`/reports/${id}`, input);
  return data;
};

export const deleteReport = async (id: string): Promise<void> => {
  await axios.delete(`/reports/${id}`);
};
