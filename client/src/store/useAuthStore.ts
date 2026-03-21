import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  isAuthenticated: boolean;
  identity: string | null;
  login: (email: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      identity: null,
      login: (identity) => set({ isAuthenticated: true, identity }),
      logout: () => set({ isAuthenticated: false, identity: null }),
    }),
    {
      name: "byreixwift-auth",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        identity: state.identity,
      }),
    },
  ),
);
