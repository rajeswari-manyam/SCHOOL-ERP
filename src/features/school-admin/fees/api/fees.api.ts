import { api } from "@/config/axios";
import { MarkPaidInput } from "../types/fees.types";

export const getFees = async () => {
  const { data } = await api.get("/school-admin/fees");
  return data;
};

export const markFeePaid = async (input: MarkPaidInput) => {
  const { data } = await api.post("/school-admin/fees/mark-paid", input);
  return data;
};
