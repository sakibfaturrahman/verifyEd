import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";

export function useDeleteCertificateMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (certificateId: string) => {
      const res = await apiClient.delete(`/certificates/${certificateId}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Sertifikat berhasil dihapus", {
        description:
          "Dokumen dan berkas fisik telah dibersihkan dari penyimpanan.",
      });
      // Refresh daftar sertifikat
      queryClient.invalidateQueries({ queryKey: ["certificates"] });
      queryClient.invalidateQueries({ queryKey: ["user-dashboard"] });
    },
    onError: (err: any) => {
      toast.error("Gagal menghapus sertifikat", {
        description:
          err.response?.data?.message || "Terjadi kendala pada server.",
      });
    },
  });
}
