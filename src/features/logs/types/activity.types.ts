// src/features/logs/types/activity.types.ts
export type ActivityAction =
  | "VERIFICATION_SUCCESS"
  | "VERIFICATION_REVOKED"
  | "VERIFICATION_NOT_FOUND"
  | "CERTIFICATE_ISSUED"
  | "CERTIFICATE_REVOKED"
  | "EVENT_CREATED"
  | "USER_SUSPENDED";

export interface ActivityLogItem {
  id: string;
  actor: {
    name: string;
    role: string;
    avatar?: string;
  };
  action: ActivityAction;
  target: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}
