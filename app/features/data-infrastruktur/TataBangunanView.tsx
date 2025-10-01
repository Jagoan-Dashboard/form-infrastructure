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
import { apiService } from "~/services/apiService";
import type { TataBangunanForm } from "~/types/formData";
import { Label } from "~/components/ui/label";
import { tataBangunanSchema } from "./validation/tataBangunanValidation";
import { useFormDataStore } from "~/store/formDataStore";

export function TataBangunanView() {
  const [position, setPosition] = useState<[number, number]>([
    -7.4034, 111.4464,
  ]); // Default: Ngawi
  const [latitude, setLatitude] = useState("-7.4034");
  const [longitude, setLongitude] = useState("111.4464");
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Form states
  const [namaBangunan, setNamaBangunan] = useState("");
  const [jenisBangunan, setJenisBangunan] = useState("");
  const [statusLaporan, setStatusLaporan] = useState("");
  const [sumberDana, setSumberDana] = useState("");
  const [tahunPembangunan, setTahunPembangunan] = useState("");
  const [alamatLengkap, setAlamatLengkap] = useState("");
  const [luasLantai, setLuasLantai] = useState("");
  const [jumlahLantai, setJumlahLantai] = useState("");
  const [jenisPekerjaan, setJenisPekerjaan] = useState("");
  const [kondisiSetelahRehabilitasi, setKondisiSetelahRehabilitasi] =
    useState("");
  const [fotoKerusakan, setFotoKerusakan] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Error states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    if (!isSecureContext) {
      console.warn(
        "Geolocation might not work properly in non-HTTPS environment"
      );
    }

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
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  const validateForm = () => {
    try {
      tataBangunanSchema.parse({
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
  const mapFormToApiData = (): TataBangunanForm & {
    photoFiles?: File[];
    reporter_name: string;
    reporter_role: string;
    village: string;
    district: string;
  } => {
    return {
      // Reporter info from index form
      reporter_name: indexData?.namaPelapor || "Default Reporter",
      reporter_role: indexData?.jabatan || "Public",
      village: indexData?.desaKecamatan || "Default Village",
      district: indexData?.desaKecamatan || "Default District",

      // Building identification
      building_name: namaBangunan,
      building_type: jenisBangunan,
      report_status: statusLaporan,
      funding_source: sumberDana,
      last_year_construction: parseInt(tahunPembangunan),

      // Technical data
      full_address: alamatLengkap,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      floor_area: parseFloat(luasLantai),
      floor_count: jumlahLantai,

      // Optional rehabilitation data
      work_type: jenisPekerjaan || "",
      condition_after_rehab: kondisiSetelahRehabilitasi || "",

      // Photos as string array (base64 or URLs - but we'll use files)
      photos: previewUrls,

      // Actual files for upload
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
      const response = await apiService.submitBuildingReport(apiData);

      if (response.data.success) {
        navigate("/success");
      } else {
        throw new Error(response.data.message || "Submission failed");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Terjadi kesalahan saat mengirim data";
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

      const files = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith("image/")
      );
      if (files.length > 0) {
        const newFiles = [...fotoKerusakan, ...files];
        setFotoKerusakan(newFiles);

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
        const newFiles = [...fotoKerusakan, ...files];
        setFotoKerusakan(newFiles);

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
                      const newFiles = fotoKerusakan.filter(
                        (_, i) => i !== index
                      );
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
              {fotoKerusakan.length} foto dipilih. Klik + untuk menambah foto
              lagi.
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
      {/* Data Bangunan */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          Identifikasi Bangunan
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nama Bangunan
              <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={namaBangunan}
              onChange={(e) => setNamaBangunan(e.target.value)}
              placeholder="Contoh: SMA Negeri"
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.namaBangunan
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-blue-500"
              }`}
            />
            {errors.namaBangunan && (
              <p className="text-red-500 text-sm mt-1">{errors.namaBangunan}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Jenis Bangunan yang Dilaporkan
              <span className="text-red-500">*</span>
            </label>
            <Select value={jenisBangunan} onValueChange={setJenisBangunan}>
              <SelectTrigger
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all appearance-none bg-white ${
                  errors.jenisBangunan
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-200 focus:ring-blue-500"
                }`}
              >
                <SelectValue placeholder="Pilih Jenis Bangunan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kantor pemerintah">
                  Kantor Pemerintah
                </SelectItem>
                <SelectItem value="sekolah">Sekolah</SelectItem>
                <SelectItem value="puskesmas/posyandu">
                  Puskesmas/Posyandu
                </SelectItem>
                <SelectItem value="pasar">Pasar</SelectItem>
                <SelectItem value="sarana olahraga/gedung serbaguna">Sarana Olahraga/Gedung Serbaguna</SelectItem>
                <SelectItem value="fasilitas umum lainnya">
                  Fasilitas Umum Lainnya
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.jenisBangunan && (
              <p className="text-red-500 text-sm mt-1">
                {errors.jenisBangunan}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Status Laporan<span className="text-red-500">*</span>
            </label>
            <Select value={statusLaporan} onValueChange={setStatusLaporan}>
              <SelectTrigger
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all appearance-none bg-white ${
                  errors.statusLaporan
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-200 focus:ring-blue-500"
                }`}
              >
                <SelectValue placeholder="Pilih Status Laporan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rehabilitasi perbaikan">
                  Rehabilitasi/Perbaikan
                </SelectItem>
                <SelectItem value="pembangunan baru">
                  Pembangunan Baru
                </SelectItem>
                <SelectItem value="lainnya">Lainnya</SelectItem>
              </SelectContent>
            </Select>
            {errors.statusLaporan && (
              <p className="text-red-500 text-sm mt-1">
                {errors.statusLaporan}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Sumber Dana<span className="text-red-500">*</span>
            </label>
            <Select value={sumberDana} onValueChange={setSumberDana}>
              <SelectTrigger
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all appearance-none bg-white ${
                  errors.sumberDana
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-200 focus:ring-blue-500"
                }`}
              >
                <SelectValue placeholder="Pilih Sumber Dana" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apbd kabupaten">APBD Kabupaten</SelectItem>
                <SelectItem value="apbd provinsi">APBD Provinsi</SelectItem>
                <SelectItem value="apbn">APBN</SelectItem>
                <SelectItem value="dana desa">Dana Desa</SelectItem>
                <SelectItem value="swadaya masyarakat">
                  Swadaya Masyarakat
                </SelectItem>
                <SelectItem value="lainnya">
                  Lainnya
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.sumberDana && (
              <p className="text-red-500 text-sm mt-1">{errors.sumberDana}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tahun Pembangunan/Rehabilitasi Terakhir
              <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={tahunPembangunan}
              onChange={(e) => setTahunPembangunan(e.target.value)}
              placeholder="Contoh: 2010"
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.tahunPembangunan
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-blue-500"
              }`}
            />
            {errors.tahunPembangunan && (
              <p className="text-red-500 text-sm mt-1">
                {errors.tahunPembangunan}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Data Teknis */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          Data Teknis Lokasi
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Alamat Lengkap
              <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={alamatLengkap}
              onChange={(e) => setAlamatLengkap(e.target.value)}
              placeholder="Contoh: Jl. Al-Hilal No.13, Sobo, Banyuwangi"
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.alamatLengkap
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-blue-500"
              }`}
            />
            {errors.alamatLengkap && (
              <p className="text-red-500 text-sm mt-1">
                {errors.alamatLengkap}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Luas Lantai (m<sup>2</sup>)<span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={luasLantai}
              onChange={(e) => setLuasLantai(e.target.value)}
              placeholder="Contoh: 500"
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.luasLantai
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-blue-500"
              }`}
            />
            {errors.luasLantai && (
              <p className="text-red-500 text-sm mt-1">{errors.luasLantai}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Jumlah Lantai<span className="text-red-500">*</span>
            </label>
            <Select value={jumlahLantai} onValueChange={setJumlahLantai}>
              <SelectTrigger
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all appearance-none bg-white ${
                  errors.jumlahLantai
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-200 focus:ring-blue-500"
                }`}
              >
                <SelectValue placeholder="Pilih Jumlah Lantai" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="lainnya">Lainnya</SelectItem>
              </SelectContent>
            </Select>
            {errors.jumlahLantai && (
              <p className="text-red-500 text-sm mt-1">{errors.jumlahLantai}</p>
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

      {/* Data Pelanggaran */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          Detail Kerusakan
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Jenis Pekerjaan (jika rehabilitasi)*
            </label>
            <Select value={jenisPekerjaan} onValueChange={setJenisPekerjaan}>
              <SelectTrigger
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all appearance-none bg-white ${
                  errors.jenisPekerjaan
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-200 focus:ring-blue-500"
                }`}
              >
                <SelectValue placeholder="Pilih Jenis Pekerjaan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="perbaikan atap">Perbaikan Atap</SelectItem>
                <SelectItem value="perbaikan dinding/cat">
                  Perbaikan Dinding/Cat
                </SelectItem>
                <SelectItem value="perbaikan pintu jendela">
                  Perbaikan Pintu/Jendela
                </SelectItem>
                <SelectItem value="perbaikan sanitasi mck">
                  Perbaikan Sanitasi/MCK
                </SelectItem>
                <SelectItem value="perbaikan listrik/air">
                  Perbaikan Listrik/Air
                </SelectItem>
                <SelectItem value="lainnya">Lainnya</SelectItem>
              </SelectContent>
            </Select>
            {errors.jenisPekerjaan && (
              <p className="text-red-500 text-sm mt-1">
                {errors.jenisPekerjaan}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Kondisi Setelah Rehabilitasi*
            </label>
            <Select
              value={kondisiSetelahRehabilitasi}
              onValueChange={setKondisiSetelahRehabilitasi}
            >
              <SelectTrigger
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all appearance-none bg-white ${
                  errors.kondisiSetelahRehabilitasi
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-200 focus:ring-blue-500"
                }`}
              >
                <SelectValue placeholder="Pilih Kondisi Setelah Rehabilitasi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="baik siap pakai">
                  Baik & Siap Pakai
                </SelectItem>
                <SelectItem value="masih membutuhkan perbaikan tambahan">
                  Masih Membutuhkan Perbaikan Tambahan
                </SelectItem>
                <SelectItem value="lainnya">Lainnya</SelectItem>
              </SelectContent>
            </Select>
            {errors.kondisiSetelahRehabilitasi && (
              <p className="text-red-500 text-sm mt-1">
                {errors.kondisiSetelahRehabilitasi}
              </p>
            )}
          </div>

          {/* Foto Lokasi */}
          <div className="md:col-span-2">
            <Label className="text-sm font-semibold text-gray-700 mb-4">
              Foto Kerusakan*
            </Label>
            <ImageUpload />
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
