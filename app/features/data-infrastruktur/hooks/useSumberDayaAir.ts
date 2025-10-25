import { useState } from "react";
import { useNavigate } from "react-router";
import z from "zod";
import { useFormDataStore } from "~/store/formDataStore";
import { apiService } from "~/services/apiService";
import type { SumberDayaAirForm } from "~/types/formData";
import {
  institutionSumberDayaAirToApi,
  irrigationTypeToApi,
  waterDamageTypeToApi,
  damageLevelToApi,
  urgencyCategoryToApi
} from "~/utils/enumMapper";
import { sumberDayaAirSchema } from "../validation/sumberDayaAirValidation";
import { toast } from "sonner";

export function useSumberDayaAir() {
  const navigate = useNavigate();
  const { indexData } = useFormDataStore();

  // Form states
  const [namaDaerahIrigasi, setNamaDaerahIrigasi] = useState("");
  const [jenisIrigasi, setJenisIrigasi] = useState("");
  const [institusi, setInstitusi] = useState("");
  const [jenisKerusakan, setJenisKerusakan] = useState("");
  const [tingkatKerusakan, setTingkatKerusakan] = useState("");
  const [perkiraanPanjangKerusakan, setPerkiraanPanjangKerusakan] = useState("");
  const [perkiraanLebarKerusakan, setPerkiraanLebarKerusakan] = useState("");
  const [perkiraanLuasKerusakan, setPerkiraanLuasKerusakan] = useState("");
  const [perkiraanVolumeKerusakan, setPerkiraanVolumeKerusakan] = useState("");
  const [areaSawahTerdampak, setAreaSawahTerdampak] = useState("");
  const [perkiraanKedalamanKerusakan, setPerkiraanKedalamanKerusakan] = useState("");
  const [jumlahPetaniTerdampak, setJumlahPetaniTerdampak] = useState("");
  const [kategoriUrgensi, setKategoriUrgensi] = useState("");
  const [fotoKerusakan, setFotoKerusakan] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validateForm = (latitude: string, longitude: string) => {
    try {
      sumberDayaAirSchema.parse({
        latitude,
        longitude,
        namaDaerahIrigasi,
        jenisIrigasi,
        institusi,
        jenisKerusakan,
        tingkatKerusakan,
        perkiraanPanjangKerusakan,
        perkiraanLebarKerusakan,
        perkiraanKedalamanKerusakan,
        perkiraanLuasKerusakan,
        perkiraanVolumeKerusakan,
        areaSawahTerdampak,
        jumlahPetaniTerdampak,
        kategoriUrgensi,
        fotoKerusakan,
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

  const mapFormToApiData = (latitude: string, longitude: string): SumberDayaAirForm & { photoFiles?: File[] } => {
    return {
      reporter_name: indexData?.namaPelapor || "Default Reporter",
      institution_unit: institutionSumberDayaAirToApi(institusi),
      phone_number: indexData?.nomorHP || "000000000000",
      report_datetime:
        (indexData?.tanggalLaporan instanceof Date
          ? indexData.tanggalLaporan.toISOString()
          : new Date().toISOString()),

      irrigation_area_name: namaDaerahIrigasi,
      irrigation_type: irrigationTypeToApi(jenisIrigasi),
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),

      damage_type: waterDamageTypeToApi(jenisKerusakan),
      damage_level: damageLevelToApi(tingkatKerusakan),
      estimated_length: parseFloat(perkiraanPanjangKerusakan) || 0,
      estimated_width: parseFloat(perkiraanLebarKerusakan) || 0,
      estimated_depth: parseFloat(perkiraanKedalamanKerusakan) || 0,
      estimated_area: parseFloat(perkiraanLuasKerusakan) || 0,
      estimated_volume: parseFloat(perkiraanVolumeKerusakan) || 0,

      affected_rice_field_area: parseFloat(areaSawahTerdampak) || 0,
      affected_farmers_count: parseInt(jumlahPetaniTerdampak) || 0,
      urgency_category: urgencyCategoryToApi(kategoriUrgensi),

      photos: previewUrls,
      photoFiles: fotoKerusakan,
    };
  };

  const handleSubmit = async (latitude: string, longitude: string) => {
    if (!validateForm(latitude, longitude)) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const apiData = mapFormToApiData(latitude, longitude);
      const response = await apiService.submitWaterResources(apiData);

      if (response.data.success) {
        toast.success("Data berhasil dikirim!");
        localStorage.clear();
        navigate("/success");
      } else {
        throw new Error(response.data.message || "Submission failed");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Terjadi kesalahan saat mengirim data";
      toast.error("Gagal mengirim data", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    // Form states
    namaDaerahIrigasi,
    setNamaDaerahIrigasi,
    jenisIrigasi,
    setJenisIrigasi,
    institusi,
    setInstitusi,
    jenisKerusakan,
    setJenisKerusakan,
    tingkatKerusakan,
    setTingkatKerusakan,
    perkiraanPanjangKerusakan,
    setPerkiraanPanjangKerusakan,
    perkiraanLebarKerusakan,
    setPerkiraanLebarKerusakan,
    perkiraanLuasKerusakan,
    setPerkiraanLuasKerusakan,
    perkiraanVolumeKerusakan,
    setPerkiraanVolumeKerusakan,
    areaSawahTerdampak,
    setAreaSawahTerdampak,
    perkiraanKedalamanKerusakan,
    setPerkiraanKedalamanKerusakan,
    jumlahPetaniTerdampak,
    setJumlahPetaniTerdampak,
    kategoriUrgensi,
    setKategoriUrgensi,
    fotoKerusakan,
    setFotoKerusakan,
    previewUrls,
    setPreviewUrls,
    errors,
    isSubmitting,
    submitError,
    // Functions
    handleSubmit,
  };
}
