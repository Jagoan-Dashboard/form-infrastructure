import { useEffect, useState } from "react";
import Maps from "./components/Maps";
import { Icon } from "@iconify/react";
import Banner from "./components/Banner";
import { Input } from "~/components/ui/input";
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
import { useStepStore } from "~/store/stepStore";
import { useNavigate } from "react-router";

export function IndexView() {
  const [position, setPosition] = useState<[number, number]>([
    -7.4034, 111.4464,
  ]); // Default: Ngawi
  const [latitude, setLatitude] = useState("-7.4034");
  const [longitude, setLongitude] = useState("111.4464");
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [date, setDate] = useState<Date>();
  const navigate = useNavigate();

  //   {
  //     number: 1,
  //     title: "Data Pelapor",
  //     desc: "Masukan identitas Pelapor dan petani",
  //   },
  //   {
  //     number: 2,
  //     title: "Komoditas",
  //     desc: "Pilih jenis komoditas yang ditanam",
  //   },
  //   {
  //     number: 3,
  //     title: "Data Komoditas",
  //     desc: "Lengkapi informasi detail terkait komoditas",
  //   },
  //   {
  //     number: 4,
  //     title: "Aspirasi Petani",
  //     desc: "Bagikan aspirasi dan masukan dari petani",
  //   },
  // ];

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
                Latitude*
              </label>
              <Input
                type="text"
                value={latitude}
                onChange={(e) => handleLatitudeChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="-7.4034"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Longitude*
              </label>
              <Input
                type="text"
                value={longitude}
                onChange={(e) => handleLongitudeChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="111.4464"
              />
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
              Nama Pelapor*
            </label>
            <Input
              type="text"
              placeholder="Contoh: Samsudin"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nomor HP/WA*
            </label>
            <Input
              type="text"
              placeholder="Contoh: 085179551746"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tanggal Laporan*
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal px-4 py-6 border-gray-200 rounded-xl hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
                    !date && "text-gray-500"
                  )}
                >
                  <Icon
                    icon="material-symbols:calendar"
                    className="mr-2 h-5 w-5 text-gray-400"
                  />
                  {date ? (
                    <span className="text-gray-900">
                      {formatIndonesianLong(date)}
                    </span>
                  ) : (
                    <span className="text-gray-400">
                      Pilih tanggal kunjungan
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
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Peran Pelapor*
            </label>
            <Select>
              <SelectTrigger className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white">
                <SelectValue placeholder="Pilih Peran Pelapor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desa-a">Perangkat Desa</SelectItem>
                <SelectItem value="desa-b">OPD / Dinas Terkait</SelectItem>
                <SelectItem value="desa-b">Kelompok Masyarakat</SelectItem>
                <SelectItem value="desa-b">Masyarakat Umum</SelectItem>
                <SelectItem value="desa-b"></SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Desa/Kecamatan*
            </label>
            <Select>
              <SelectTrigger className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white">
                <SelectValue placeholder="Pilih Desa/Kecamatan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desa-a">Desa A</SelectItem>
                <SelectItem value="desa-b">Desa B</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-8 flex w-full justify-end ">
          <Button
            onClick={() => navigate("/infrastruktur")}
            className="bg-blue-600 sm:w-fit cursor-pointer w-full hover:bg-blue-700 text-white font-semibold py-6 px-10 rounded-xl transition-all duration-200 shadow-lg flex items-center gap-2"
          >
            Selanjutnya
            <Icon icon="material-symbols:chevron-right" className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </main>
  );
}
