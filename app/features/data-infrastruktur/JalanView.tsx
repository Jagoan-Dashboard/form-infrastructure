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
import { jalanSchema } from "./validation/jalanValidation";
import { apiService } from "~/services/apiService";
import type { BinamargaJalanForm } from "~/types/formData";
import { useFormDataStore } from "~/store/formDataStore";

export function JalanView() {
  const [position, setPosition] = useState<[number, number]>([
    -7.4034, 111.4464,
  ]); // Default: Ngawi
  const [latitude, setLatitude] = useState("-7.4034");
  const [longitude, setLongitude] = useState("111.4464");
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Form states
  const [namaRuasJalan, setNamaRuasJalan] = useState("");
  const [jenisJalan, setJenisJalan] = useState("");
  const [panjangSegmen, setPanjangSegmen] = useState("");
  const [klasifikasiFungsi, setKlasifikasiFungsi] = useState("");
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
      jalanSchema.parse({
        latitude,
        longitude,
        namaRuasJalan,
        jenisJalan,
        panjangSegmen,
        klasifikasiFungsi,
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
  const mapFormToApiData = (): BinamargaJalanForm & { photoFiles?: File[] } => {
    // Map form values to backend field names
    const getRoadTypeMapping = (formValue: string): string => {
      const mapping: Record<string, string> = {
        'jalan-nasional': 'JALAN_NASIONAL',
        'jalan-provinsi': 'JALAN_PROVINSI',
        'jalan-kabupaten': 'JALAN_KABUPATEN',
        'jalan-desa': 'JALAN_DESA'
      };
      return mapping[formValue] || formValue.toUpperCase();
    };

    const getRoadClassMapping = (formValue: string): string => {
      const mapping: Record<string, string> = {
        'arteri': 'ARTERI',
        'kolektor': 'KOLEKTOR',
        'lokal': 'LOKAL',
        'lingkungan': 'LINGKUNGAN'
      };
      return mapping[formValue] || formValue.toUpperCase();
    };

    const getPavementTypeMapping = (formValue: string): string => {
      const mapping: Record<string, string> = {
        'aspal': 'ASPAL_FLEXIBLE',
        'beton': 'BETON_RIGID',
        'paving': 'PAVING',
        'jalan-tanah': 'JALAN_TANAH'
      };
      return mapping[formValue] || formValue.toUpperCase();
    };

    const getUrgencyMapping = (formValue: string): string => {
      const mapping: Record<string, string> = {
        'darurat': 'DARURAT',
        'cepat': 'CEPAT',
        'rutin': 'RUTIN'
      };
      return mapping[formValue] || formValue.toUpperCase();
    };

    return {
      // Reporter info from index form
      reporter_name: indexData?.namaPelapor || "Default Reporter",
      institution_unit: "DINAS", // Default value
      phone_number: indexData?.nomorHP || "000000000000",
      report_datetime: indexData?.tanggalLaporan?.toISOString() || new Date().toISOString(),

      // Road identification
      road_name: namaRuasJalan,
      road_type: getRoadTypeMapping(jenisJalan),
      road_class: getRoadClassMapping(klasifikasiFungsi),
      segment_length: parseFloat(panjangSegmen) || 0,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),

      // Damage details
      pavement_type: getPavementTypeMapping(jenisPerkerasan),
      damage_type: jenisKerusakan,
      damage_level: tingkatKerusakan.toUpperCase(),
      damaged_length: parseFloat(panjangKerusakan) || 0,
      damaged_width: parseFloat(lebarKerusakan) || 0,
      total_damaged_area: parseFloat(totalLuasKerusakan) || 0,

      // Traffic impact
      traffic_condition: kondisiLaluLintas,
      daily_traffic_volume: parseInt(volumeLaluLintas) || 0,
      urgency_level: getUrgencyMapping(kategoriPrioritas),

      // Photos
      photos: previewUrls,
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
      console.log('Submitting Binamarga Jalan data:', apiData);

      const response = await apiService.submitBinamargaJalan(apiData);

      if (response.data.success) {
        console.log('\u2705 Binamarga Jalan submission successful:', response.data);
        navigate("/submit");
      } else {
        throw new Error(response.data.message || 'Submission failed');
      }
    } catch (error: any) {
      console.error('\u274c Binamarga Jalan submission error:', error);
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
          Informasi Ruas Jalan
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nama Ruas Jalan/Kode Ruas
              <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={namaRuasJalan}
              onChange={(e) => setNamaRuasJalan(e.target.value)}
              placeholder="Contoh: Ruas Ngawi-Karangjati-20"
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.namaRuasJalan
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-blue-500"
              }`}
            />
            {errors.namaRuasJalan && (
              <p className="text-red-500 text-sm mt-1">{errors.namaRuasJalan}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Jenis Jalan<span className="text-red-500">*</span>
            </label>
            <Select value={jenisJalan} onValueChange={setJenisJalan}>
              <SelectTrigger className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all appearance-none bg-white ${
                errors.jenisJalan
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-blue-500"
              }`}>
                <SelectValue placeholder="Pilih Jenis Jalan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jalan-nasional">Jalan Nasional</SelectItem>
                <SelectItem value="jalan-provinsi">Jalan Provinsi</SelectItem>
                <SelectItem value="jalan-kabupaten">Jalan Kabupaten</SelectItem>
                <SelectItem value="jalan-desa">Jalan Desa</SelectItem>
              </SelectContent>
            </Select>
            {errors.jenisJalan && (
              <p className="text-red-500 text-sm mt-1">{errors.jenisJalan}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Panjang Segmen yang Diperiksa (m)
              <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={panjangSegmen}
              onChange={(e) => setPanjangSegmen(e.target.value)}
              placeholder="Contoh: 2785"
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.panjangSegmen
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-blue-500"
              }`}
            />
            {errors.panjangSegmen && (
              <p className="text-red-500 text-sm mt-1">{errors.panjangSegmen}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Klasifikasi Fungsi Jalan<span className="text-red-500">*</span>
            </label>
            <Select value={klasifikasiFungsi} onValueChange={setKlasifikasiFungsi}>
              <SelectTrigger className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all appearance-none bg-white ${
                errors.klasifikasiFungsi
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-blue-500"
              }`}>
                <SelectValue placeholder="Pilih Klasifikasi Fungsi Jalan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="arteri">Arteri</SelectItem>
                <SelectItem value="kolektor">Kolektor</SelectItem>
                <SelectItem value="lokal">Lokal</SelectItem>
                <SelectItem value="lingkungan">Lingkungan</SelectItem>
              </SelectContent>
            </Select>
            {errors.klasifikasiFungsi && (
              <p className="text-red-500 text-sm mt-1">{errors.klasifikasiFungsi}</p>
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
          Data Teknis Perkerasan Jalan
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Jenis Perkerasan*
            </label>
            <Select value={jenisPerkerasan} onValueChange={setJenisPerkerasan}>
              <SelectTrigger className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all appearance-none bg-white ${
                errors.jenisPerkerasan
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-blue-500"
              }`}>
                <SelectValue placeholder="Pilih Jenis Perkerasan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aspal">Aspal</SelectItem>
                <SelectItem value="beton">Beton</SelectItem>
                <SelectItem value="paving">Paving</SelectItem>
                <SelectItem value="jalan-tanah">Jalan Tanah</SelectItem>
              </SelectContent>
            </Select>
            {errors.jenisPerkerasan && (
              <p className="text-red-500 text-sm mt-1">{errors.jenisPerkerasan}</p>
            )}
          </div>

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
                <SelectItem value="lubang">Lubang (Potholes)</SelectItem>
                <SelectItem value="retak-buaya">
                  Retak Buaya (Aligator Cracking)
                </SelectItem>
                <SelectItem value="amblas-longsor">Amblas/Longsor</SelectItem>
                <SelectItem value="permukaan-aus">Permukaan Aus/Raveling</SelectItem>
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
                <SelectItem value="ringan">Ringan</SelectItem>
                <SelectItem value="sedang">Sedang</SelectItem>
                <SelectItem value="berat">Berat</SelectItem>
              </SelectContent>
            </Select>
            {errors.tingkatKerusakan && (
              <p className="text-red-500 text-sm mt-1">{errors.tingkatKerusakan}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Panjang Kerusakan (m)*
            </label>
            <Input
              type="text"
              value={panjangKerusakan}
              onChange={(e) => setPanjangKerusakan(e.target.value)}
              placeholder="Contoh: 10"
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all ${
                errors.panjangKerusakan
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-blue-500"
              }`}
            />
            {errors.panjangKerusakan && (
              <p className="text-red-500 text-sm mt-1">{errors.panjangKerusakan}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Lebar Kerusakan (m)*
            </label>
            <Input
              type="text"
              value={lebarKerusakan}
              onChange={(e) => setLebarKerusakan(e.target.value)}
              placeholder="Contoh: 2"
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all ${
                errors.lebarKerusakan
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-blue-500"
              }`}
            />
            {errors.lebarKerusakan && (
              <p className="text-red-500 text-sm mt-1">{errors.lebarKerusakan}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Total Luas Kerusakan (m<sup>2</sup>)*
            </label>
            <Input
              type="text"
              value={totalLuasKerusakan}
              onChange={(e) => setTotalLuasKerusakan(e.target.value)}
              placeholder="Contoh: 20"
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all ${
                errors.totalLuasKerusakan
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-blue-500"
              }`}
            />
            {errors.totalLuasKerusakan && (
              <p className="text-red-500 text-sm mt-1">{errors.totalLuasKerusakan}</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          Dampak & Urgensi
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Kondisi Lalu Lintas Saat ini*
            </label>
            <Select value={kondisiLaluLintas} onValueChange={setKondisiLaluLintas}>
              <SelectTrigger className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all appearance-none bg-white ${
                errors.kondisiLaluLintas
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-blue-500"
              }`}>
                <SelectValue placeholder="Pilih Kondisi Lalu Lintas Saat ini" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="masih-bisa-dilalui">Masih Bisa Dilalui</SelectItem>
                <SelectItem value="satu-jalur">
                  Hanya Satu Jalur Bisa Dilalui
                </SelectItem>
                <SelectItem value="tidak-bisa-dilalui">
                  Tidak Bisa Dilalui/Jalan Putus
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.kondisiLaluLintas && (
              <p className="text-red-500 text-sm mt-1">{errors.kondisiLaluLintas}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Volume Lalu Lintas Harian
              <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={volumeLaluLintas}
              onChange={(e) => setVolumeLaluLintas(e.target.value)}
              placeholder="Contoh: 200"
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all ${
                errors.volumeLaluLintas
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-blue-500"
              }`}
            />
            {errors.volumeLaluLintas && (
              <p className="text-red-500 text-sm mt-1">{errors.volumeLaluLintas}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Kategori Prioritas Penanganan*
            </label>
            <Select value={kategoriPrioritas} onValueChange={setKategoriPrioritas}>
              <SelectTrigger className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all appearance-none bg-white ${
                errors.kategoriPrioritas
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-blue-500"
              }`}>
                <SelectValue placeholder="Pilih Kategori Prioritas Penanganan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="darurat">Darurat</SelectItem>
                <SelectItem value="cepat">Cepat</SelectItem>
                <SelectItem value="rutin">Rutin</SelectItem>
              </SelectContent>
            </Select>
            {errors.kategoriPrioritas && (
              <p className="text-red-500 text-sm mt-1">{errors.kategoriPrioritas}</p>
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

        {/* Error Message */}
        {submitError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 text-sm font-medium">{submitError}</p>
          </div>
        )}

        <div className="mt-8 flex w-full justify-end gap-3">
          <Button
            onClick={() => navigate("/infrastruktur/binamarga")}
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
