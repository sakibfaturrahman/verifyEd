// src/features/statistics/types/stats.types.ts
export interface VerificationLogItem {
  id: string;
  certificateId: string;
  certificateNumber: string;
  recipientName: string;
  eventName: string;
  method: "qr" | "pdf" | "certificate_id";
  result: "verified" | "revoked" | "not_found";
  createdAt: string;
  ipAddress?: string;
}

export interface PlatformMetrics {
  totalUsers: number;
  totalEvents: number;
  totalCertificates: number;
  totalVerifications: number;
  activeCertificates: number;
  revokedCertificates: number;
}
