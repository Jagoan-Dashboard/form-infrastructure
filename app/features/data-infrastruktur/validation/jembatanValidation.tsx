import { z } from "zod";

// Validation schema for the JembatanView form data
export const jembatanSchema = z.object({
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

  // Data Jembatan validation
  institusi: z
    .string()
    .min(1, "Institusi wajib dipilih"),

  kecamatan: z
    .string()
    .min(1, "Kecamatan wajib dipilih"),

  namaJembatan: z
    .string()
    .min(1, "Nama Jembatan/Kode Jembatan wajib diisi")
    .max(100, "Nama Jembatan tidak boleh lebih dari 100 karakter"),

  namaRuas: z
    .string()
    .min(1, "Nama Ruas wajib diisi")
    .max(100, "Nama Ruas tidak boleh lebih dari 100 karakter"),

  jenisStruktur: z
    .string()
    .min(1, "Jenis Struktur wajib dipilih"),

  jenisKerusakan: z
    .string()
    .min(1, "Jenis Kerusakan wajib dipilih"),

  tingkatKerusakan: z
    .string()
    .min(1, "Tingkat Kerusakan wajib dipilih"),

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

export type JembatanFormData = z.infer<typeof jembatanSchema>;