import { create } from "zustand";

interface GnbState {
  isFolded: boolean;
  toggleFolded: () => void;
  setFolded: (folded: boolean) => void;
}

export const useGnbStore = create<GnbState>((set) => ({
  isFolded: true,
  toggleFolded: () => set((state) => ({ isFolded: !state.isFolded })),
  setFolded: (folded) => set({ isFolded: folded }),
}));
