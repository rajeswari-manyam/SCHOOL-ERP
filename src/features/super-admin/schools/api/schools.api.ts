import axios from "axios";
import { School, CreateSchoolInput, UpdateSchoolInput, SchoolFilters } from "../types/school.types";

export const fetchSchools = async (filters?: SchoolFilters): Promise<School[]> => {
  const { data } = await axios.get("/super-admin/schools", { params: filters });
  return data;
};

export const fetchSchool = async (id: string): Promise<School> => {
  const { data } = await axios.get(`/super-admin/schools/${id}`);
  return data;
};

export const createSchool = async (input: CreateSchoolInput): Promise<School> => {
  const { data } = await axios.post("/super-admin/schools", input);
  return data;
};

export const updateSchool = async ({ id, input }: { id: string; input: UpdateSchoolInput }): Promise<School> => {
  const { data } = await axios.put(`/super-admin/schools/${id}`, input);
  return data;
};

export const suspendSchool = async (id: string): Promise<School> => {
  const { data } = await axios.post(`/super-admin/schools/${id}/suspend`);
  return data;
};

export const activateSchool = async (id: string): Promise<School> => {
  const { data } = await axios.post(`/super-admin/schools/${id}/activate`);
  return data;
};

export const deleteSchool = async (id: string): Promise<void> => {
  await axios.delete(`/super-admin/schools/${id}`);
};
