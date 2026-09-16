import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { VerificationResult } from "../hooks/use-verification";

interface VerificationStoreState {
  result: VerificationResult | null;
  scannedMethod: "id" | "qr" | "pdf";
  setVerificationResult: (
    result: VerificationResult,
    method: "id" | "qr" | "pdf",
  ) => void;
  clearResult: () => void;
}

export const useVerificationStore = create<VerificationStoreState>()(
  persist(
    (set) => ({
      result: null,
      scannedMethod: "id",
      setVerificationResult: (result, scannedMethod) =>
        set({ result, scannedMethod }),
      clearResult: () => set({ result: null }),
    }),
    {
      name: "verifyed-verification-result",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
