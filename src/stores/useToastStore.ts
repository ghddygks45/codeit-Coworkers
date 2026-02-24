import { create } from "zustand";

interface ToastState {
  isOpen: boolean;
  message: string;
  type: "success" | "error";
  show: (message: string) => void;
  showError: (message: string) => void;
  hide: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  isOpen: false,
  message: "",
  type: "success",
  show: (message: string) => set({ isOpen: true, message, type: "success" }),
  showError: (message: string) => set({ isOpen: true, message, type: "error" }),
  hide: () => set({ isOpen: false, message: "", type: "success" }),
}));
