import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  isAuthenticated: boolean;
  identity: string | null;
  accessToken: string | null;
  kycStatus: string | null;
  kycTier: string | null;
  login: (identity: string, accessToken: string, kycStatus?: string | null, kycTier?: string | null) => void;
  logout: () => void;
  setAccessToken: (token: string) => void;
  setKyc: (kycStatus: string, kycTier: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      identity: null,
      accessToken: null,
      kycStatus: null,
      kycTier: null,
      login: (identity, accessToken, kycStatus?, kycTier?) =>
        set({ isAuthenticated: true, identity, accessToken, kycStatus: kycStatus ?? null, kycTier: kycTier ?? null }),
      logout: () =>
        set({ isAuthenticated: false, identity: null, accessToken: null, kycStatus: null, kycTier: null }),
      setAccessToken: (accessToken) => set({ accessToken }),
      setKyc: (kycStatus, kycTier) => set({ kycStatus, kycTier }),
    }),
    {
      name: "byreixwift-auth",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        identity: state.identity,
        accessToken: state.accessToken,
        kycStatus: state.kycStatus,
        kycTier: state.kycTier,
      }),
    }
  )
);
