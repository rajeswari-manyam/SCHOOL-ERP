import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchSchoolSettings, updateSchoolSettings } from "../api/settings.api";
import { UpdateSchoolSettingsInput } from "../types/settings.types";

export const useSchoolSettings = () => {
  return useQuery({
    queryKey: ["school-settings"],
    queryFn: fetchSchoolSettings,
  });
};

export const useUpdateSchoolSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSchoolSettings,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["school-settings"] }),
  });
};
