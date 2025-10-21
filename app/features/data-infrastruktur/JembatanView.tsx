import z from "zod";
import { useEffect, useState, useMemo } from "react";
import Maps from "./components/Maps";
import { Icon } from "@iconify/react";
import { InputWithMic } from "~/components/InputWithMic";
import { TextareaWithMic } from "~/components/TextareaWithMic";
import { Button } from "~/components/ui/button";
import bridgeData from "~/../public/json/bridge_name.json";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useNavigate } from "react-router";
import { jembatanSchema } from "./validation/jembatanValidation";
import { apiService } from "~/services/apiService";
import type { BinamargaJembatanForm } from "~/types/formData";
import { useFormDataStore } from "~/store/formDataStore";
import {
  peranPelaporToInstitution,
  bridgeStructureTypeToApi,
  bridgeDamageTypeToApi,
  bridgeDamageLevelToApi,
  trafficConditionToApi,
  urgencyLevelToApi
} from "~/utils/enumMapper";
import { useCheckIndexData } from "~/middleware/checkIndexData";
import { toast } from "sonner";
import SmartImageUploader from "~/components/SmartImageUploader";
import SearchableSelect from "~/components/search/SearchableSelect";

export function JembatanView() {
  // Check if IndexView data is filled
  useCheckIndexData();

  const [position, setPosition] = useState<[number, number]>([
    -7.4034, 111.4464,
  ]); // Default: Ngawi
  const [latitude, setLatitude] = useState("-7.4034");
  const [longitude, setLongitude] = useState("111.4464");
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Form states
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

  // Error states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Reset section when bridge changes
  useEffect(() => {
    setSelectedSection("");
  }, [selectedBridge]);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { indexData } = useFormDataStore();

  // Sync position dengan input values
  useEffect(() => {
    if (position) {
      setLatitude(position[0].toString());
      setLongitude(position[1].toString());
    }
  }, [position]);

  // Handle manual input latitude
  const handleLatitudeChange = (value: string) => {
    setLatitude(value);
    const lat = parseFloat(value);
    if (!isNaN(lat) && !isNaN(parseFloat(longitude))) {
      setPosition([lat, parseFloat(longitude)]);
    }
  };

  // Handle manual input longitude
  const handleLongitudeChange = (value: string) => {
    setLongitude(value);
    const lng = parseFloat(value);
    if (!isNaN(lng) && !isNaN(parseFloat(latitude))) {
      setPosition([parseFloat(latitude), lng]);
    }
  };

  // Aktifkan GPS location
  const aktivasiLokasi = () => {
    setIsLoadingLocation(true);

    // Check if geolocation is supported
    if (!("geolocation" in navigator)) {
      alert("Geolocation tidak didukung oleh browser Anda.");
      setIsLoadingLocation(false);
      return;
    }

    // Check if running on localhost (HTTP) vs production (HTTPS)
    const isSecureContext = window.isSecureContext;

    // Use more specific options for mobile
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newPosition: [number, number] = [
          pos.coords.latitude,
          pos.coords.longitude,
        ];
        setPosition(newPosition);
        setIsLoadingLocation(false);
      },
      (error) => {
        setIsLoadingLocation(false);

        // Provide more specific error messages
        let errorMessage = "Tidak dapat mengakses lokasi. ";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage +=
              "Izin lokasi ditolak. Silakan aktifkan izin lokasi di pengaturan browser/device Anda.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += "Informasi lokasi tidak tersedia.";
            break;
          case error.TIMEOUT:
            errorMessage += "Permintaan lokasi timeout.";
            break;
          default:
            errorMessage += "Pastikan izin lokasi diaktifkan dan coba lagi.";
            break;
        }
        alert(errorMessage);
      },
      {
        enableHighAccuracy: true, // Use GPS if available for better accuracy
        timeout: 10000, // 10 seconds timeout
        maximumAge: 60000, // Accept cached position up to 1 minute old
      }
    );
  };

  const validateForm = () => {
    try {
      jembatanSchema.parse({
        latitude,
        longitude,
        namaJembatan,
        jenisStruktur,
        jenisKerusakan,
        tingkatKerusakan,
        kondisiLaluLintas,
        volumeLaluLintas,
        kategoriPrioritas,
        fotoKerusakan,
      });

      // If validation passes, clear errors
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          // Use the field path as key, not the message
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

  // Map form values to API format
  const mapFormToApiData = (): BinamargaJembatanForm & {
    photoFiles?: File[];
  } => {
    return {
      // Reporter info from index form
      reporter_name: indexData?.namaPelapor || "Default Reporter",
      institution_unit: peranPelaporToInstitution(indexData?.peranPelapor || ""),
      phone_number: indexData?.nomorHP || "000000000000",
      report_datetime:
        (indexData?.tanggalLaporan instanceof Date
          ? indexData.tanggalLaporan.toISOString()
          : new Date().toISOString()),

      // Bridge identification - MAP TO API FORMAT
      bridge_name: namaJembatan,
      bridge_structure_type: bridgeStructureTypeToApi(jenisStruktur),
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),

      // Damage details - MAP TO API FORMAT
      bridge_damage_type: bridgeDamageTypeToApi(jenisKerusakan),
      bridge_damage_level: bridgeDamageLevelToApi(tingkatKerusakan),

      // Traffic impact - MAP TO API FORMAT
      traffic_condition: trafficConditionToApi(kondisiLaluLintas),
      daily_traffic_volume: parseInt(volumeLaluLintas) || 0,
      urgency_level: urgencyLevelToApi(kategoriPrioritas),

      // Photos
      photos: previewUrls,
      photoFiles: fotoKerusakan,
    };
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const apiData = mapFormToApiData();
      const response = await apiService.submitBinamargaJembatan(apiData);

      if (response.data.success) {
        toast.success("Data berhasil dikirim!");
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

  return (
    <main className="space-y-6">
      {/* Data Irigasi */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          Data Jembatan
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Kecamatan<span className="text-red-500">*</span>
            </label>
            <SearchableSelect
              options={districts}
              value={selectedDistrict}
              onValueChange={setSelectedDistrict}
              placeholder="Pilih Kecamatan..."
              emptyMessage="Tidak ada kecamatan yang ditemukan"
              className={errors.district ? "border-red-500" : ""}
            />
            {errors.district && (
              <p className="text-red-500 text-sm mt-1">
                {errors.district}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nama Jembatan<span className="text-red-500">*</span>
            </label>
            <SearchableSelect
              options={filteredBridges}
              value={selectedBridge}
              onValueChange={setSelectedBridge}
              placeholder={selectedDistrict ? "Pilih Jembatan..." : "Pilih Kecamatan terlebih dahulu"}
              emptyMessage="Tidak ada jembatan yang ditemukan"
              disabled={!selectedDistrict}
              className={errors.bridge ? "border-red-500" : ""}
            />
            {errors.bridge && (
              <p className="text-red-500 text-sm mt-1">
                {errors.bridge}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nama Ruas<span className="text-red-500">*</span>
            </label>
            <SearchableSelect
              options={filteredSections}
              value={selectedSection}
              onValueChange={setSelectedSection}
              placeholder={selectedBridge ? "Pilih Ruas..." : "Pilih Jembatan terlebih dahulu"}
              emptyMessage="Tidak ada ruas yang ditemukan"
              disabled={!selectedBridge}
              className={errors.section ? "border-red-500" : ""}
            />
            {errors.section && (
              <p className="text-red-500 text-sm mt-1">
                {errors.section}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Jenis Struktur<span className="text-red-500">*</span>
            </label>
            <Select value={jenisStruktur} onValueChange={setJenisStruktur}>
              <SelectTrigger
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all appearance-none bg-white ${errors.jenisStruktur
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-blue-500"
                  }`}
              >
                <SelectValue placeholder="Pilih Jenis Struktur" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beton-bertulang">Beton Bertulang</SelectItem>
                <SelectItem value="baja">Baja</SelectItem>
                <SelectItem value="kayu">Kayu</SelectItem>
              </SelectContent>
            </Select>
            {errors.jenisStruktur && (
              <p className="text-red-500 text-sm mt-1">
                {errors.jenisStruktur}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Jenis Kerusakan<span className="text-red-500">*</span>
            </label>
            <Select value={jenisKerusakan} onValueChange={setJenisKerusakan}>
              <SelectTrigger
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all appearance-none bg-white ${errors.jenisKerusakan
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-blue-500"
                  }`}
              >
                <SelectValue placeholder="Pilih Jenis Kerusakan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lantai-jembatan-retak">
                  Lantai Jembatan Retak/Rusak
                </SelectItem>
                <SelectItem value="oprit-abutment-amblas">
                  Oprit/Abutment Amblas
                </SelectItem>
                <SelectItem value="rangka-utama-retak">
                  Rangka Utama Retak
                </SelectItem>
                <SelectItem value="pondasi-terseret-arus">
                  Pondasi Terseret Arus
                </SelectItem>
                <SelectItem value="lainnya">Lainnya</SelectItem>
              </SelectContent>
            </Select>
            {errors.jenisKerusakan && (
              <p className="text-red-500 text-sm mt-1">
                {errors.jenisKerusakan}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tingkat Kerusakan<span className="text-red-500">*</span>
            </label>
            <Select
              value={tingkatKerusakan}
              onValueChange={setTingkatKerusakan}
            >
              <SelectTrigger
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all appearance-none bg-white ${errors.tingkatKerusakan
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-blue-500"
                  }`}
              >
                <SelectValue placeholder="Pilih Tingkat Kerusakan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ringan">Ringan</SelectItem>
                <SelectItem value="sedang">Sedang</SelectItem>
                <SelectItem value="berat">
                  Berat/Tidak Layak
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.tingkatKerusakan && (
              <p className="text-red-500 text-sm mt-1">
                {errors.tingkatKerusakan}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Koordinat Lokasi */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          Koordinat Lokasi
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Maps Component */}
          <Maps
            position={position}
            setPosition={setPosition}
            height="h-64"
            zoom={13}
          />

          {/* Coordinate Inputs */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Latitude<span className="text-red-500">*</span>
              </label>
              <InputWithMic
                type="text"
                value={latitude}
                onChange={(e) => handleLatitudeChange(e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.latitude
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-blue-500"
                  }`}
                placeholder="-7.4034"
                enableVoice={false}
              />
              {errors.latitude && (
                <p className="text-red-500 text-sm mt-1">{errors.latitude}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Longitude<span className="text-red-500">*</span>
              </label>
              <InputWithMic
                type="text"
                value={longitude}
                onChange={(e) => handleLongitudeChange(e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.longitude
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-blue-500"
                  }`}
                placeholder="111.4464"
                enableVoice={false}
              />
              {errors.longitude && (
                <p className="text-red-500 text-sm mt-1">{errors.longitude}</p>
              )}
            </div>

            <Button
              onClick={aktivasiLokasi}
              disabled={isLoadingLocation}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg  flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingLocation ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Mengambil Lokasi...
                </>
              ) : (
                <>
                  <Icon
                    icon="material-symbols:navigation"
                    className="w-5 h-5"
                  />
                  Aktifkan Lokasi
                </>
              )}
            </Button>
            <p className="text-xs text-gray-500 text-center">
              Atau klik pada peta untuk menentukan lokasi
            </p>
          </div>
        </div>
      </div>

      {/* Dampak & Urgensi */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          Dampak & Urgensi
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Kondisi Lalu Lintas Saat ini<span className="text-red-500">*</span>
            </label>
            <Select
              value={kondisiLaluLintas}
              onValueChange={setKondisiLaluLintas}
            >
              <SelectTrigger
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all appearance-none bg-white ${errors.kondisiLaluLintas
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-blue-500"
                  }`}
              >
                <SelectValue placeholder="Pilih Kondisi Lalu Lintas Saat ini" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="masih-bisa-dilalui">
                  Masih Bisa Dilalui
                </SelectItem>
                <SelectItem value="satu-jalur">
                  Hanya Satu Jalur Bisa Dilalui
                </SelectItem>
                <SelectItem value="tidak-bisa-dilalui">
                  Tidak Bisa Dilalui(Jembatan Putus)
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.kondisiLaluLintas && (
              <p className="text-red-500 text-sm mt-1">
                {errors.kondisiLaluLintas}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Volume Lalu Lintas Harian
              <span className="text-red-500">*</span>
            </label>
            <InputWithMic
              type="text"
              value={volumeLaluLintas}
              onChange={(e) => setVolumeLaluLintas(e.target.value)}
              placeholder="Contoh: 200"
              enableVoice={false}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.volumeLaluLintas
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-200 focus:ring-blue-500"
                }`}
            />
            {errors.volumeLaluLintas && (
              <p className="text-red-500 text-sm mt-1">
                {errors.volumeLaluLintas}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Kategori Prioritas Penanganan<span className="text-red-500">*</span>
            </label>
            <Select
              value={kategoriPrioritas}
              onValueChange={setKategoriPrioritas}
            >
              <SelectTrigger
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all appearance-none bg-white ${errors.kategoriPrioritas
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-blue-500"
                  }`}
              >
                <SelectValue placeholder="Pilih Kategori Prioritas Penanganan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="darurat">Darurat</SelectItem>
                <SelectItem value="cepat">Cepat</SelectItem>
                <SelectItem value="rutin">Rutin</SelectItem>
              </SelectContent>
            </Select>
            {errors.kategoriPrioritas && (
              <p className="text-red-500 text-sm mt-1">
                {errors.kategoriPrioritas}
              </p>
            )}
          </div>

          {/* Foto Lokasi */}
          <div className="md:col-span-2">
            <SmartImageUploader
              label="Foto Lokasi/Kerusakan"
              onFilesSelected={(files: File[]) => {
                setFotoKerusakan(files);
              }}
              onPreviewUrlsUpdated={(urls: string[]) => {
                setPreviewUrls(urls);
              }}
              maxFiles={2}
              required
            />
            {errors.fotoKerusakan && (
              <p className="text-red-500 text-sm mt-1">
                {errors.fotoKerusakan}
              </p>
            )}
          </div>
        </div>

        {/* Error Message */}
        {submitError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 text-sm font-medium">{submitError}</p>
          </div>
        )}

        <div className="mt-8 w-full flex flex-col md:flex-row md:justify-end gap-3">
          <Button
            onClick={() => navigate("/infrastruktur/binamarga")}
            variant="outline"
            className="px-8 py-6 rounded-xl cursor-pointer border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-600 w-full md:w-fit order-2 md:order-1"
            disabled={isSubmitting}
          >
            Kembali
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-blue-600 cursor-pointer w-full md:w-fit hover:bg-blue-700 text-white font-semibold py-6 px-10 rounded-xl transition-all duration-200 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed order-1 md:order-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Mengirim...
              </>
            ) : (
              "Kirim"
            )}
          </Button>
        </div>
      </div>
    </main>
  );
}
