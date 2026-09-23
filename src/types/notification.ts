export type NotificationSeverity = "high" | "medium" | "low";

export type NotificationType =
  | "tampered_document"
  | "suspicious_activity"
  | "revoked_access"
  | "bulk_issuance"
  | "bulk_revoke"
  | "new_registration"
  | "welcome"
  | "certificate_issued"
  | "bulk_upload_completed"
  | "certificate_revoked"
  | "processing_failed";

export interface AppNotification {
  id: string;
  user_id: string | null;
  recipient_role: "admin" | "user" | "all";
  title: string;
  message: string;
  type: NotificationType;
  severity: NotificationSeverity;
  is_read: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface NotificationResponse {
  data: AppNotification[];
  total: number;
  unreadCount: number;
}
