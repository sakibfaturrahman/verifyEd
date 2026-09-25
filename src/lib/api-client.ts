import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/stores/auth-store";

// Di localhost, gunakan proxy internal Next.js agar browser tidak terkena CORS
const isDevelopment = process.env.NODE_ENV === "development";

const API_BASE_URL = "/api/backend";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

/**
 * Mencari access token dari Zustand store atau memeriksa seluruh kemungkinan
 * key localStorage (auth-storage, auth, token, dsb.) secara otomatis.
 */
function getActiveAccessToken(): string | null {
  // 1. Cek dari Zustand in-memory state
  try {
    const state = useAuthStore.getState() as unknown as Record<string, unknown>;
    if (state) {
      if (typeof state.accessToken === "string" && state.accessToken) {
        return state.accessToken;
      }
      if (typeof state.token === "string" && state.token) {
        return state.token;
      }
      const session = state.session as Record<string, unknown> | undefined;
      if (
        session &&
        typeof session.accessToken === "string" &&
        session.accessToken
      ) {
        return session.accessToken;
      }
    }
  } catch {}

  // 2. Fallback: Pindai LocalStorage jika state memory kosong
  if (typeof window !== "undefined") {
    const possibleKeys = [
      "auth-storage",
      "auth",
      "verifyed-auth",
      "token",
      "accessToken",
      "access_token",
    ];

    for (const key of possibleKeys) {
      const raw = localStorage.getItem(key);
      if (!raw) continue;

      if (raw.startsWith("eyJ")) {
        return raw.replace(/"/g, "").trim();
      }

      try {
        const parsed = JSON.parse(raw);
        const target = parsed?.state ?? parsed;

        if (target?.accessToken) return target.accessToken;
        if (target?.token) return target.token;
        if (target?.session?.accessToken) return target.session.accessToken;
      } catch {}
    }

    // 3. Fallback scan string token JWT di localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const storageKey = localStorage.key(i);
      if (!storageKey) continue;
      const val = localStorage.getItem(storageKey);
      if (val && val.includes("eyJ")) {
        try {
          const parsed = JSON.parse(val);
          const candidate =
            parsed?.state?.accessToken ||
            parsed?.state?.token ||
            parsed?.state?.session?.accessToken;
          if (candidate) return candidate;
        } catch {}
      }
    }
  }

  return null;
}

/**
 * Mencari refresh token dengan fallback serupa.
 */
function getActiveRefreshToken(): string | null {
  try {
    const state = useAuthStore.getState() as unknown as Record<string, unknown>;
    if (state?.refreshToken && typeof state.refreshToken === "string") {
      return state.refreshToken;
    }
    const session = state?.session as Record<string, unknown> | undefined;
    if (session?.refreshToken && typeof session.refreshToken === "string") {
      return session.refreshToken;
    }
  } catch {}

  if (typeof window !== "undefined") {
    const possibleKeys = ["auth-storage", "auth", "verifyed-auth"];
    for (const key of possibleKeys) {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      try {
        const parsed = JSON.parse(raw);
        const target = parsed?.state ?? parsed;
        if (target?.refreshToken) return target.refreshToken;
        if (target?.session?.refreshToken) return target.session.refreshToken;
      } catch {}
    }
  }

  return null;
}

// Request Interceptor: Menyematkan Bearer token & menangani FormData
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getActiveAccessToken();

    if (token) {
      if (config.headers.set) {
        config.headers.set("Authorization", `Bearer ${token}`);
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Tangani boundary FormData
    if (config.data instanceof FormData) {
      if (config.headers.delete) {
        config.headers.delete("Content-Type");
      } else {
        delete config.headers["Content-Type"];
      }
    } else {
      if (config.headers.set) {
        if (!config.headers.get("Content-Type")) {
          config.headers.set("Content-Type", "application/json");
        }
      } else if (!config.headers["Content-Type"]) {
        config.headers["Content-Type"] = "application/json";
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor: Menangani Refresh Token saat 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const isAuthRoute =
      originalRequest?.url?.includes("/auth/refresh") ||
      originalRequest?.url?.includes("/auth/login");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthRoute
    ) {
      originalRequest._retry = true;
      const refreshToken = getActiveRefreshToken();

      if (refreshToken) {
        try {
          const res = await axios.post(
            `${API_BASE_URL}/auth/refresh`,
            { refreshToken },
            { withCredentials: true },
          );

          const {
            accessToken,
            refreshToken: newRefresh,
            expiresAt,
          } = res.data.data;

          const store = useAuthStore.getState() as unknown as Record<
            string,
            unknown
          >;
          if (typeof store.setTokens === "function") {
            (
              store.setTokens as (tokens: {
                accessToken: string;
                refreshToken: string;
                expiresAt: number;
              }) => void
            )({
              accessToken,
              refreshToken: newRefresh,
              expiresAt,
            });
          }

          if (originalRequest.headers.set) {
            originalRequest.headers.set(
              "Authorization",
              `Bearer ${accessToken}`,
            );
          } else {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }

          return apiClient(originalRequest);
        } catch (refreshErr) {
          const store = useAuthStore.getState() as unknown as Record<
            string,
            unknown
          >;
          if (typeof store.clearAuth === "function") {
            (store.clearAuth as () => void)();
          }
          if (
            typeof window !== "undefined" &&
            !window.location.pathname.startsWith("/login")
          ) {
            window.location.href = "/login";
          }
          return Promise.reject(refreshErr);
        }
      } else {
        const store = useAuthStore.getState() as unknown as Record<
          string,
          unknown
        >;
        if (typeof store.clearAuth === "function") {
          (store.clearAuth as () => void)();
        }
      }
    }

    return Promise.reject(error);
  },
);
