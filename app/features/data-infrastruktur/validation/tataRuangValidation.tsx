import { z } from "zod";

// Validation schema for the TataRuangView form data
export const tataRuangSchema = z.object({
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

  // Identifikasi Kawasan validation
  gambaranAreaLokasi: z
    .string()
    .min(1, "Gambaran area lokasi/kawasan wajib diisi")
    .max(200, "Gambaran area tidak boleh lebih dari 200 karakter"),

  instansi: z
    .string()
    .min(1, "Instansi wajib dipilih"),

  kategoriKawasan: z
    .string()
    .min(1, "Kategori Kawasan wajib dipilih"),

  // Data Pelanggaran/Kerusakan validation
  jenisPelanggaran: z
    .string()
    .min(1, "Jenis Pelanggaran Tata Ruang wajib dipilih"),

  tingkatPelanggaran: z
    .string()
    .min(1, "Tingkat Pelanggaran wajib dipilih"),

  dampakLingkungan: z
    .string()
    .min(1, "Dampak Lingkungan wajib dipilih"),

  tingkatUrgensi: z
    .string()
    .min(1, "Tingkat Urgensi Penanganan wajib dipilih"),

  // File upload validation (minimum 1 file required, multiple files allowed)
  fotoLokasi: z
    .array(z.instanceof(File))
    .min(1, "Minimal 1 foto harus diupload")
    .refine((files) => {
      return files.every(file => file.size <= 5 * 1024 * 1024); // 5MB max per file
    }, "Setiap file tidak boleh lebih dari 5MB")
    .refine((files) => {
      return files.every(file => ["image/jpeg", "image/jpg", "image/png"].includes(file.type));
    }, "Semua file harus berformat JPG, JPEG, atau PNG"),
});

export type TataRuangFormData = z.infer<typeof tataRuangSchema>;