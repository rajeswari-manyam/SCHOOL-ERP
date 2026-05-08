import { create } from "zustand";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { STUDENT_DATA } from "../data/profile.mock";
import type { Student } from "../types/profile.types";

// ─── Zustand store for download UI state ─────────────────────────────────────
interface ProfileUIState {
  downloading: string | null;
  downloaded: string | null;
  setDownloading: (id: string | null) => void;
  setDownloaded: (id: string | null) => void;
}

export const useProfileStore = create<ProfileUIState>((set) => ({
  downloading: null,
  downloaded: null,
  setDownloading: (id) => set({ downloading: id }),
  setDownloaded: (id) => set({ downloaded: id }),
}));

// ─── TanStack Query fetch ─────────────────────────────────────────────────────
const fetchStudent = async (): Promise<Student> => {
  await new Promise((r) => setTimeout(r, 500));
  return STUDENT_DATA;
};

export const useStudent = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchStudent,
    staleTime: 10 * 60 * 1000,
  });

  return {
    student: data ?? null,
    loading: isLoading,
    error: isError ? "Failed to load profile." : null,
  };
};

// ─── Download hook ────────────────────────────────────────────────────────────
export const useDownload = () => {
  const { downloading, downloaded, setDownloading, setDownloaded } =
    useProfileStore();

  const handleDownload = async (id: string, fileName?: string) => {
    if (downloading) return;
    setDownloading(id);
    await new Promise((r) => setTimeout(r, 1200));
    setDownloading(null);
    setDownloaded(id);
    toast.success(`Downloaded: ${fileName ?? "document"}`, {
      description: "Your file is ready.",
    });
    setTimeout(() => setDownloaded(null), 3000);
  };

  return { downloading, downloaded, handleDownload };
};
