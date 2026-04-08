import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAccountantSettings,
  updateAccountantSettings,
} from "../api/settings.api";
import { UpdateAccountantSettingsInput } from "../types/settings.types";

export const useAccountantSettings = () => {
  return useQuery({
    queryKey: ["accountant-settings"],
    queryFn: fetchAccountantSettings,
  });
};

export const useUpdateAccountantSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAccountantSettings,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["accountant-settings"] }),
  });
};
