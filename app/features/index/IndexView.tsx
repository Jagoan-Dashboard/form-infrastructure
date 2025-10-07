import z from "zod";
import { useEffect, useState } from "react";
import Maps from "./components/Maps";
import { Icon } from "@iconify/react";
import { CalendarIcon } from "lucide-react";
import Banner from "./components/Banner";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";
import { id as idLocale } from "date-fns/locale/id";
import { Calendar } from "~/components/ui/calendar";
import { useNavigate } from "react-router";
import { indexViewSchema } from "./validation/validation";
import { useFormDataStore } from "~/store/formDataStore";
import { InputWithMic } from "~/components/InputWithMic";

export function IndexView() {
  const [position, setPosition] = useState<[number, number]>([
    -7.4034, 111.4464,
  ]);
  const [latitude, setLatitude] = useState("-7.4034");
  const [longitude, setLongitude] = useState("111.4464");
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [namaPelapor, setNamaPelapor] = useState("");
  const [nomorHP, setNomorHP] = useState("");
  const [peranPelapor, setPeranPelapor] = useState("");
  const [desaKecamatan, setDesaKecamatan] = useState("");
  const [date, setDate] = useState<Date>();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { setIndexData, getIndexData } = useFormDataStore();

    // Load data from localStorage on mount
    useEffect(() => {
      const savedData = getIndexData();
      if (savedData) {
        setLatitude(savedData.latitude || "-7.4034");
        setLongitude(savedData.longitude || "111.4464");
        setNamaPelapor(savedData.namaPelapor || "");
        setNomorHP(savedData.nomorHP || "");
        setPeranPelapor(savedData.peranPelapor || "");
        setDesaKecamatan(savedData.desaKecamatan || "");
        if (savedData.tanggalLaporan) {
          setDate(new Date(savedData.tanggalLaporan));
        }
  
        // Update position from saved data
        const lat = parseFloat(savedData.latitude);
        const lng = parseFloat(savedData.longitude);
        if (!isNaN(lat) && !isNaN(lng)) {
          setPosition([lat, lng]);
        }
      }
    }, [getIndexData]);

  useEffect(() => {
    if (position) {
      setLatitude(position[0].toString());
      setLongitude(position[1].toString());
    }
  }, [position]);

  const handleLatitudeChange = (value: string) => {
    setLatitude(value);
    const lat = parseFloat(value);
    if (!isNaN(lat) && !isNaN(parseFloat(longitude))) {
      setPosition([lat, parseFloat(longitude)]);
    }
  };

  const handleLongitudeChange = (value: string) => {
    setLongitude(value);
    const lng = parseFloat(value);
    if (!isNaN(lng) && !isNaN(parseFloat(latitude))) {
      setPosition([parseFloat(latitude), lng]);
    }
  };

  const aktivasiLokasi = () => {
    setIsLoadingLocation(true);

    // Check if geolocation is supported
    if (!("geolocation" in navigator)) {
      alert("Geolocation tidak didukung oleh browser Anda.");
      setIsLoadingLocation(false);
      return;
    }

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

  const formatIndonesianLong = (date: Date) => {
    const bulan = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    return `${date.getDate()} ${bulan[date.getMonth()]} ${date.getFullYear()}`;
  };

  const validateForm = () => {
    try {
      indexViewSchema.parse({
        latitude,
        longitude,
        namaPelapor,
        nomorHP,
        peranPelapor,
        tanggalLaporan: date,
        desaKecamatan,
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

  const handleSubmit = () => {
    if (validateForm()) {
      const formData = {
        latitude,
        longitude,
        namaPelapor,
        nomorHP,
        peranPelapor,
        tanggalLaporan: date || null,
        desaKecamatan,
      };

      setIndexData(formData);

      navigate("/infrastruktur");
    }
  };

  return (
    <main className="space-y-6">
      <div className="hidden sm:block">
        <Banner />
      </div>

      {/* Koordinat Lokasi */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            Koordinat Lokasi
          </h3>
        </div>

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

      {/* Data Pelapor */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          Data Pelapor
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nama Pelapor<span className="text-red-500">*</span>
            </label>
            <InputWithMic
              type="text"
              value={namaPelapor}
              onChange={(e) => setNamaPelapor(e.target.value)}
              placeholder="Contoh: Samsudin"
              enableVoice={true}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.namaPelapor
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-blue-500"
              }`}
            />
            {errors.namaPelapor && (
              <p className="text-red-500 text-sm mt-1">{errors.namaPelapor}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nomor HP/WA<span className="text-red-500">*</span>
            </label>
            <InputWithMic
              type="text"
              value={nomorHP}
              onChange={(e) => setNomorHP(e.target.value)}
              placeholder="Contoh: 08xx5xxxxxxx"
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.nomorHP
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-blue-500"
              }`}
            />
            {errors.nomorHP && (
              <p className="text-red-500 text-sm mt-1">{errors.nomorHP}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tanggal Laporan<span className="text-red-500">*</span>
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal px-4 py-6 rounded-xl hover:bg-gray-50 focus:ring-2 focus:border-transparent transition-all",
                    errors.tanggalLaporan
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-200 focus:ring-blue-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-5 w-5 text-gray-400" />
                  {date ? (
                    <span className="text-gray-900">
                      {formatIndonesianLong(date)}
                    </span>
                  ) : (
                    <span
                      className={`${errors.tanggalLaporan ? "text-red-500" : "text-gray-400"}`}
                    >
                      Pilih tanggal Laporan
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 rounded-2xl border-gray-200"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  locale={idLocale}
                  className="rounded-2xl"
                />
              </PopoverContent>
            </Popover>
            {errors.tanggalLaporan && (
              <p className="text-red-500 text-sm mt-1">
                {errors.tanggalLaporan}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Peran Pelapor<span className="text-red-500">*</span>
            </label>
            <Select value={peranPelapor} onValueChange={setPeranPelapor}>
              <SelectTrigger
                className={`w-full px-4 py-3 rounded-xl focus:ring-2 focus:border-transparent transition-all appearance-none bg-white ${
                  errors.peranPelapor
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-200 focus:ring-blue-500"
                }`}
              >
                <SelectValue placeholder="Pilih Peran Pelapor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Perangkat Desa">Perangkat Desa</SelectItem>
                <SelectItem value="Dinas">OPD / Dinas Terkait</SelectItem>
                <SelectItem value="Kelompok Masyarakat">
                  Kelompok Masyarakat
                </SelectItem>
                <SelectItem value="Masyarakan Umum">Masyarakat Umum</SelectItem>
              </SelectContent>
            </Select>
            {errors.peranPelapor && (
              <p className="text-red-500 text-sm mt-1">{errors.peranPelapor}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Desa/Kecamatan<span className="text-red-500">*</span>
            </label>
            <Select value={desaKecamatan} onValueChange={setDesaKecamatan}>
              <SelectTrigger
                className={`w-full px-4 py-3 rounded-xl focus:ring-2 focus:border-transparent transition-all appearance-none bg-white ${
                  errors.desaKecamatan
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-200 focus:ring-blue-500"
                }`}
              >
                <SelectValue placeholder="Pilih Desa/Kecamatan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Bringin">Bringin</SelectItem>
                <SelectItem value="Geneng">Geneng</SelectItem>
                <SelectItem value="Gerih">Gerih</SelectItem>
                <SelectItem value="Jogorogo">Jogorogo</SelectItem>
                <SelectItem value="Karanganyar">Karanganyar</SelectItem>
                <SelectItem value="Karangjati">Karangjati</SelectItem>
                <SelectItem value="Kasreman">Kasreman</SelectItem>
                <SelectItem value="Kendal">Kendal</SelectItem>
                <SelectItem value="Kendal">Kendal</SelectItem>
                <SelectItem value="Kedunggalar">Kedunggalar</SelectItem>
                <SelectItem value="Kwadungan">Kwadungan</SelectItem>
                <SelectItem value="Mantingan">Mantingan</SelectItem>
                <SelectItem value="Ngawi">Ngawi</SelectItem>
                <SelectItem value="Ngrambe">Ngrambe</SelectItem>
                <SelectItem value="Pedas">Pedas</SelectItem>
                <SelectItem value="Pangkur">Pangkur</SelectItem>
                <SelectItem value="Paron">Paron</SelectItem>
                <SelectItem value="Pitu">Pitu</SelectItem>
                <SelectItem value="Sine">Sine</SelectItem>
                <SelectItem value="Widodaren">Widodaren</SelectItem>
              </SelectContent>
            </Select>
            {errors.desaKecamatan && (
              <p className="text-red-500 text-sm mt-1">
                {errors.desaKecamatan}
              </p>
            )}
          </div>

          <div className="mt-8 flex w-full justify-end sm:max-w-full">
            <Button
              onClick={handleSubmit}
              className="bg-blue-600 sm:w-fit cursor-pointer w-full hover:bg-blue-700 text-white font-semibold py-6 px-10 rounded-xl transition-all duration-200 shadow-lg flex items-center gap-2"
            >
              Selanjutnya
              <Icon icon="material-symbols:chevron-right" className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
