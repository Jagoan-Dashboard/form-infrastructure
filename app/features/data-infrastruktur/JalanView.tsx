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
import SmartImageUploader from "~/components/SmartImageUploader";
import SearchableSelect from "~/components/search/SearchableSelect";
import { searchRoads } from "~/utils/roadUtils";
import { useGeolocation, useJalan } from "./hooks";

export function JalanView() {
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
    institusi,
    setInstitusi,
    selectedKecamatan,
    setSelectedKecamatan,
    selectedJalan,
    setSelectedJalan,
    panjangSegmen,
    setPanjangSegmen,
    jenisPerkerasan,
    setJenisPerkerasan,
    jenisKerusakan,
    setJenisKerusakan,
    tingkatKerusakan,
    setTingkatKerusakan,
    panjangKerusakan,
    setPanjangKerusakan,
    lebarKerusakan,
    setLebarKerusakan,
    totalLuasKerusakan,
    setTotalLuasKerusakan,
    kondisiLaluLintas,
    setKondisiLaluLintas,
    volumeLaluLintas,
    setVolumeLaluLintas,
    kategoriPrioritas,
    setKategoriPrioritas,
    fotoKerusakan,
    setFotoKerusakan,
    previewUrls,
    setPreviewUrls,
    errors,
    isSubmitting,
    submitError,
    districts,
    availableRoads,
    handleSubmit: handleFormSubmit,
  } = useJalan();

  const handleSubmit = () => {
    handleFormSubmit(latitude, longitude);
  };

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
              Institusi<span className="text-red-500">*</span>
            </label>
            <Select value={institusi} onValueChange={setInstitusi}>
              <SelectTrigger
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all appearance-none bg-white ${errors.institusi
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-200 focus:ring-blue-500"
                  }`}
              >
                <SelectValue placeholder="Pilih Institusi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desa">
                  Desa
                </SelectItem>
                <SelectItem value="kecamatan">Kecamatan</SelectItem>
                <SelectItem value="upt-jalan">UPT Jalan</SelectItem>
                <SelectItem value="dinas-pupr">Dinas PUPR</SelectItem>
              </SelectContent>
            </Select>
            {errors.institusi && (
              <p className="text-red-500 text-sm mt-1">{errors.institusi}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Lokasi Jalan<span className="text-red-500">*</span>
            </label>
            <SearchableSelect
              options={districts}
              value={selectedKecamatan}
              onValueChange={setSelectedKecamatan}
              placeholder="Cari Kecamatan..."
              emptyMessage="Tidak ada kecamatan yang ditemukan"
              className={errors.kecamatan ? "border-red-500" : ""}
            />
            {errors.kecamatan && (
              <p className="text-red-500 text-sm mt-1">
                {errors.kecamatan}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nama Ruas Jalan<span className="text-red-500">*</span>
            </label>
            <SearchableSelect
              options={availableRoads}
              value={selectedJalan}
              onValueChange={setSelectedJalan}
              placeholder={selectedKecamatan ? "Cari Nama Jalan..." : "Pilih kecamatan terlebih dahulu"}
              emptyMessage="Tidak ada jalan yang ditemukan"
              disabled={!selectedKecamatan}
              className={errors.selectedJalan ? "border-red-500" : ""}
              onSearch={(query: string) => {
                if (!selectedKecamatan) return [];
                return searchRoads(query, selectedKecamatan);
              }}
            />
            {errors.selectedJalan && (
              <p className="text-red-500 text-sm mt-1">
                {errors.selectedJalan}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Panjang Segmen yang Diperiksa (m)
              <span className="text-red-500">*</span>
            </label>
            <InputWithMic
              type="text"
              value={panjangSegmen}
              onChange={(e) => setPanjangSegmen(e.target.value)}
              placeholder="Contoh: 2785"
              enableVoice={false}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.panjangSegmen
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-blue-500"
                }`}
            />
            {errors.panjangSegmen && (
              <p className="text-red-500 text-sm mt-1">
                {errors.panjangSegmen}
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

      {/* Data Kerusakan */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          Data Teknis Perkerasan Jalan
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Jenis Perkerasan<span className="text-red-500">*</span>
            </label>
            <Select value={jenisPerkerasan} onValueChange={setJenisPerkerasan}>
              <SelectTrigger
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all appearance-none bg-white ${errors.jenisPerkerasan
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-200 focus:ring-blue-500"
                  }`}
              >
                <SelectValue placeholder="Pilih Jenis Perkerasan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aspal">Aspal/Flexible Pavement</SelectItem>
                <SelectItem value="beton">Beton/Rigid Pavement</SelectItem>
                <SelectItem value="paving">Paving</SelectItem>
                <SelectItem value="jalan tanah">Jalan Tanah</SelectItem>
              </SelectContent>
            </Select>
            {errors.jenisPerkerasan && (
              <p className="text-red-500 text-sm mt-1">
                {errors.jenisPerkerasan}
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
                <SelectItem value="lubang">Lubang (Potholes)</SelectItem>
                <SelectItem value="retak-buaya">
                  Retak Buaya (Aligator Cracking)
                </SelectItem>
                <SelectItem value="amblas-longsor">Amblas/Longsor</SelectItem>
                <SelectItem value="permukaan-aus">
                  Permukaan Aus/Raveling
                </SelectItem>
                <SelectItem value="genangan-air">
                  Genangan Air/Drainase Buruk
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
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all appearance-none bg-white ${errors.tingkatKerusakan
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-200 focus:ring-blue-500"
                  }`}
              >
                <SelectValue placeholder="Pilih Tingkat Kerusakan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ringan">Ringan(kurang dari 10% area)</SelectItem>
                <SelectItem value="sedang">Sedang(11-25% area)</SelectItem>
                <SelectItem value="berat">Berat(Lebih dari 25% area atau jalan putus)</SelectItem>
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
              Panjang Kerusakan (m)<span className="text-red-500">*</span>
            </label>
            <InputWithMic
              type="text"
              value={panjangKerusakan}
              onChange={(e) => setPanjangKerusakan(e.target.value)}
              placeholder="Contoh: 10"
              enableVoice={false}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all ${errors.panjangKerusakan
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-blue-500"
                }`}
            />
            {errors.panjangKerusakan && (
              <p className="text-red-500 text-sm mt-1">
                {errors.panjangKerusakan}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Lebar Kerusakan (m)<span className="text-red-500">*</span>
            </label>
            <InputWithMic
              type="text"
              value={lebarKerusakan}
              onChange={(e) => setLebarKerusakan(e.target.value)}
              placeholder="Contoh: 2"
              enableVoice={false}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all ${errors.lebarKerusakan
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-blue-500"
                }`}
            />
            {errors.lebarKerusakan && (
              <p className="text-red-500 text-sm mt-1">
                {errors.lebarKerusakan}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Total Luas Kerusakan (m<sup>2</sup>)<span className="text-red-500">*</span>
            </label>
            <InputWithMic
              type="text"
              value={totalLuasKerusakan}
              onChange={(e) => setTotalLuasKerusakan(e.target.value)}
              placeholder="Contoh: 20"
              enableVoice={false}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all ${errors.totalLuasKerusakan
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-blue-500"
                }`}
            />
            {errors.totalLuasKerusakan && (
              <p className="text-red-500 text-sm mt-1">
                {errors.totalLuasKerusakan}
              </p>
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
                  Tidak Bisa Dilalui/Jalan Putus
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
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all ${errors.volumeLaluLintas
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
