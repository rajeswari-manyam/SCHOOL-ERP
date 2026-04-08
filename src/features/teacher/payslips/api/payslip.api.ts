import axios from "axios";
import type { Payslip, CreatePayslipInput, UpdatePayslipInput } from "../types/payslip.types";

export const fetchPayslips = async (): Promise<Payslip[]> => {
  const { data } = await axios.get("/teacher/payslips");
  return data;
};

export const fetchPayslip = async (id: string): Promise<Payslip> => {
  const { data } = await axios.get(`/teacher/payslips/${id}`);
  return data;
};

export const createPayslip = async (input: CreatePayslipInput): Promise<Payslip> => {
  const { data } = await axios.post("/teacher/payslips", input);
  return data;
};

export const updatePayslip = async ({ id, input }: { id: string; input: UpdatePayslipInput }): Promise<Payslip> => {
  const { data } = await axios.put(`/teacher/payslips/${id}`, input);
  return data;
};

export const deletePayslip = async (id: string): Promise<void> => {
  await axios.delete(`/teacher/payslips/${id}`);
};
