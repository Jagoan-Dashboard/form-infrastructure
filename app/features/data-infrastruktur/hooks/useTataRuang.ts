import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import z from "zod";
import { useFormDataStore } from "~/store/formDataStore";
import { apiService } from "~/services/apiService";
import {
  institutionTataRuangToApi,
  areaCategoryToApi,
  violationTypeToApi,
  violationLevelToApi,
  environmentalImpactToApi,
  urgencyCategoryToApi
} from "~/utils/enumMapper";
import { tataRuangSchema } from "../validation/tataRuangValidation";
import { toast } from "sonner";

export function useTataRuang() {
  const navigate = useNavigate();
  const { getIndexData, clearAllData } = useFormDataStore();

  // Form states
  const [gambaranAreaLokasi, setGambaranAreaLokasi] = useState("");
  const [instansi, setInstansi] = useState("");
  const [kategoriKawasan, setKategoriKawasan] = useState("");
  const [jenisPelanggaran, setJenisPelanggaran] = useState("");
  const [tingkatPelanggaran, setTingkatPelanggaran] = useState("");
  const [dampakLingkungan, setDampakLingkungan] = useState("");
  const [tingkatUrgensi, setTingkatUrgensi] = useState("");
  const [fotoLokasi, setFotoLokasi] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debug: Clear any potentially corrupted localStorage on component mount
  useEffect(() => {
    const storedData = getIndexData();
  }, []);

  const validateForm = (latitude: string, longitude: string) => {
    try {
      tataRuangSchema.parse({
        latitude,
        longitude,
        gambaranAreaLokasi,
        instansi,
        kategoriKawasan,
        jenisPelanggaran,
        tingkatPelanggaran,
        dampakLingkungan,
        tingkatUrgensi,
        fotoLokasi,
      });

      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          if (err.path && err.path.length > 0) {
            const fieldName = err.path[0] as string;
            newErrors[fieldName] = err.message;
          }
        });
        setErrors(newErrors);
        return false;
      }
      return false;
    }
  };

  const handleSubmit = async (latitude: string, longitude: string) => {
    if (!validateForm(latitude, longitude)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const indexData = getIndexData();
      if (!indexData) {
        alert("Data tidak ditemukan. Silakan mulai dari halaman awal.");
        navigate("/");
        return;
      }

      const formatDateTime = (date: Date | null): string => {
        let dateObj: Date;

        if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
          dateObj = new Date();
        } else {
          dateObj = date;
        }

        const isoString = dateObj.toISOString();
        const withoutMilliseconds = isoString.replace(/\.\d{3}Z$/, "Z");

        return withoutMilliseconds;
      };

      const formattedDateTime = formatDateTime(indexData.tanggalLaporan);

      const apiData: any = {
        reporter_name: indexData.namaPelapor,
        institution: institutionTataRuangToApi(instansi),
        phone_number: indexData.nomorHP,
        report_datetime: formattedDateTime,
        area_description: gambaranAreaLokasi,
        area_category: areaCategoryToApi(kategoriKawasan),
        violation_type: violationTypeToApi(jenisPelanggaran),
        violation_level: violationLevelToApi(tingkatPelanggaran),
        environmental_impact: environmentalImpactToApi(dampakLingkungan),
        urgency_level: urgencyCategoryToApi(tingkatUrgensi),
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        address: indexData.desaKecamatan,
        photos: [],
        photoFiles: fotoLokasi,
      };

      const emptyFields = Object.entries(apiData)
        .filter(
          ([key, value]) =>
            value === "" || value === null || value === undefined
        )
        .map(([key]) => key);

      if (emptyFields.length > 0) {
        alert(`Field kosong ditemukan: ${emptyFields.join(", ")}`);
        return;
      }

      if (!apiData.report_datetime || apiData.report_datetime === "") {
        alert("Error: Tanggal laporan tidak valid");
        return;
      }

      const response = await apiService.submitSpatialPlanning(apiData);

      if (response.data.success) {
        clearAllData();
        localStorage.clear();
        toast.success("Data berhasil dikirim!");
        navigate("/success");
      } else {
        throw new Error(response.data.message || "Submission failed");
      }
    } catch (error: any) {
      let errorMessage = "Gagal mengirim data. ";
      if (error.response?.data?.message) {
        errorMessage += error.response.data.message;
      } else if (error.response?.data?.detail) {
        errorMessage += error.response.data.detail;
      } else if (error.response?.data) {
        errorMessage += JSON.stringify(error.response.data);
      } else if (error.message) {
        errorMessage += error.message;
      } else {
        errorMessage += "Silakan coba lagi.";
      }

      toast.error("Gagal mengirim data", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    // Form states
    gambaranAreaLokasi,
    setGambaranAreaLokasi,
    instansi,
    setInstansi,
    kategoriKawasan,
    setKategoriKawasan,
    jenisPelanggaran,
    setJenisPelanggaran,
    tingkatPelanggaran,
    setTingkatPelanggaran,
    dampakLingkungan,
    setDampakLingkungan,
    tingkatUrgensi,
    setTingkatUrgensi,
    fotoLokasi,
    setFotoLokasi,
    previewUrls,
    setPreviewUrls,
    errors,
    isSubmitting,
    // Functions
    handleSubmit,
  };
}
