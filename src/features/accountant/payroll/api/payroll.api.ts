import { axios } from "@/config/axios";
import  type {
  Payroll,
  CreatePayrollInput,
  UpdatePayrollInput,


} from "../types/payroll.types";

export const fetchPayrolls = async (): Promise<Payroll[]> => {
  const { data } = await axios.get("/accountant/payroll");
  return data;
};

export const createPayroll = async (
  input: CreatePayrollInput,
): Promise<Payroll> => {
  const { data } = await axios.post("/accountant/payroll", input);
  return data;
};

export const updatePayroll = async (
  id: string,
  input: UpdatePayrollInput,
): Promise<Payroll> => {
  const { data } = await axios.put(`/accountant/payroll/${id}`, input);
  return data;
};

export const deletePayroll = async (id: string): Promise<void> => {
  await axios.delete(`/accountant/payroll/${id}`);
};
