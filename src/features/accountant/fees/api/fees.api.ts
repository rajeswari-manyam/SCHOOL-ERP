import { axios } from "@/config/axios";
import type { Fee, FeeCreateInput, FeeUpdateInput } from "../types/fees.types";

export const fetchFees = async (): Promise<Fee[]> => {
  const { data } = await axios.get("/accountant/fees");
  return data;
};

export const createFee = async (input: FeeCreateInput): Promise<Fee> => {
  const { data } = await axios.post("/accountant/fees", input);
  return data;
};

export const updateFee = async (
  id: string,
  input: FeeUpdateInput,
): Promise<Fee> => {
  const { data } = await axios.put(`/accountant/fees/${id}`, input);
  return data;
};

export const deleteFee = async (id: string): Promise<void> => {
  await axios.delete(`/accountant/fees/${id}`);
};
