import Maps from "./components/Maps";
import { Icon } from "@iconify/react";
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
import { SearchSelect } from "~/components/search/SearchSelect";
import SmartImageUploader from "~/components/SmartImageUploader";
import { useGeolocation, useSumberDayaAir } from "./hooks";

export function SumberDayaAirView() {
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
    namaDaerahIrigasi,
    setNamaDaerahIrigasi,
    jenisIrigasi,
    setJenisIrigasi,
    institusi,
    setInstitusi,
    jenisKerusakan,
    setJenisKerusakan,
    tingkatKerusakan,
    setTingkatKerusakan,
    perkiraanPanjangKerusakan,
    setPerkiraanPanjangKerusakan,
    perkiraanLebarKerusakan,
    setPerkiraanLebarKerusakan,
    perkiraanLuasKerusakan,
    setPerkiraanLuasKerusakan,
    perkiraanVolumeKerusakan,
    setPerkiraanVolumeKerusakan,
    areaSawahTerdampak,
    setAreaSawahTerdampak,
    perkiraanKedalamanKerusakan,
    setPerkiraanKedalamanKerusakan,
    jumlahPetaniTerdampak,
    setJumlahPetaniTerdampak,
    kategoriUrgensi,
    setKategoriUrgensi,
    fotoKerusakan,
    setFotoKerusakan,
    previewUrls,
    setPreviewUrls,
    errors,
    isSubmitting,
    submitError,
    handleSubmit: handleFormSubmit,
  } = useSumberDayaAir();

  const handleSubmit = () => {
    handleFormSubmit(latitude, longitude);
  };

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
            <SearchSelect
              url="/json/irigasi_name.json"
              value={namaDaerahIrigasi}
              onChange={setNamaDaerahIrigasi}
              placeholder="Cari KODE atau NAMA DI"
              inputClassName={`border rounded-xl focus:ring-2 focus:border-transparent transition-all ${
                errors.namaDaerahIrigasi ? "border-red-500 focus:ring-red-500" : "border-gray-200 focus:ring-blue-500"
              }`}
              maxItems={5}
            />
            {errors.namaDaerahIrigasi && (
              <p className="text-red-500 text-sm mt-1">
                {errors.namaDaerahIrigasi}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Jenis Irigasi<span className="text-red-500">*</span>
            </label>
            <Select value={jenisIrigasi} onValueChange={setJenisIrigasi}>
              <SelectTrigger
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all appearance-none bg-white ${
                  errors.jenisIrigasi
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-200 focus:ring-blue-500"
                }`}
              >
                <SelectValue placeholder="Pilih Jenis Irigasi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="saluran-sekunder">
                  Saluran Sekunder
                </SelectItem>
                <SelectItem value="bendung">Bendung</SelectItem>
                <SelectItem value="embung-dam">Embung/Dam</SelectItem>
                <SelectItem value="pintu-air">Pintu Air</SelectItem>
                <SelectItem value="lainnya">Lainnya</SelectItem>
              </SelectContent>
            </Select>
            {errors.jenisIrigasi && (
              <p className="text-red-500 text-sm mt-1">{errors.jenisIrigasi}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Institusi<span className="text-red-500">*</span>
            </label>
            <Select value={institusi} onValueChange={setInstitusi}>
              <SelectTrigger
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all appearance-none bg-white ${
                  errors.institusi
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-200 focus:ring-blue-500"
                }`}
              >
                <SelectValue placeholder="Pilih Institusi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="upt-irigasi">
                  UPT Irigasi
                </SelectItem>
                <SelectItem value="poktan">Poktan</SelectItem>
                <SelectItem value="dinas-pupr">Dinas PUPR</SelectItem>
              </SelectContent>
            </Select>
            {errors.institusi && (
              <p className="text-red-500 text-sm mt-1">{errors.institusi}</p>
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

      {/* Data Kerusakan */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          Data Kerusakan
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Jenis Kerusakan<span className="text-red-500">*</span>
            </label>
            <Select value={jenisKerusakan} onValueChange={setJenisKerusakan}>
              <SelectTrigger
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all appearance-none bg-white ${
                  errors.jenisKerusakan
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-200 focus:ring-blue-500"
                }`}
              >
                <SelectValue placeholder="Pilih Jenis Kerusakan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="retak-bocor">Retak/Bocor</SelectItem>
                <SelectItem value="longsor-ambrol">Longsor/Ambrol</SelectItem>
                <SelectItem value="sedimentasi">
                  Sedimentasi Tinggi
                </SelectItem>
                <SelectItem value="tersumbat">
                  Tersumbat Sampah
                </SelectItem>
                <SelectItem value="beton-rusak">
                  Struktur Rusak
                </SelectItem>
                <SelectItem value="pintu-macet">
                  Pintu Air Macet/Tidak Berfungsi
                </SelectItem>
                <SelectItem value="tanggul-jebol">
                  Tanggul Jebol
                </SelectItem>
                <SelectItem value="lainnya">
                  Lainnya
                </SelectItem>
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
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all appearance-none bg-white ${
                  errors.tingkatKerusakan
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-200 focus:ring-blue-500"
                }`}
              >
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
              <p className="text-red-500 text-sm mt-1">
                {errors.tingkatKerusakan}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Perkiraan Panjang Kerusakan (m)<span className="text-red-500">*</span>
            </label>
            <InputWithMic
              type="text"
              value={perkiraanPanjangKerusakan}
              onChange={(e) => setPerkiraanPanjangKerusakan(e.target.value)}
              placeholder="Contoh: 10"
              enableVoice={false}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.perkiraanPanjangKerusakan
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-blue-500"
              }`}
            />
            {errors.perkiraanPanjangKerusakan && (
              <p className="text-red-500 text-sm mt-1">
                {errors.perkiraanPanjangKerusakan}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Perkiraan Lebar Kerusakan (m)<span className="text-red-500">*</span>
            </label>
            <InputWithMic
              type="text"
              value={perkiraanLebarKerusakan}
              onChange={(e) => setPerkiraanLebarKerusakan(e.target.value)}
              placeholder="Contoh: 2"
              enableVoice={false}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.perkiraanLebarKerusakan
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-blue-500"
              }`}
            />
            {errors.perkiraanLebarKerusakan && (
              <p className="text-red-500 text-sm mt-1">
                {errors.perkiraanLebarKerusakan}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Perkiraan Kedalaman Kerusakan (m)<span className="text-red-500">*</span>
            </label>
            <InputWithMic
              type="text"
              value={perkiraanKedalamanKerusakan}
              onChange={(e) => setPerkiraanKedalamanKerusakan(e.target.value)}
              placeholder="Contoh: 2"
              enableVoice={false}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.perkiraanKedalamanKerusakan
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-blue-500"
              }`}
            />
            {errors.perkiraanKedalamanKerusakan && (
              <p className="text-red-500 text-sm mt-1">
                {errors.perkiraanKedalamanKerusakan}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Perkiraan Luas Kerusakan (m<sup>2</sup>)<span className="text-red-500">*</span>
            </label>
            <InputWithMic
              type="text"
              value={perkiraanLuasKerusakan}
              onChange={(e) => setPerkiraanLuasKerusakan(e.target.value)}
              placeholder="Contoh: 20"
              enableVoice={false}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.perkiraanLuasKerusakan
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-blue-500"
              }`}
            />
            {errors.perkiraanLuasKerusakan && (
              <p className="text-red-500 text-sm mt-1">
                {errors.perkiraanLuasKerusakan}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Perkiraan Volume Kerusakan (m<sup>3</sup>)<span className="text-red-500">*</span>
            </label>
            <InputWithMic
              type="text"
              value={perkiraanVolumeKerusakan}
              onChange={(e) => setPerkiraanVolumeKerusakan(e.target.value)}
              placeholder="Contoh: 20"
              enableVoice={false}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.perkiraanVolumeKerusakan
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-blue-500"
              }`}
            />
            {errors.perkiraanVolumeKerusakan && (
              <p className="text-red-500 text-sm mt-1">
                {errors.perkiraanVolumeKerusakan}
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
            <InputWithMic
              type="text"
              value={areaSawahTerdampak}
              onChange={(e) => setAreaSawahTerdampak(e.target.value)}
              placeholder="Contoh: 10"
              enableVoice={false}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.areaSawahTerdampak
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-blue-500"
              }`}
            />
            {errors.areaSawahTerdampak && (
              <p className="text-red-500 text-sm mt-1">
                {errors.areaSawahTerdampak}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Jumlah Petani Terdampak
              <span className="text-red-500">*</span>
            </label>
            <InputWithMic
              type="text"
              value={jumlahPetaniTerdampak}
              onChange={(e) => setJumlahPetaniTerdampak(e.target.value)}
              placeholder="Contoh: 5"
              enableVoice={false}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.jumlahPetaniTerdampak
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-blue-500"
              }`}
            />
            {errors.jumlahPetaniTerdampak && (
              <p className="text-red-500 text-sm mt-1">
                {errors.jumlahPetaniTerdampak}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Kategori Urgensi Penaganan<span className="text-red-500">*</span>
            </label>
            <Select value={kategoriUrgensi} onValueChange={setKategoriUrgensi}>
              <SelectTrigger
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all appearance-none bg-white ${
                  errors.kategoriUrgensi
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-200 focus:ring-blue-500"
                }`}
              >
                <SelectValue placeholder="Pilih Kategori Urgensi Penanganan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mendesak">
                  Mendesak (potensi gagal panen/banjir)
                </SelectItem>
                <SelectItem value="rutin">Rutin</SelectItem>
              </SelectContent>
            </Select>
            {errors.kategoriUrgensi && (
              <p className="text-red-500 text-sm mt-1">
                {errors.kategoriUrgensi}
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
