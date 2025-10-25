import { useState } from "react";
import { useNavigate } from "react-router";
import z from "zod";
import { useFormDataStore } from "~/store/formDataStore";
import { apiService } from "~/services/apiService";
import type { TataBangunanForm } from "~/types/formData";
import {
  buildingTypeToApi,
  reportStatusToApi,
  fundingSourceToApi,
  workTypeToApi,
  conditionAfterRehabToApi
} from "~/utils/enumMapper";
import {
  tataBangunanSchema,
  tataBangunanKerusakanSchema,
  tataBangunanRehabilitasiSchema
} from "../validation/tataBangunanValidation";
import { toast } from "sonner";

type ReportStatus = 'kerusakan' | 'rehabilitasi' | 'pembangunan-baru';

export function useTataBangunan() {
  const navigate = useNavigate();
  const { indexData } = useFormDataStore();

  // Form states
  const [namaBangunan, setNamaBangunan] = useState("");
  const [jenisBangunan, setJenisBangunan] = useState("");
  const [statusLaporan, setStatusLaporan] = useState<ReportStatus | "">("");
  const [sumberDana, setSumberDana] = useState("");
  const [tahunPembangunan, setTahunPembangunan] = useState("");
  const [alamatLengkap, setAlamatLengkap] = useState("");
  const [luasLantai, setLuasLantai] = useState("");
  const [jumlahLantai, setJumlahLantai] = useState("");
  const [jenisPekerjaan, setJenisPekerjaan] = useState("");
  const [kondisiSetelahRehabilitasi, setKondisiSetelahRehabilitasi] = useState("");
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [fotoKerusakan, setFotoKerusakan] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | undefined>(undefined);

  const validateForm = (latitude: string, longitude: string) => {
    try {
      let schema;
      if (statusLaporan === "kerusakan") {
        schema = tataBangunanKerusakanSchema;
      } else if (statusLaporan === "rehabilitasi") {
        schema = tataBangunanRehabilitasiSchema;
      } else {
        schema = tataBangunanSchema;
      }

      schema.parse({
        latitude,
        longitude,
        namaBangunan,
        jenisBangunan,
        statusLaporan,
        sumberDana,
        tahunPembangunan,
        alamatLengkap,
        luasLantai,
        jumlahLantai,
        jenisPekerjaan,
        kondisiSetelahRehabilitasi,
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

  const mapFormToApiData = (latitude: string, longitude: string): TataBangunanForm & {
    photoFiles?: File[];
    reporter_name: string;
    reporter_role: string;
    village: string;
    district: string;
  } => {
    return {
      reporter_name: indexData?.namaPelapor || "Default Reporter",
      reporter_role: indexData?.jabatan || "Public",
      village: indexData?.desaKecamatan || "Default Village",
      district: indexData?.desaKecamatan || "Default District",

      building_name: namaBangunan,
      building_type: buildingTypeToApi(jenisBangunan),
      report_status: reportStatusToApi(statusLaporan),
      funding_source: fundingSourceToApi(sumberDana),
      last_year_construction: parseInt(tahunPembangunan),

      full_address: alamatLengkap,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      floor_area: parseFloat(luasLantai),
      floor_count: jumlahLantai,

      work_type: jenisPekerjaan ? workTypeToApi(jenisPekerjaan) : "",
      condition_after_rehab: kondisiSetelahRehabilitasi ? conditionAfterRehabToApi(kondisiSetelahRehabilitasi) : "",

      photos: previewUrls,
      photoFiles: fotoKerusakan,
    };
  };

  const handleSubmit = async (latitude: string, longitude: string) => {
    if (!validateForm(latitude, longitude)) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(undefined);

    try {
      const apiData = mapFormToApiData(latitude, longitude);
      const response = await apiService.submitBuildingReport(apiData);

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
    namaBangunan,
    setNamaBangunan,
    jenisBangunan,
    setJenisBangunan,
    statusLaporan,
    setStatusLaporan,
    sumberDana,
    setSumberDana,
    tahunPembangunan,
    setTahunPembangunan,
    alamatLengkap,
    setAlamatLengkap,
    luasLantai,
    setLuasLantai,
    jumlahLantai,
    setJumlahLantai,
    jenisPekerjaan,
    setJenisPekerjaan,
    kondisiSetelahRehabilitasi,
    setKondisiSetelahRehabilitasi,
    previewUrls,
    setPreviewUrls,
    fotoKerusakan,
    setFotoKerusakan,
    errors,
    isSubmitting,
    submitError,
    setSubmitError,
    // Functions
    handleSubmit,
  };
}
