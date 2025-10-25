import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import z from "zod";
import { useFormDataStore } from "~/store/formDataStore";
import { apiService } from "~/services/apiService";
import type { BinamargaJembatanForm } from "~/types/formData";
import {
  institutionBinaMargaToApi,
  bridgeStructureTypeToApi,
  bridgeDamageTypeToApi,
  bridgeDamageLevelToApi,
  trafficConditionToApi,
  urgencyLevelToApi
} from "~/utils/enumMapper";
import { jembatanSchema } from "../validation/jembatanValidation";
import { toast } from "sonner";
import bridgeData from "~/../public/json/bridge_name.json";

export function useJembatan() {
  const navigate = useNavigate();
  const { indexData } = useFormDataStore();

  // Form states
  const [institusi, setInstitusi] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedBridge, setSelectedBridge] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [namaJembatan, setNamaJembatan] = useState("");
  const [jenisStruktur, setJenisStruktur] = useState("");
  const [jenisKerusakan, setJenisKerusakan] = useState("");
  const [tingkatKerusakan, setTingkatKerusakan] = useState("");
  const [kondisiLaluLintas, setKondisiLaluLintas] = useState("");
  const [volumeLaluLintas, setVolumeLaluLintas] = useState("");
  const [kategoriPrioritas, setKategoriPrioritas] = useState("");
  const [fotoKerusakan, setFotoKerusakan] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Get unique districts
  const districts = useMemo(() => {
    const uniqueDistricts = new Set<string>();
    bridgeData.forEach(item => uniqueDistricts.add(item.district));
    return Array.from(uniqueDistricts).sort();
  }, []);

  // Get filtered bridges based on selected district
  const filteredBridges = useMemo(() => {
    if (!selectedDistrict) return [];
    const bridges = new Set<string>();
    bridgeData
      .filter(item => item.district === selectedDistrict)
      .forEach(item => bridges.add(item.bridge_name));
    return Array.from(bridges).sort();
  }, [selectedDistrict]);

  // Get filtered sections based on selected bridge
  const filteredSections = useMemo(() => {
    if (!selectedDistrict || !selectedBridge) return [];
    return bridgeData
      .filter(item => item.district === selectedDistrict && item.bridge_name === selectedBridge)
      .map(item => item.section_name)
      .sort();
  }, [selectedDistrict, selectedBridge]);

  // Reset dependent fields when district changes
  useEffect(() => {
    setSelectedBridge("");
    setSelectedSection("");
  }, [selectedDistrict]);

  // Reset section and update namaJembatan when bridge changes
  useEffect(() => {
    setSelectedSection("");
    if (selectedBridge) {
      setNamaJembatan(selectedBridge);
    } else {
      setNamaJembatan("");
    }
  }, [selectedBridge]);

  const validateForm = (latitude: string, longitude: string) => {
    try {
      jembatanSchema.parse({
        latitude,
        longitude,
        institusi,
        kecamatan: selectedDistrict,
        namaJembatan,
        namaRuas: selectedSection,
        jenisStruktur,
        jenisKerusakan,
        tingkatKerusakan,
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

  const mapFormToApiData = (latitude: string, longitude: string): BinamargaJembatanForm & { photoFiles?: File[] } => {
    return {
      reporter_name: indexData?.namaPelapor || "Default Reporter",
      institution_unit: institutionBinaMargaToApi(institusi),
      phone_number: indexData?.nomorHP || "000000000000",
      report_datetime:
        (indexData?.tanggalLaporan instanceof Date
          ? indexData.tanggalLaporan.toISOString()
          : new Date().toISOString()),

      district: selectedDistrict,
      bridge_name: namaJembatan,
      bridge_section: selectedSection,
      bridge_structure_type: bridgeStructureTypeToApi(jenisStruktur),
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),

      bridge_damage_type: bridgeDamageTypeToApi(jenisKerusakan),
      bridge_damage_level: bridgeDamageLevelToApi(tingkatKerusakan),

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
      const response = await apiService.submitBinamargaJembatan(apiData);

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
    selectedDistrict,
    setSelectedDistrict,
    selectedBridge,
    setSelectedBridge,
    selectedSection,
    setSelectedSection,
    namaJembatan,
    setNamaJembatan,
    jenisStruktur,
    setJenisStruktur,
    jenisKerusakan,
    setJenisKerusakan,
    tingkatKerusakan,
    setTingkatKerusakan,
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
    filteredBridges,
    filteredSections,
    // Functions
    handleSubmit,
  };
}
