import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { AxiosError } from "axios";

export type VerificationStatus = "verified" | "revoked" | "not_found";

export interface PublicCertificate {
  certificateNumber: string;
  recipientName: string;
  event: string;
  organization: string;
  issuedAt: string;
  documentIntegrity: "valid" | "invalid" | "not_checked";
  revokedAt?: string;
  revokeReason?: string;
}

export interface VerificationResult {
  status: VerificationStatus;
  certificate?: PublicCertificate;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// 1. Verifikasi dengan Nomor Sertifikat
export function useVerifyByNumberMutation() {
  return useMutation<
    VerificationResult,
    AxiosError<{ message: string }>,
    string
  >({
    mutationFn: async (certificateNumber: string) => {
      const res = await apiClient.get<ApiResponse<VerificationResult>>(
        `/verify/certificate/${encodeURIComponent(certificateNumber.trim())}`,
      );
      return res.data.data;
    },
  });
}

// 2. Verifikasi dengan QR Token
export function useVerifyByQrTokenMutation() {
  return useMutation<
    VerificationResult,
    AxiosError<{ message: string }>,
    string
  >({
    mutationFn: async (qrToken: string) => {
      const res = await apiClient.get<ApiResponse<VerificationResult>>(
        `/verify/qr/${encodeURIComponent(qrToken.trim())}`,
      );
      return res.data.data;
    },
  });
}

// 3. Verifikasi dengan Unggah PDF Asli (Uji SHA-256)
export function useVerifyByPdfMutation() {
  return useMutation<VerificationResult, AxiosError<{ message: string }>, File>(
    {
      mutationFn: async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        const res = await apiClient.post<ApiResponse<VerificationResult>>(
          "/verify/pdf",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );
        return res.data.data;
      },
    },
  );
}
