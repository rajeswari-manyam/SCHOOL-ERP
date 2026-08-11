import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { schoolAnnouncementApi } from "@/services/school-announcement.api";
import type { SchoolAnnouncementPayload } from "@/services/school-announcement.api";

export const ANNOUNCEMENTS_KEY = ["school-admin", "announcements"] as const;

export const useAnnouncements = () =>
  useQuery({
    queryKey: ANNOUNCEMENTS_KEY,
    queryFn: () => schoolAnnouncementApi.getAllAnnouncements(),
    staleTime: 30_000,
  });

export const useAnnouncementMutations = () => {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ANNOUNCEMENTS_KEY, refetchType: "all" });

  const createAnnouncement = useMutation({
    mutationFn: (payload: SchoolAnnouncementPayload) => schoolAnnouncementApi.createAnnouncement(payload),
    onSuccess: () => {
      invalidate();
      toast.success("Announcement published");
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Failed to publish announcement"),
  });

  const updateAnnouncement = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<SchoolAnnouncementPayload> }) =>
      schoolAnnouncementApi.updateAnnouncement(id, payload),
    onSuccess: () => {
      invalidate();
      toast.success("Announcement updated");
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Failed to update announcement"),
  });

  const deleteAnnouncement = useMutation({
    mutationFn: (id: string) => schoolAnnouncementApi.deleteAnnouncement(id),
    onSuccess: () => {
      invalidate();
      toast.success("Announcement deleted");
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Failed to delete announcement"),
  });

  return { createAnnouncement, updateAnnouncement, deleteAnnouncement };
};
