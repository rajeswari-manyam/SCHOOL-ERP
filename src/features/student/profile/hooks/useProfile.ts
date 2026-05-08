import { useState, useCallback } from "react";
import type { Student } from "../types/profile.types";
import { STUDENT_DATA } from "../data/profile.mock";

// ─── useStudent ───────────────────────────────────────────────────────────────

export function useStudent(): {
  student: Student;
  loading: boolean;
  error: string | null;
} {
  const [student] = useState<Student>(STUDENT_DATA);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  return { student, loading, error };
}

// ─── useDownload ──────────────────────────────────────────────────────────────

export function useDownload(): {
  downloading: string | null;
  downloaded: string | null;
  handleDownload: (id: string, title: string) => void;
} {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloaded, setDownloaded]   = useState<string | null>(null);

  const handleDownload = useCallback((id: string, title: string) => {
    if (downloading) return;

    setDownloading(id);
    setDownloaded(null);

    // Simulated async download — replace with real API call
    setTimeout(() => {
      setDownloading(null);
      setDownloaded(id);
      console.info(`[Download] ${title}`);

      // Reset "done" state after 2.5 s
      setTimeout(() => setDownloaded(null), 2500);
    }, 1400);
  }, [downloading]);

  return { downloading, downloaded, handleDownload };
}