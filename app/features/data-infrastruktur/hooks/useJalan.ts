import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import z from "zod";
import { useFormDataStore } from "~/store/formDataStore";
import { apiService } from "~/services/apiService";
import type { BinamargaJalanForm } from "~/types/formData";
import {
  institutionBinaMargaToApi,
  pavementTypeToApi,
  roadDamageTypeToApi,
  damageLevelToApi,
  trafficConditionToApi,
  urgencyLevelToApi
} from "~/utils/enumMapper";
import { jalanSchema } from "../validation/jalanValidation";
import { toast } from "sonner";
import { getDistricts, getRoadsByDistrict } from "~/utils/roadUtils";

export function useJalan() {
  const navigate = useNavigate();
  const { indexData } = useFormDataStore();

  // Form states
  const [institusi, setInstitusi] = useState("");
  const [selectedKecamatan, setSelectedKecamatan] = useState("");
  const [selectedJalan, setSelectedJalan] = useState("");
  const [panjangSegmen, setPanjangSegmen] = useState("");
  const [jenisPerkerasan, setJenisPerkerasan] = useState("");
  const [jenisKerusakan, setJenisKerusakan] = useState("");
  const [tingkatKerusakan, setTingkatKerusakan] = useState("");
  const [panjangKerusakan, setPanjangKerusakan] = useState("");
  const [lebarKerusakan, setLebarKerusakan] = useState("");
  const [totalLuasKerusakan, setTotalLuasKerusakan] = useState("");
  const [kondisiLaluLintas, setKondisiLaluLintas] = useState("");
  const [volumeLaluLintas, setVolumeLaluLintas] = useState("");
  const [kategoriPrioritas, setKategoriPrioritas] = useState("");
  const [fotoKerusakan, setFotoKerusakan] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Load districts for the select
  const districts = getDistricts();
  const [availableRoads, setAvailableRoads] = useState<string[]>([]);

  // Update available roads when district changes
  useEffect(() => {
    if (selectedKecamatan) {
      const roads = getRoadsByDistrict(selectedKecamatan);
      setAvailableRoads(roads);
      setSelectedJalan("");
    } else {
      setAvailableRoads([]);
      setSelectedJalan("");
    }
  }, [selectedKecamatan]);

  const validateForm = (latitude: string, longitude: string) => {
    try {
      jalanSchema.parse({
        latitude,
        longitude,
        institusi,
        kecamatan: selectedKecamatan,
        namaRuasJalan: selectedJalan,
        panjangSegmen,
        jenisPerkerasan,
        jenisKerusakan,
        tingkatKerusakan,
        panjangKerusakan,
        lebarKerusakan,
        totalLuasKerusakan,
        kondisiLaluLintas,
        volumeLaluLintas,
        kategoriPrioritas,
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

  const mapFormToApiData = (latitude: string, longitude: string): BinamargaJalanForm & { photoFiles?: File[] } => {
    return {
      reporter_name: indexData?.namaPelapor || "Default Reporter",
      institution_unit: institutionBinaMargaToApi(institusi),
      phone_number: indexData?.nomorHP || "000000000000",
      report_datetime:
        (indexData?.tanggalLaporan instanceof Date
          ? indexData.tanggalLaporan.toISOString()
          : new Date().toISOString()),

      district: selectedKecamatan,
      road_name: selectedJalan,
      segment_length: parseFloat(panjangSegmen) || 0,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),

      pavement_type: pavementTypeToApi(jenisPerkerasan),
      damage_type: roadDamageTypeToApi(jenisKerusakan),
      damage_level: damageLevelToApi(tingkatKerusakan),
      damaged_length: parseFloat(panjangKerusakan) || 0,
      damaged_width: parseFloat(lebarKerusakan) || 0,
      total_damaged_area: parseFloat(totalLuasKerusakan) || 0,

      traffic_condition: trafficConditionToApi(kondisiLaluLintas),
      daily_traffic_volume: parseInt(volumeLaluLintas) || 0,
      urgency_level: urgencyLevelToApi(kategoriPrioritas),

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
      const response = await apiService.submitBinamargaJalan(apiData);

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
    institusi,
    setInstitusi,
    selectedKecamatan,
    setSelectedKecamatan,
    selectedJalan,
    setSelectedJalan,
    panjangSegmen,
    setPanjangSegmen,
    jenisPerkerasan,
    setJenisPerkerasan,
    jenisKerusakan,
    setJenisKerusakan,
    tingkatKerusakan,
    setTingkatKerusakan,
    panjangKerusakan,
    setPanjangKerusakan,
    lebarKerusakan,
    setLebarKerusakan,
    totalLuasKerusakan,
    setTotalLuasKerusakan,
    kondisiLaluLintas,
    setKondisiLaluLintas,
    volumeLaluLintas,
    setVolumeLaluLintas,
    kategoriPrioritas,
    setKategoriPrioritas,
    fotoKerusakan,
    setFotoKerusakan,
    previewUrls,
    setPreviewUrls,
    errors,
    isSubmitting,
    submitError,
    // Data
    districts,
    availableRoads,
    // Functions
    handleSubmit,
  };
}
