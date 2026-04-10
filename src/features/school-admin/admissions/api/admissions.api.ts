
// import type{ AdmissionFormInput } from "../types/admissions.types";

// export const getApplications = async () => {
//   const { data } = await api.get("/school-admin/admissions");
//   return data;
// };

// export const getApplication = async (id: string) => {
//   const { data } = await api.get(`/school-admin/admissions/${id}`);
//   return data;
// };

// export const createApplication = async (input: AdmissionFormInput) => {
//   const { data } = await api.post("/school-admin/admissions", input);
//   return data;
// };

// export const updateApplicationStatus = async (
//   id: string,
//   status: "approved" | "rejected",
//   remarks?: string,
// ) => {
//   const { data } = await api.patch(`/school-admin/admissions/${id}/status`, {
//     status,
//     remarks,
//   });
//   return data;
// };
