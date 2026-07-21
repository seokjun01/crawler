import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  login: (userInfo) => set({ user: userInfo }),
  logout: () => set({ user: null }),
}));
