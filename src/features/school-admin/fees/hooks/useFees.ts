import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFees, markFeePaid } from "../api/fees.api";

export const useFees = () => {
  return useQuery({
    queryKey: ["fees"],
    queryFn: getFees,
    staleTime: 5 * 60 * 1000,
  });
};

export const useMarkFeePaid = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markFeePaid,
    onSuccess: () => {
      queryClient.invalidateQueries(["fees"]);
    },
  });
};
