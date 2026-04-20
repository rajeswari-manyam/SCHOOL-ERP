import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "../api/profile.api";
import type { ProfileData, StudentProfile } from "../types/profile.types";

// Query keys
export const PROFILE_KEYS = {
  all: ["profile"] as const,
  profile: () => [...PROFILE_KEYS.all, "data"] as const,
};

// Get student profile
export const useProfile = () => {
  return useQuery({
    queryKey: PROFILE_KEYS.profile(),
    queryFn: profileApi.getProfile,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Update profile mutation
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: Partial<StudentProfile>) => profileApi.updateProfile(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.all });
    },
  });
};

// Download document hook
export const useDownloadDocument = () => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const download = async (documentId: string, fileName: string) => {
    setDownloadingId(documentId);
    try {
      const blob = await profileApi.downloadDocument(documentId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloadingId(null);
    }
  };

  return { download, downloadingId };
};