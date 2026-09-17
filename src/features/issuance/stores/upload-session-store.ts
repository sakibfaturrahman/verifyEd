import { create } from "zustand";

interface UploadSessionState {
  eventId: string;
  uploadType: "single" | "bulk";
  previewFile: File | null;
  files: File[];
  recipientNames: string[];
  setSessionData: (data: {
    eventId: string;
    uploadType: "single" | "bulk";
    files: File[];
    recipientNames: string[];
  }) => void;
  clearSession: () => void;
}

export const useUploadSessionStore = create<UploadSessionState>((set) => ({
  eventId: "",
  uploadType: "single",
  previewFile: null,
  files: [],
  recipientNames: [],
  setSessionData: (data) =>
    set({
      eventId: data.eventId,
      uploadType: data.uploadType,
      previewFile: data.files[0] || null,
      files: data.files,
      recipientNames: data.recipientNames,
    }),
  clearSession: () =>
    set({
      eventId: "",
      uploadType: "single",
      previewFile: null,
      files: [],
      recipientNames: [],
    }),
}));
