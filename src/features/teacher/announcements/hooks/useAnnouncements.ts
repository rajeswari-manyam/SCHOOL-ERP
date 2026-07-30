import { useQuery } from "@tanstack/react-query";
import { schoolAnnouncementApi } from "@/services/school-announcement.api";

export const useAnnouncements = () =>
  useQuery({
    queryKey: ["teacher", "announcements", "staff"],
    queryFn: () => schoolAnnouncementApi.getAllAnnouncements("staff"),
    staleTime: 30_000,
  });
