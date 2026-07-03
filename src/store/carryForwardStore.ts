import { create } from "zustand";

interface CarryForwardState {
  checked: boolean;
  complete: boolean;
  setStatus: (complete: boolean) => void;
  reset: () => void;
}

// Session-only store (no persist) — re-checks on every page refresh.
export const useCarryForwardStore = create<CarryForwardState>((set) => ({
  checked: false,
  complete: false,
  setStatus: (complete) => set({ checked: true, complete }),
  reset: () => set({ checked: false, complete: false }),
}));
