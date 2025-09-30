import z from "zod";
import { useEffect, useState } from "react";
import Maps from "./components/Maps";
import { Icon } from "@iconify/react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useNavigate } from "react-router";
import { Label } from "~/components/ui/label";
import { sumberDayaAirSchema } from "./validation/sumberDayaAirValidation";
import { apiService } from "~/services/apiService";
import type { SumberDayaAirForm } from "~/types/formData";
import { useFormDataStore } from "~/store/formDataStore";

export function SumberDayaAirView() {
  const [position, setPosition] = useState<[number, number]>([
    -7.4034, 111.4464,
  ]); // Default: Ngawi
  const [latitude, setLatitude] = useState("-7.4034");
  const [longitude, setLongitude] = useState("111.4464");
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Form states
  const [namaDaerahIrigasi, setNamaDaerahIrigasi] = useState("");
  const [jenisIrigasi, setJenisIrigasi] = useState("");
  const [jenisKerusakan, setJenisKerusakan] = useState("");
  const [tingkatKerusakan, setTingkatKerusakan] = useState("");
  const [perkiraanPanjangKerusakan, setPerkiraanPanjangKerusakan] = useState("");
  const [perkiraanLebarKerusakan, setPerkiraanLebarKerusakan] = useState("");
  const [perkiraanLuasKerusakan, setPerkiraanLuasKerusakan] = useState("");
  const [areaSawahTerdampak, setAreaSawahTerdampak] = useState("");
  const [jumlahPetaniTerdampak, setJumlahPetaniTerdampak] = useState("");
  const [kategoriUrgensi, setKategoriUrgensi] = useState("");
  const [fotoKerusakan, setFotoKerusakan] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Error states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { indexData } = useFormDataStore(); // Get reporter data from index form

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
    if (!isSecureContext) {
      console.warn(
        "Geolocation might not work properly in non-HTTPS environment"
      );
    }

    // Use more specific options for mobile
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newPosition: [number, number] = [
          pos.coords.latitude,
          pos.coords.longitude,
        ];
        setPosition(newPosition);
        setIsLoadingLocation(false);
        console.log(`Location received: ${newPosition[0]}, ${newPosition[1]}`);
      },
      (error) => {
        setIsLoadingLocation(false);
        console.error("Error getting location:", error);

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
      sumberDayaAirSchema.parse({
        latitude,
        longitude,
        namaDaerahIrigasi,
        jenisIrigasi,
        jenisKerusakan,
        tingkatKerusakan,
        perkiraanPanjangKerusakan,
        perkiraanLebarKerusakan,
        perkiraanLuasKerusakan,
        areaSawahTerdampak,
        jumlahPetaniTerdampak,
        kategoriUrgensi,
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
  const mapFormToApiData = (): SumberDayaAirForm & { photoFiles?: File[] } => {
    return {
      // Reporter info from index form
      reporter_name: indexData?.namaPelapor || "Default Reporter",
      institution_unit: "DINAS", // Default value, should be collected from form
      phone_number: indexData?.nomorHP || "000000000000",
      report_datetime: indexData?.tanggalLaporan?.toISOString() || new Date().toISOString(),

      // Irrigation data
      irrigation_area_name: namaDaerahIrigasi,
      irrigation_type: jenisIrigasi,

      // Location data
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),

      // Damage data
      damage_type: jenisKerusakan,
      damage_level: tingkatKerusakan,

      // Estimated measurements
      estimated_length: parseFloat(perkiraanPanjangKerusakan) || 0,
      estimated_width: parseFloat(perkiraanLebarKerusakan) || 0,
      estimated_volume: parseFloat(perkiraanLuasKerusakan) || 0,

      // Impact data
      affected_rice_field_area: parseFloat(areaSawahTerdampak) || 0,
      affected_farmers_count: parseInt(jumlahPetaniTerdampak) || 0,
      urgency_category: kategoriUrgensi,

      // Photos as string array (base64 or URLs - but we'll use files)
      photos: previewUrls,

      // Actual files for upload
      photoFiles: fotoKerusakan
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
      console.log('Submitting Water Resources data:', apiData);

      const response = await apiService.submitWaterResources(apiData);

      if (response.data.success) {
        console.log('\u2705 Water Resources submission successful:', response.data);
        navigate("/success");
      } else {
        throw new Error(response.data.message || 'Submission failed');
      }
    } catch (error: any) {
      console.error('\u274c Water Resources submission error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Terjadi kesalahan saat mengirim data';
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  function ImageUpload() {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = () => {
      setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith("image/"));
      if (files.length > 0) {
        const newFiles = [...fotoKerusakan, ...files];
        setFotoKerusakan(newFiles);

        // Create preview URLs for new files
        files.forEach(file => {
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreviewUrls(prev => [...prev, reader.result as string]);
          };
          reader.readAsDataURL(file);
        });
      }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []).filter(file => file.type.startsWith("image/"));
      if (files.length > 0) {
        const newFiles = [...fotoKerusakan, ...files];
        setFotoKerusakan(newFiles);

        // Create preview URLs for new files
        files.forEach(file => {
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreviewUrls(prev => [...prev, reader.result as string]);
          };
          reader.readAsDataURL(file);
        });
      }
    };

    return (
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-8 transition-all ${
          isDragging
            ? "border-blue-600 bg-blue-50"
            : "border-gray-300 hover:border-blue-400"
        }`}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {previewUrls.length > 0 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const newPreviewUrls = previewUrls.filter((_, i) => i !== index);
                      const newFiles = fotoKerusakan.filter((_, i) => i !== index);
                      setPreviewUrls(newPreviewUrls);
                      setFotoKerusakan(newFiles);
                    }}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    <Icon icon="mdi:close" className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 text-center">
              {fotoKerusakan.length} foto dipilih. Klik + untuk menambah foto lagi.
            </p>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon icon="mdi:cloud-upload" className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-sm font-semibold text-gray-700 mb-1">
              Upload Foto Kerusakan
            </p>
            <p className="text-xs text-gray-500">
              Drag & drop atau klik untuk upload (minimal 1 foto)
            </p>
            <p className="text-xs text-gray-400 mt-2">
              PNG, JPG, JPEG (Max 5MB per file)
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <main className="space-y-6">
      {/* Data Irigasi */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          Identifikasi Daerah Irigasi
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nama Daerah Irigasi
              <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={namaDaerahIrigasi}
              onChange={(e) => setNamaDaerahIrigasi(e.target.value)}
              placeholder="Contoh: DI Sambi"
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.namaDaerahIrigasi
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-blue-500"
              }`}
            />
            {errors.namaDaerahIrigasi && (
              <p className="text-red-500 text-sm mt-1">{errors.namaDaerahIrigasi}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Jenis Irigasi<span className="text-red-500">*</span>
            </label>
            <Select value={jenisIrigasi} onValueChange={setJenisIrigasi}>
              <SelectTrigger className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all appearance-none bg-white ${
                errors.jenisIrigasi
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-blue-500"
              }`}>
                <SelectValue placeholder="Pilih Jenis Irigasi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="saluran-sekunder">Saluran Sekunder</SelectItem>
                <SelectItem value="embung-dam">Embung/Dam</SelectItem>
                <SelectItem value="bendung">Bendung</SelectItem>
                <SelectItem value="pintu-air">Pintu Air</SelectItem>
                <SelectItem value="lainnya">Lainnya</SelectItem>
              </SelectContent>
            </Select>
            {errors.jenisIrigasi && (
              <p className="text-red-500 text-sm mt-1">{errors.jenisIrigasi}</p>
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
                Latitude*
              </label>
              <Input
                type="text"
                value={latitude}
                onChange={(e) => handleLatitudeChange(e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.latitude
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-200 focus:ring-blue-500"
                }`}
                placeholder="-7.4034"
              />
              {errors.latitude && (
                <p className="text-red-500 text-sm mt-1">{errors.latitude}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Longitude*
              </label>
              <Input
                type="text"
                value={longitude}
                onChange={(e) => handleLongitudeChange(e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.longitude
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-200 focus:ring-blue-500"
                }`}
                placeholder="111.4464"
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

      {/* Data Kerusakan */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          Data Kerusakan
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Jenis Kerusakan*
            </label>
            <Select value={jenisKerusakan} onValueChange={setJenisKerusakan}>
              <SelectTrigger className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all appearance-none bg-white ${
                errors.jenisKerusakan
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-blue-500"
              }`}>
                <SelectValue placeholder="Pilih Jenis Kerusakan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="retak-bocor">Retak/Bocor</SelectItem>
                <SelectItem value="longsor-ambrol">Longsor/Ambrol</SelectItem>
                <SelectItem value="sedimentasi-tinggi">Sedimentasi Tinggi</SelectItem>
                <SelectItem value="tersumbat-sampah">Tersumbat Sampah</SelectItem>
                <SelectItem value="struktur-beton-rusak">Struktur Beton Rusak</SelectItem>
              </SelectContent>
            </Select>
            {errors.jenisKerusakan && (
              <p className="text-red-500 text-sm mt-1">{errors.jenisKerusakan}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tingkat Kerusakan*
            </label>
            <Select value={tingkatKerusakan} onValueChange={setTingkatKerusakan}>
              <SelectTrigger className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all appearance-none bg-white ${
                errors.tingkatKerusakan
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-blue-500"
              }`}>
                <SelectValue placeholder="Pilih Tingkat Kerusakan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ringan">
                  Ringan (fungsi masih berjalan)
                </SelectItem>
                <SelectItem value="sedang">
                  Sedang (fungsi terganggu sebagian)
                </SelectItem>
                <SelectItem value="berat">
                  Berat (tidak dapat difungsikan sama sekali)
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.tingkatKerusakan && (
              <p className="text-red-500 text-sm mt-1">{errors.tingkatKerusakan}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Perkiraan Panjang Kerusakan (m)*
            </label>
            <Input
              type="text"
              value={perkiraanPanjangKerusakan}
              onChange={(e) => setPerkiraanPanjangKerusakan(e.target.value)}
              placeholder="Contoh: 10"
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.perkiraanPanjangKerusakan
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-blue-500"
              }`}
            />
            {errors.perkiraanPanjangKerusakan && (
              <p className="text-red-500 text-sm mt-1">{errors.perkiraanPanjangKerusakan}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Perkiraan Lebar Kerusakan (m)*
            </label>
            <Input
              type="text"
              value={perkiraanLebarKerusakan}
              onChange={(e) => setPerkiraanLebarKerusakan(e.target.value)}
              placeholder="Contoh: 2"
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.perkiraanLebarKerusakan
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-blue-500"
              }`}
            />
            {errors.perkiraanLebarKerusakan && (
              <p className="text-red-500 text-sm mt-1">{errors.perkiraanLebarKerusakan}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Perkiraan Luas Kerusakan (m<sup>2</sup>)*
            </label>
            <Input
              type="text"
              value={perkiraanLuasKerusakan}
              onChange={(e) => setPerkiraanLuasKerusakan(e.target.value)}
              placeholder="Contoh: 20"
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.perkiraanLuasKerusakan
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-blue-500"
              }`}
            />
            {errors.perkiraanLuasKerusakan && (
              <p className="text-red-500 text-sm mt-1">{errors.perkiraanLuasKerusakan}</p>
            )}
          </div>

          {/* Foto Lokasi */}
          <div className="col-span-2">
            <Label className="text-sm font-semibold text-gray-700 mb-4">
              Foto Lokasi/Kerusakan*
            </Label>
            <ImageUpload />
            {errors.fotoKerusakan && (
              <p className="text-red-500 text-sm mt-1">{errors.fotoKerusakan}</p>
            )}
          </div>

          {/* Upload Button - Mobile */}
          <div className="mt-6 md:hidden">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 rounded-xl">
              <Icon icon="mdi:upload" className="w-5 h-5 mr-2" />
              Unggah
            </Button>
          </div>
        </div>

      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          Dampak
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Area Sawah Terdampak (ha)
              <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={areaSawahTerdampak}
              onChange={(e) => setAreaSawahTerdampak(e.target.value)}
              placeholder="Contoh: 10"
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.areaSawahTerdampak
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-blue-500"
              }`}
            />
            {errors.areaSawahTerdampak && (
              <p className="text-red-500 text-sm mt-1">{errors.areaSawahTerdampak}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Jumlah Petani Terdampak
              <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={jumlahPetaniTerdampak}
              onChange={(e) => setJumlahPetaniTerdampak(e.target.value)}
              placeholder="Contoh: 5"
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.jumlahPetaniTerdampak
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-blue-500"
              }`}
            />
            {errors.jumlahPetaniTerdampak && (
              <p className="text-red-500 text-sm mt-1">{errors.jumlahPetaniTerdampak}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Kategori Urgensi Penaganan<span className="text-red-500">*</span>
            </label>
            <Select value={kategoriUrgensi} onValueChange={setKategoriUrgensi}>
              <SelectTrigger className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all appearance-none bg-white ${
                errors.kategoriUrgensi
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-blue-500"
              }`}>
                <SelectValue placeholder="Pilih Kategori Urgensi Penanganan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mendesak">Mendesak (potensi gagal panen/banjir)</SelectItem>
                <SelectItem value="rutin">Rutin</SelectItem>
              </SelectContent>
            </Select>
            {errors.kategoriUrgensi && (
              <p className="text-red-500 text-sm mt-1">{errors.kategoriUrgensi}</p>
            )}
          </div>
        </div>

        {/* Error Message */}
        {submitError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 text-sm font-medium">{submitError}</p>
          </div>
        )}

        <div className="mt-8 flex w-full justify-end gap-3">
          <Button
            onClick={() => navigate("/infrastruktur")}
            variant="outline"
            className="px-8 py-6 rounded-xl cursor-pointer  border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-600"
            disabled={isSubmitting}
          >
            Kembali
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-blue-600 sm:w-fit cursor-pointer w-full hover:bg-blue-700 text-white font-semibold py-6 px-10 rounded-xl transition-all duration-200 shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
