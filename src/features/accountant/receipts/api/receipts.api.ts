import { axios } from "@/config/axios";
import type {
  Receipt,
  CreateReceiptInput,
  UpdateReceiptInput,
} from "../types/receipts.types";

export const fetchReceipts = async (): Promise<Receipt[]> => {
  const { data } = await axios.get("/accountant/receipts");
  return data;
};

export const createReceipt = async (
  input: CreateReceiptInput,
): Promise<Receipt> => {
  const { data } = await axios.post("/accountant/receipts", input);
  return data;
};

export const updateReceipt = async (
  id: string,
  input: UpdateReceiptInput,
): Promise<Receipt> => {
  const { data } = await axios.put(`/accountant/receipts/${id}`, input);
  return data;
};

export const deleteReceipt = async (id: string): Promise<void> => {
  await axios.delete(`/accountant/receipts/${id}`);
};
