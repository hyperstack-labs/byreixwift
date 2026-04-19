import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  isAuthenticated: boolean;
  identity: string | null;
  accessToken: string | null;
  login: (identity: string, accessToken: string) => void;
  logout: () => void;
  setAccessToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      identity: null,
      accessToken: null,
      login: (identity, accessToken) => set({ isAuthenticated: true, identity, accessToken }),
      logout: () => set({ isAuthenticated: false, identity: null, accessToken: null }),
      setAccessToken: (accessToken) => set({ accessToken }),
    }),
    {
      name: "byreixwift-auth",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        identity: state.identity,
        accessToken: state.accessToken,
      }),
    }
  )
);
