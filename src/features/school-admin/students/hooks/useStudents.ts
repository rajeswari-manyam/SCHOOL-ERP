import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  importStudents,
} from "../api/students.api";

export const useStudents = () => {
  return useQuery({
    queryKey: ["students"],
    queryFn: getStudents,
    staleTime: 5 * 60 * 1000,
  });
};

export const useStudent = (id: string) => {
  return useQuery({
    queryKey: ["student", id],
    queryFn: () => getStudent(id),
    enabled: !!id,
  });
};

export const useCreateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createStudent,
    onSuccess: () => {
      queryClient.invalidateQueries(["students"]);
    },
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: any }) =>
      updateStudent(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries(["students"]);
    },
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries(["students"]);
    },
  });
};

export const useImportStudents = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: importStudents,
    onSuccess: () => {
      queryClient.invalidateQueries(["students"]);
    },
  });
};
