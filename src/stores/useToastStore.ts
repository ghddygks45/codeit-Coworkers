import { create } from "zustand";

interface ToastState {
  isOpen: boolean;
  message: string;
  show: (message: string) => void;
  hide: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  isOpen: false,
  message: "",
  show: (message: string) => set({ isOpen: true, message }),
  hide: () => set({ isOpen: false, message: "" }),
}));
