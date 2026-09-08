// src/features/events/types/event.types.ts
export interface EventItem {
  id: string;
  userId: string;
  name: string;
  organizer: string;
  description: string;
  eventDate: string;
  location: string;
  status: "draft" | "ongoing" | "completed";
  certificatesCount: number;
  createdAt: string;
}
