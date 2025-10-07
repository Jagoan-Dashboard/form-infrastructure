import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useFormDataStore } from "~/store/formDataStore";
import { toast } from "sonner";

/**
 * Middleware component to check if IndexView data exists
 * Redirects to home page if data is not filled
 */
export function useCheckIndexData() {
  const navigate = useNavigate();
  const { getIndexData } = useFormDataStore();

  useEffect(() => {
    const indexData = getIndexData();

    // Check if all required fields from IndexView are filled
    if (
      !indexData ||
      !indexData.latitude ||
      !indexData.longitude ||
      !indexData.namaPelapor ||
      !indexData.nomorHP ||
      !indexData.peranPelapor ||
      !indexData.tanggalLaporan ||
      !indexData.desaKecamatan
    ) {
      // Show toast notification
      toast.warning("Silakan isi data pelapor terlebih dahulu", {
        description: "Anda harus mengisi data pelapor sebelum dapat mengakses form infrastruktur",
      });

      // Redirect to home page if data is incomplete
      navigate("/", { replace: true });
    }
  }, [navigate, getIndexData]);
}
