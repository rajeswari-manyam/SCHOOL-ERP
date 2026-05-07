import { useState, useCallback } from 'react';
import type { Student, NavItem } from "../types/profile.types";
import { STUDENT_DATA, NAV_ITEMS } from "../data/profile.mock";

// ─── useStudent ──────────────────────────────────────────────────────────────

export function useStudent() {
  const [student] = useState<Student>(STUDENT_DATA);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  return { student, loading, error };
}

// ─── useNavigation ───────────────────────────────────────────────────────────

export function useNavigation(initialActive = 'profile') {
  const [activeNav, setActiveNav] = useState<string>(initialActive);
  const navItems: NavItem[] = NAV_ITEMS;

  const navigate = useCallback((id: string) => {
    setActiveNav(id);
  }, []);

  return { navItems, activeNav, navigate };
}

// ─── useDownload ─────────────────────────────────────────────────────────────

export function useDownload() {
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = useCallback((id: string, title: string) => {
    setDownloading(id);
    // Simulate download delay
    setTimeout(() => {
      setDownloading(null);
      console.log(`Downloaded: ${title}`);
    }, 1500);
  }, []);

  return { downloading, handleDownload };
}

// ─── useNotifications ────────────────────────────────────────────────────────

export function useNotifications() {
  const [count] = useState(3);
  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => setOpen((prev) => !prev), []);

  return { count, open, toggle };
}