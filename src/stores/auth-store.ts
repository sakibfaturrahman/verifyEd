// src/stores/auth-store.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  status: "active" | "inactive";
  phone?: string | null;
  address?: string | null;
  description?: string | null;
  avatarUrl?: string | null;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
  setAuth: (payload: {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
    user: UserProfile;
  }) => void;
  setTokens: (payload: {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
  }) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
      user: null,
      isAuthenticated: false,

      setAuth: ({ accessToken, refreshToken, expiresAt, user }) =>
        set({
          accessToken,
          refreshToken,
          expiresAt,
          user,
          isAuthenticated: true,
        }),

      setTokens: ({ accessToken, refreshToken, expiresAt }) =>
        set((state) => ({
          accessToken,
          refreshToken,
          expiresAt,
          isAuthenticated: true,
        })),

      clearAuth: () =>
        set({
          accessToken: null,
          refreshToken: null,
          expiresAt: null,
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "verifyed-auth-session",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
