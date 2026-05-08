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


interface UIState {
  sidebarOpen: boolean;
  collapsed: boolean;              // desktop: icon-rail vs full
  theme: "light" | "dark";
  setSidebarOpen: (v: boolean) => void;
  setCollapsed: (v: boolean | ((prev: boolean) => boolean)) => void;
  setTheme: (theme: "light" | "dark") => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  collapsed: false,
  theme: "light",
  setSidebarOpen: (v) => set({ sidebarOpen: v }),
  setCollapsed: (v) =>
    set((s) => ({ collapsed: typeof v === "function" ? v(s.collapsed) : v })),
  setTheme: (theme) => set({ theme }),
}));