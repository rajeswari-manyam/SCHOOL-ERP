// import { create } from "zustand";
// import { persist } from "zustand/middleware";

// interface UIState {
//   sidebarOpen: boolean;
//   theme: "light" | "dark";
//   setSidebarOpen: (open: boolean) => void;
//   setTheme: (theme: "light" | "dark") => void;
// }

// export const useUIStore = create<UIState>()(
//   persist(
//     (set) => ({
//       sidebarOpen: true,
//       theme: "light",
//       setSidebarOpen: (open) => set({ sidebarOpen: open }),
//       setTheme: (theme) => set({ theme }),
//     }),
//     { name: "ui-store" },
//   ),
// );


// src/store/uiStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";


interface UIState {
  sidebarOpen: boolean;
  collapsed: boolean;              // desktop: icon-rail vs full
  theme: "light" | "dark";
  academicYearId: string | null;   // selected academic year ID (persisted)
  academicYearName: string | null; // selected academic year display name (persisted)
  pageTitle: string | null;        // dynamic title for nested pages (e.g. student name)
  wizardDismissed: boolean;        // user explicitly skipped the setup wizard (persisted)
  setSidebarOpen: (v: boolean) => void;
  setCollapsed: (v: boolean | ((prev: boolean) => boolean)) => void;
  setTheme: (theme: "light" | "dark") => void;
  setAcademicYearId: (id: string | null) => void;
  setAcademicYearName: (name: string | null) => void;
  setPageTitle: (title: string | null) => void;
  setWizardDismissed: (v: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      collapsed: false,
      theme: "light",
      academicYearId: null,
      academicYearName: null,
      pageTitle: null,
      wizardDismissed: false,
      setSidebarOpen: (v) => set({ sidebarOpen: v }),
      setCollapsed: (v) =>
        set((s) => ({ collapsed: typeof v === "function" ? v(s.collapsed) : v })),
      setTheme: (theme) => set({ theme }),
      setAcademicYearId: (id) => set({ academicYearId: id }),
      setAcademicYearName: (name) => set({ academicYearName: name }),
      setPageTitle: (title) => set({ pageTitle: title }),
      setWizardDismissed: (v) => set({ wizardDismissed: v }),
    }),
    {
      name: "ui-store",
      partialize: (state) => ({
        academicYearId:   state.academicYearId,
        academicYearName: state.academicYearName,
        wizardDismissed:  state.wizardDismissed,
      }),
    }
  )
);