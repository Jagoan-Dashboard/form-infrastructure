import { z } from "zod";

// Validation schema for the JalanView form data
export const jalanSchema = z.object({
  // Coordinates validation
  latitude: z
    .string()
    .min(1, "Latitude wajib diisi")
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num >= -90 && num <= 90;
    }, "Latitude harus berupa angka antara -90 dan 90"),

  longitude: z
    .string()
    .min(1, "Longitude wajib diisi")
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num >= -180 && num <= 180;
    }, "Longitude harus berupa angka antara -180 dan 180"),

  // Informasi Ruas Jalan validation
  namaRuasJalan: z
    .string()
    .min(1, "Nama Ruas Jalan/Kode Ruas wajib diisi")
    .max(100, "Nama Ruas Jalan tidak boleh lebih dari 100 karakter"),

  jenisJalan: z
    .string()
    .min(1, "Jenis Jalan wajib dipilih"),

  panjangSegmen: z
    .string()
    .min(1, "Panjang Segmen yang Diperiksa wajib diisi")
    .regex(/^\d+(\.\d+)?$/, "Panjang Segmen harus berupa angka")
    .refine((val) => {
      const num = parseFloat(val);
      return num > 0;
    }, "Panjang Segmen harus lebih dari 0"),

  klasifikasiFungsi: z
    .string()
    .min(1, "Klasifikasi Fungsi Jalan wajib dipilih"),

  // Data Teknis Perkerasan Jalan validation
  jenisPerkerasan: z
    .string()
    .min(1, "Jenis Perkerasan wajib dipilih"),

  jenisKerusakan: z
    .string()
    .min(1, "Jenis Kerusakan wajib dipilih"),

  tingkatKerusakan: z
    .string()
    .min(1, "Tingkat Kerusakan wajib dipilih"),

  panjangKerusakan: z
    .string()
    .min(1, "Panjang Kerusakan wajib diisi")
    .regex(/^\d+(\.\d+)?$/, "Panjang Kerusakan harus berupa angka")
    .refine((val) => {
      const num = parseFloat(val);
      return num > 0;
    }, "Panjang Kerusakan harus lebih dari 0"),

  lebarKerusakan: z
    .string()
    .min(1, "Lebar Kerusakan wajib diisi")
    .regex(/^\d+(\.\d+)?$/, "Lebar Kerusakan harus berupa angka")
    .refine((val) => {
      const num = parseFloat(val);
      return num > 0;
    }, "Lebar Kerusakan harus lebih dari 0"),

  totalLuasKerusakan: z
    .string()
    .min(1, "Total Luas Kerusakan wajib diisi")
    .regex(/^\d+(\.\d+)?$/, "Total Luas Kerusakan harus berupa angka")
    .refine((val) => {
      const num = parseFloat(val);
      return num > 0;
    }, "Total Luas Kerusakan harus lebih dari 0"),

  // Dampak & Urgensi validation
  kondisiLaluLintas: z
    .string()
    .min(1, "Kondisi Lalu Lintas Saat ini wajib dipilih"),

  volumeLaluLintas: z
    .string()
    .min(1, "Volume Lalu Lintas Harian wajib diisi")
    .regex(/^\d+$/, "Volume Lalu Lintas harus berupa angka bulat")
    .refine((val) => {
      const num = parseInt(val);
      return num >= 0;
    }, "Volume Lalu Lintas tidak boleh negatif"),

  kategoriPrioritas: z
    .string()
    .min(1, "Kategori Prioritas Penanganan wajib dipilih"),

  // File upload validation (minimum 1 file required, multiple files allowed)
  fotoKerusakan: z
    .array(z.instanceof(File))
    .min(1, "Minimal 1 foto harus diupload")
    .refine((files) => {
      return files.every(file => file.size <= 5 * 1024 * 1024); // 5MB max per file
    }, "Setiap file tidak boleh lebih dari 5MB")
    .refine((files) => {
      return files.every(file => ["image/jpeg", "image/jpg", "image/png"].includes(file.type));
    }, "Semua file harus berformat JPG, JPEG, atau PNG"),
});

export type JalanFormData = z.infer<typeof jalanSchema>;