import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { AxiosError } from "axios";
import { UserProfile } from "@/stores/auth-store";

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponseData {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  profile: UserProfile;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export function useRegisterMutation() {
  return useMutation<
    ApiResponse,
    AxiosError<{ message: string }>,
    RegisterPayload
  >({
    mutationFn: async (payload: RegisterPayload) => {
      const response = await apiClient.post<ApiResponse>(
        "/auth/register",
        payload,
      );
      return response.data;
    },
  });
}

export function useLoginMutation() {
  return useMutation<
    ApiResponse<LoginResponseData>,
    AxiosError<{ message: string; error?: { code: string } }>,
    LoginPayload
  >({
    mutationFn: async (payload: LoginPayload) => {
      const response = await apiClient.post<ApiResponse<LoginResponseData>>(
        "/auth/login",
        payload,
      );
      return response.data;
    },
  });
}
