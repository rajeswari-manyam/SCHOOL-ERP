// import { axios } from "@/config/axios";
// import {
//   Staff,
//   StaffCreateInput,
//   StaffUpdateInput,
// } from "../types/staff.types";

// export const fetchStaff = async (): Promise<Staff[]> => {
//   const { data } = await axios.get("/staff");
//   return data;
// };

// export const createStaff = async (input: StaffCreateInput): Promise<Staff> => {
//   const { data } = await axios.post("/staff", input);
//   return data;
// };

// export const updateStaff = async (
//   id: string,
//   input: StaffUpdateInput,
// ): Promise<Staff> => {
//   const { data } = await axios.put(`/staff/${id}`, input);
//   return data;
// };

// export const deleteStaff = async (id: string): Promise<void> => {
//   await axios.delete(`/staff/${id}`);
// };
