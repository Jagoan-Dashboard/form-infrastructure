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

export function JalanView() {
  const [position, setPosition] = useState<[number, number]>([
    -7.4034, 111.4464,
  ]); // Default: Ngawi
  const [latitude, setLatitude] = useState("-7.4034");
  const [longitude, setLongitude] = useState("111.4464");
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const navigate = useNavigate();

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

  function ImageUpload() {
    const [isDragging, setIsDragging] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

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

      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
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
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setPreview(null);
              }}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
            >
              <Icon icon="mdi:close" className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon icon="mdi:cloud-upload" className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-sm font-semibold text-gray-700 mb-1">
              Upload Foto Pertumbuhan
            </p>
            <p className="text-xs text-gray-500">
              Drag & drop atau klik untuk upload
            </p>
            <p className="text-xs text-gray-400 mt-2">
              PNG, JPG, JPEG (Max 5MB)
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
              placeholder="Contoh: Ruas Ngawi-Karangjati-20"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Jenis Jalan<span className="text-red-500">*</span>
            </label>
            <Select>
              <SelectTrigger className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white">
                <SelectValue placeholder="Pilih Jenis Jalan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cagar-budaya">Jalan Nasional</SelectItem>
                <SelectItem value="hutan">Jalan Provinsi</SelectItem>
                <SelectItem value="pariwisata">Jalan Kabupaten</SelectItem>
                <SelectItem value="perkebunan">Jalan Desa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Panjang Segmen yang Diperiksa (m)
              <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              placeholder="Contoh: 2785"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Klasifikasi Fungsi Jalan<span className="text-red-500">*</span>
            </label>
            <Select>
              <SelectTrigger className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white">
                <SelectValue placeholder="Pilih Klasifikasi Fungsi Jalan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cagar-budaya">Arteri</SelectItem>
                <SelectItem value="hutan">Kolektor</SelectItem>
                <SelectItem value="pariwisata">Lokal</SelectItem>
                <SelectItem value="perkebunan">Lingkungan</SelectItem>
              </SelectContent>
            </Select>
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
            <Select>
              <SelectTrigger className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white">
                <SelectValue placeholder="Pilih Jenis Perkerasan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desa-a">Aspal</SelectItem>
                <SelectItem value="desa-b">Beton</SelectItem>
                <SelectItem value="desa-b">Paving</SelectItem>
                <SelectItem value="desa-b">Jalan Tanah</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Jenis Kerusakan*
            </label>
            <Select>
              <SelectTrigger className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white">
                <SelectValue placeholder="Pilih Jenis Kerusakan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desa-a">Lubang (Potholes)</SelectItem>
                <SelectItem value="desa-b">
                  Retak Buaya (Aligator Cracking)
                </SelectItem>
                <SelectItem value="desa-b">Amblas/Longsor</SelectItem>
                <SelectItem value="desa-b">Permukaan Aus/Raveling</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tingkat Kerusakan*
            </label>
            <Select>
              <SelectTrigger className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white">
                <SelectValue placeholder="Pilih Tingkat Pelanggaran" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desa-a">Ringan</SelectItem>
                <SelectItem value="desa-b">Sedang</SelectItem>
                <SelectItem value="desa-b">Berat</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Panjang Kerusakan (m)*
            </label>
            <Input
              type="text"
              placeholder="Contoh: 10"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Lebar Kerusakan (m)*
            </label>
            <Input
              type="text"
              placeholder="Contoh: 2"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Total Luas Kerusakan (m<sup>2</sup>)*
            </label>
            <Input
              type="text"
              placeholder="Contoh: 20"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
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
            <Select>
              <SelectTrigger className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white">
                <SelectValue placeholder="Pilih Kondisi Lalu Lintas Saat ini" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desa-a">Masih Bisa Dilalui</SelectItem>
                <SelectItem value="desa-b">Hanya Satu Jalur Bisa Dilalui</SelectItem>
                <SelectItem value="desa-b">Tidak Bisa Dilalui/Jalan Putus</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Volume Lalu Lintas Harian
              <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              placeholder="Contoh: 200"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Kategori Prioritas Penanganan*
            </label>
            <Select>
              <SelectTrigger className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white">
                <SelectValue placeholder="Pilih Kategori Prioritas Penanganan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desa-a">Darurat</SelectItem>
                <SelectItem value="desa-b">Cepat</SelectItem>
                <SelectItem value="desa-b">Rutin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Foto Lokasi */}
          <div className="col-span-2">
            <Label className="text-sm font-semibold text-gray-700 mb-4">
              Foto Lokasi/Kerusakan*
            </Label>
            <ImageUpload />
          </div>

          {/* Upload Button - Mobile */}
          <div className="mt-6 md:hidden">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 rounded-xl">
              <Icon icon="mdi:upload" className="w-5 h-5 mr-2" />
              Unggah
            </Button>
          </div>
        </div>

        <div className="mt-8 flex w-full justify-end gap-3">
          <Button
            onClick={() => navigate("/binamarga")}
            variant="outline"
            className="px-8 py-6 rounded-xl cursor-pointer  border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-600"
          >
            Kembali
          </Button>
          <Button
            onClick={() => navigate("/submit")}
            className="bg-blue-600 sm:w-fit cursor-pointer w-full hover:bg-blue-700 text-white font-semibold py-6 px-10 rounded-xl transition-all duration-200 shadow-lg flex items-center gap-2"
          >
            Kirim
          </Button>
        </div>
      </div>
    </main>
  );
}
