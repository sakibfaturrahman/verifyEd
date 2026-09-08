// src/features/users/types/user.types.ts
export interface UserOrganizationItem {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  description?: string;
  role: "admin" | "user";
  status: "active" | "inactive";
  totalEvents: number;
  totalCertificates: number;
  createdAt: string;
}
