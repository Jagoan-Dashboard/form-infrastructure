import Maps from "./components/Maps";
import { Icon } from "@iconify/react";
import { TextareaWithMic } from "~/components/TextareaWithMic";
import { InputWithMic } from "~/components/InputWithMic";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useNavigate } from "react-router";
import { useCheckIndexData } from "~/middleware/checkIndexData";
import SmartImageUploader from "~/components/SmartImageUploader";
import { useGeolocation, useTataRuang } from "./hooks";

export function TataRuangView() {
  useCheckIndexData();

  const navigate = useNavigate();

  // Use custom hooks
  const {
    position,
    setPosition,
    latitude,
    longitude,
    isLoadingLocation,
    handleLatitudeChange,
    handleLongitudeChange,
    aktivasiLokasi,
  } = useGeolocation();

  const {
    gambaranAreaLokasi,
    setGambaranAreaLokasi,
    instansi,
    setInstansi,
    kategoriKawasan,
    setKategoriKawasan,
    jenisPelanggaran,
    setJenisPelanggaran,
    tingkatPelanggaran,
    setTingkatPelanggaran,
    dampakLingkungan,
    setDampakLingkungan,
    tingkatUrgensi,
    setTingkatUrgensi,
    fotoLokasi,
    setFotoLokasi,
    previewUrls,
    setPreviewUrls,
    errors,
    isSubmitting,
    handleSubmit: handleFormSubmit,
  } = useTataRuang();

  const handleSubmit = () => {
    handleFormSubmit(latitude, longitude);
  };

  return (
    <main className="space-y-6">
      {/* Data Kawasan */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          Identifikasi Kawasan
        </h3>

        <div className="grid md:grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Gambaran Area Lokasi / Kawasan
              <span className="text-red-500">*</span>
            </label>
            <TextareaWithMic
              value={gambaranAreaLokasi}
              onChange={(e) => setGambaranAreaLokasi(e.target.value)}
              placeholder="Contoh: Sempadan Sungai"
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.gambaranAreaLokasi
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

        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Instansi<span className="text-red-500">*</span>
            </label>
            <Select value={instansi} onValueChange={setInstansi}>
              <SelectTrigger
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all appearance-none bg-white ${errors.instansi
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-200 focus:ring-blue-500"
                  }`}
              >
                <SelectValue placeholder="Pilih Instansi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desa">Desa</SelectItem>
                <SelectItem value="kecamatan">Kecamatan</SelectItem>
                <SelectItem value="dinas">Dinas</SelectItem>
              </SelectContent>
            </Select>
            {errors.instansi && (
              <p className="text-red-500 text-sm mt-1">
                {errors.instansi}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Kategori Kawasan<span className="text-red-500">*</span>
            </label>
            <Select value={kategoriKawasan} onValueChange={setKategoriKawasan}>
              <SelectTrigger
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all appearance-none bg-white ${errors.kategoriKawasan
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-200 focus:ring-blue-500"
                  }`}
              >
                <SelectValue placeholder="Pilih Kategori Kawasan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cagar-budaya">Kawasan Cagar Budaya</SelectItem>
                <SelectItem value="hutan">Kawasan Hutan</SelectItem>
                <SelectItem value="pariwisata">Kawasan Pariwisata</SelectItem>
                <SelectItem value="perkebunan">Kawasan Perkebunan</SelectItem>
                <SelectItem value="permukiman">Kawasan Permukiman</SelectItem>
                <SelectItem value="pertahanan-keamanan">Kawasan Pertahanan dan Keamanan</SelectItem>
                <SelectItem value="peruntukan-industri">Kawasan Peruntukan Industri</SelectItem>
                <SelectItem value="peruntukan-pertambangan">Kawasan Peruntukan Pertambangan Batuan</SelectItem>
                <SelectItem value="tanaman-pangan">Kawasan Tanaman Pangan</SelectItem>
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
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all appearance-none bg-white ${errors.jenisPelanggaran
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-200 focus:ring-blue-500"
                  }`}
              >
                <SelectValue placeholder="Pilih Jenis Pelanggaran" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bangunan-sempadan-sungai">
                  Bangunan di sempadan sungai/waduk/bendungan
                </SelectItem>
                <SelectItem value="bangunan-sempadan-jalan">
                  Bangunan di sempadan jalan
                </SelectItem>
                <SelectItem value="alih-fungsi-pertanian">
                  Alih fungsi lahan pertanian
                </SelectItem>
                <SelectItem value="alih-fungsi-rth">
                  Alih fungsi ruang terbuka hijau
                </SelectItem>
                <SelectItem value="pembangunan-tanpa-izin">
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
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all appearance-none bg-white ${errors.tingkatPelanggaran
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
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all appearance-none bg-white ${errors.dampakLingkungan
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-200 focus:ring-blue-500"
                  }`}
              >
                <SelectValue placeholder="Pilih Dampak Lingkungan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="menurun-kualitas">
                  Menurunnya kualitas ruang / ekosistem
                </SelectItem>
                <SelectItem value="potensi-bencana">
                  Potensi banjir / longsor
                </SelectItem>
                <SelectItem value="ganggu-warga">
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
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all appearance-none bg-white ${errors.tingkatUrgensi
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
            <SmartImageUploader
              label="Foto Lokasi/Kerusakan"
              onFilesSelected={(files: File[]) => {
                setFotoLokasi(files);
              }}
              onPreviewUrlsUpdated={(urls: string[]) => {
                setPreviewUrls(urls);
              }}
              maxFiles={2}
              required
            />
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
