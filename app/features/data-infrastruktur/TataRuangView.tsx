import z from "zod";
import { useEffect, useState } from "react";
import Maps from "./components/Maps";
import { Icon } from "@iconify/react";
import { InputWithMic } from "~/components/InputWithMic";
import { TextareaWithMic } from "~/components/TextareaWithMic";
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
import { tataRuangSchema } from "./validation/tataRuangValidation";
import { useFormDataStore } from "~/store/formDataStore";
import { apiService } from "~/services/apiService";
import { peranPelaporToInstitution } from "~/utils/enumMapper";
import { useCheckIndexData } from "~/middleware/checkIndexData";
import { toast } from "sonner";

export function TataRuangView() {
  // Check if IndexView data is filled
  useCheckIndexData();

  const [position, setPosition] = useState<[number, number]>([
    -7.4034, 111.4464,
  ]); // Default: Ngawi
  const [latitude, setLatitude] = useState("-7.4034");
  const [longitude, setLongitude] = useState("111.4464");
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Form states
  const [gambaranAreaLokasi, setGambaranAreaLokasi] = useState("");
  const [kategoriKawasan, setKategoriKawasan] = useState("");
  const [jenisPelanggaran, setJenisPelanggaran] = useState("");
  const [tingkatPelanggaran, setTingkatPelanggaran] = useState("");
  const [dampakLingkungan, setDampakLingkungan] = useState("");
  const [tingkatUrgensi, setTingkatUrgensi] = useState("");
  const [fotoLokasi, setFotoLokasi] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Error states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { getIndexData, clearAllData } = useFormDataStore();

  // Debug: Clear any potentially corrupted localStorage on component mount
  useEffect(() => {
    const storedData = getIndexData();
  }, []);

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
      tataRuangSchema.parse({
        latitude,
        longitude,
        gambaranAreaLokasi,
        kategoriKawasan,
        jenisPelanggaran,
        tingkatPelanggaran,
        dampakLingkungan,
        tingkatUrgensi,
        fotoLokasi,
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

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
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
      // Map peran pelapor to institution - API expects: DINAS, DESA, KECAMATAN

      // Map violation level to API format - API expects: RINGAN, SEDANG, BERAT
      const getViolationLevel = (level: string) => {
        switch (level) {
          case "ringan":
            return "RINGAN";
          case "sedang":
            return "SEDANG";
          case "berat":
            return "BERAT";
          default:
            return level.toUpperCase();
        }
      };

      // Map urgency level to API format - API expects: MENDESAK, BIASA
      const getUrgencyLevel = (urgency: string) => {
        switch (urgency) {
          case "mendesak":
            return "MENDESAK";
          case "biasa":
            return "BIASA";
          default:
            return urgency.toUpperCase();
        }
      };

      // Format datetime properly - API expects "2024-01-15T10:30:00Z" format
      const formatDateTime = (date: Date | null): string => {
        let dateObj: Date;

        if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
          dateObj = new Date();
        } else {
          dateObj = date;
        }

        // Try different formats - API error mentions "2006-01-02 15:04:05" format
        // Let's try multiple formats
        const isoString = dateObj.toISOString();
        const withoutMilliseconds = isoString.replace(/\.\d{3}Z$/, "Z");

        // Format yang mungkin diharapkan API: YYYY-MM-DD HH:MM:SS
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, "0");
        const day = String(dateObj.getDate()).padStart(2, "0");
        const hours = String(dateObj.getHours()).padStart(2, "0");
        const minutes = String(dateObj.getMinutes()).padStart(2, "0");
        const seconds = String(dateObj.getSeconds()).padStart(2, "0");

        const sqlFormat = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

        // Try RFC3339 format first (API tries this first)
        return withoutMilliseconds;
      };

      // Prepare data for API - try multiple datetime formats
      const formattedDateTime = formatDateTime(indexData.tanggalLaporan);

      const apiData: any = {
        reporter_name: indexData.namaPelapor,
        institution: peranPelaporToInstitution(indexData.peranPelapor),
        phone_number: indexData.nomorHP,
        report_datetime: formattedDateTime,
        area_description: gambaranAreaLokasi,
        area_category: kategoriKawasan,
        violation_type: jenisPelanggaran,
        violation_level: getViolationLevel(tingkatPelanggaran), // Use mapped value
        environmental_impact: dampakLingkungan,
        urgency_level: getUrgencyLevel(tingkatUrgensi), // Use mapped value
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        address: indexData.desaKecamatan,
        photos: [], // Not needed for FormData
        photoFiles: fotoLokasi, // Send actual File objects
      };

      // Check for empty strings
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

      // Final validation before submission
      if (!apiData.report_datetime || apiData.report_datetime === "") {
        alert("Error: Tanggal laporan tidak valid");
        return;
      }

      // Submit using API service
      const response = await apiService.submitSpatialPlanning(apiData);

      if (response.data.success) {
        // Clear stored data after successful submission
        clearAllData();

        toast.success("Data berhasil dikirim!");
        // Navigate to success page
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

      const files = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith("image/")
      );
      if (files.length > 0) {
        const newFiles = [...fotoLokasi, ...files];
        setFotoLokasi(newFiles);

        // Create preview URLs for new files
        files.forEach((file) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreviewUrls((prev) => [...prev, reader.result as string]);
          };
          reader.readAsDataURL(file);
        });
      }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []).filter((file) =>
        file.type.startsWith("image/")
      );
      if (files.length > 0) {
        const newFiles = [...fotoLokasi, ...files];
        setFotoLokasi(newFiles);

        // Create preview URLs for new files
        files.forEach((file) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreviewUrls((prev) => [...prev, reader.result as string]);
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
                      const newPreviewUrls = previewUrls.filter(
                        (_, i) => i !== index
                      );
                      const newFiles = fotoLokasi.filter((_, i) => i !== index);
                      setPreviewUrls(newPreviewUrls);
                      setFotoLokasi(newFiles);
                    }}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    <Icon icon="mdi:close" className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 text-center">
              {fotoLokasi.length} foto dipilih. Klik + untuk menambah foto lagi.
            </p>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon icon="mdi:cloud-upload" className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-sm font-semibold text-gray-700 mb-1">
              Upload Foto Lokasi
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
      {/* Data Kawasan */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          Identifikasi Kawasan
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Gambaran Area Lokasi / Kawasan
              <span className="text-red-500">*</span>
            </label>
            <TextareaWithMic
              value={gambaranAreaLokasi}
              onChange={(e) => setGambaranAreaLokasi(e.target.value)}
              placeholder="Contoh: Sempadan Sungai"
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.gambaranAreaLokasi
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-blue-500"
              }`}
            />
            {errors.gambaranAreaLokasi && (
              <p className="text-red-500 text-sm mt-1">
                {errors.gambaranAreaLokasi}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Kategori Kawasan<span className="text-red-500">*</span>
            </label>
            <Select value={kategoriKawasan} onValueChange={setKategoriKawasan}>
              <SelectTrigger
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all appearance-none bg-white ${
                  errors.kategoriKawasan
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-200 focus:ring-blue-500"
                }`}
              >
                <SelectValue placeholder="Pilih Kategori Kawasan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cagar budaya">Kawasan Cagar Budaya</SelectItem>
                <SelectItem value="hutan">Kawasan Hutan</SelectItem>
                <SelectItem value="pariwisata">Kawasan Pariwisata</SelectItem>
                <SelectItem value="perkebunan">Kawasan Perkebunan</SelectItem>
                <SelectItem value="permukiman">Kawasan Permukiman</SelectItem>
                <SelectItem value="pertahanan dan keamanan">Kawasan Pertahanan dan Keamanan</SelectItem>
                <SelectItem value="peruntukan industri">Kawasan Peruntukan Industri</SelectItem>
                <SelectItem value="peruntukan pertambangan batuan">Kawasan Peruntukan Pertambangan Batuan</SelectItem>
                <SelectItem value="tanaman pangan">Kawasan Tanaman Pangan</SelectItem>
                <SelectItem value="transportasi">Kawasan Transportasi</SelectItem>
                <SelectItem value="lainnya">Lainnya</SelectItem>
              </SelectContent>
            </Select>
            {errors.kategoriKawasan && (
              <p className="text-red-500 text-sm mt-1">
                {errors.kategoriKawasan}
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
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.latitude
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
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.longitude
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

      {/* Data Pelanggaran */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          Data Pelanggaran/Kerusakan
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Jenis Pelanggaran Tata Ruang<span className="text-red-500">*</span>
            </label>
            <Select
              value={jenisPelanggaran}
              onValueChange={setJenisPelanggaran}
            >
              <SelectTrigger
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all appearance-none bg-white ${
                  errors.jenisPelanggaran
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-200 focus:ring-blue-500"
                }`}
              >
                <SelectValue placeholder="Pilih Jenis Pelanggaran" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bangunan sempadan sungai">
                  Bangunan di sempadan sungai/waduk/bendungan
                </SelectItem>
                <SelectItem value="bangunan sempadan jalan">
                  Bangunan di sempadan jalan
                </SelectItem>
                <SelectItem value="alih fungsi lahan pertanian">
                  Alih fungsi lahan pertanian
                </SelectItem>
                <SelectItem value="alih fungsi ruang terbuka hijau">
                  Alih fungsi ruang terbuka hijau
                </SelectItem>
                <SelectItem value="pembangunan tanpa izin pemanfaatan ruang">
                  Pembangunan tanpa izin pemanfaatan ruang
                </SelectItem>
                <SelectItem value="lainnya">Lainnya</SelectItem>
              </SelectContent>
            </Select>
            {errors.jenisPelanggaran && (
              <p className="text-red-500 text-sm mt-1">
                {errors.jenisPelanggaran}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tingkat Pelanggaran<span className="text-red-500">*</span>
            </label>
            <Select
              value={tingkatPelanggaran}
              onValueChange={setTingkatPelanggaran}
            >
              <SelectTrigger
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all appearance-none bg-white ${
                  errors.tingkatPelanggaran
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-200 focus:ring-blue-500"
                }`}
              >
                <SelectValue placeholder="Pilih Tingkat Pelanggaran" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ringan">
                  Ringan (dapat diperbaiki cepat, fungsi kawasan masih berjalan)
                </SelectItem>
                <SelectItem value="sedang">
                  Sedang (fungsi kawasan terganggu sebagian)
                </SelectItem>
                <SelectItem value="berat">
                  Berat (fungsi kawasan hilang / tidak sesuai peruntukan)
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.tingkatPelanggaran && (
              <p className="text-red-500 text-sm mt-1">
                {errors.tingkatPelanggaran}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Dampak Lingkungan<span className="text-red-500">*</span>
            </label>
            <Select
              value={dampakLingkungan}
              onValueChange={setDampakLingkungan}
            >
              <SelectTrigger
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all appearance-none bg-white ${
                  errors.dampakLingkungan
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-200 focus:ring-blue-500"
                }`}
              >
                <SelectValue placeholder="Pilih Dampak Lingkungan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="menurunnya kualitas ruang">
                  Menurunnya kualitas ruang / ekosistem
                </SelectItem>
                <SelectItem value="potensi banjir longsor">
                  Potensi banjir / longsor
                </SelectItem>
                <SelectItem value="mengganggu aktivitas warga">
                  Mengganggu aktivitas warga
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.dampakLingkungan && (
              <p className="text-red-500 text-sm mt-1">
                {errors.dampakLingkungan}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tingkat Urgensi Penanganan<span className="text-red-500">*</span>
            </label>
            <Select value={tingkatUrgensi} onValueChange={setTingkatUrgensi}>
              <SelectTrigger
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all appearance-none bg-white ${
                  errors.tingkatUrgensi
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-200 focus:ring-blue-500"
                }`}
              >
                <SelectValue placeholder="Pilih Tingkat Urgensi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mendesak">Mendesak</SelectItem>
                <SelectItem value="biasa">Biasa</SelectItem>
              </SelectContent>
            </Select>
            {errors.tingkatUrgensi && (
              <p className="text-red-500 text-sm mt-1">
                {errors.tingkatUrgensi}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <Label className="text-sm font-semibold text-gray-700 mb-4">
              Foto Lokasi/Kerusakan<span className="text-red-500">*</span>
            </Label>
            <ImageUpload />
            {errors.fotoLokasi && (
              <p className="text-red-500 text-sm mt-1">{errors.fotoLokasi}</p>
            )}
          </div>
        </div>

        <div className="mt-8 w-full flex flex-col md:flex-row md:justify-end gap-3">
          <Button
            onClick={() => navigate("/infrastruktur")}
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
