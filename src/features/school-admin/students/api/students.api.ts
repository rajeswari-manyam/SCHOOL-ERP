// import { api } from "@/config/axios";
// import { StudentFormInput } from "../types/student.types";

// export const getStudents = async () => {
//   const { data } = await api.get("/school-admin/students");
//   return data;
// };

// export const getStudent = async (id: string) => {
//   const { data } = await api.get(`/school-admin/students/${id}`);
//   return data;
// };

// export const createStudent = async (input: StudentFormInput) => {
//   const { data } = await api.post("/school-admin/students", input);
//   return data;
// };

// export const updateStudent = async (id: string, input: StudentFormInput) => {
//   const { data } = await api.put(`/school-admin/students/${id}`, input);
//   return data;
// };

// export const deleteStudent = async (id: string) => {
//   const { data } = await api.delete(`/school-admin/students/${id}`);
//   return data;
// };

// export const importStudents = async (file: File) => {
//   const formData = new FormData();
//   formData.append("file", file);
//   const { data } = await api.post("/school-admin/students/import", formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });
//   return data;
// };
