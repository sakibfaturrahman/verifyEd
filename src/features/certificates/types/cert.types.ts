export interface CertificateItem {
  id: string;
  certificateNumber: string;
  recipientName: string;
  eventName: string;
  organizer: string;
  fileHash: string;
  qrToken: string;
  status: "active" | "revoked";
  issuedAt: string;
  verificationCount: number;
}
