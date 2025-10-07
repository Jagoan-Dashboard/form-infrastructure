import { z } from "zod";

// Validation schema for the TataBangunanView form data
export const tataBangunanSchema = z.object({
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

  // Identifikasi Bangunan validation
  namaBangunan: z
    .string()
    .min(1, "Nama Bangunan wajib diisi")
    .max(100, "Nama Bangunan tidak boleh lebih dari 100 karakter"),

  jenisBangunan: z
    .string()
    .min(1, "Jenis Bangunan wajib dipilih"),

  statusLaporan: z
    .string()
    .min(1, "Status Laporan wajib dipilih"),

  sumberDana: z
    .string()
    .min(1, "Sumber Dana wajib dipilih"),

  tahunPembangunan: z
    .string()
    .min(1, "Tahun Pembangunan wajib diisi")
    .regex(/^\d{4}$/, "Tahun harus berupa 4 digit angka")
    .refine((val) => {
      const year = parseInt(val);
      const currentYear = new Date().getFullYear();
      return year >= 1900 && year <= currentYear;
    }, "Tahun harus antara 1900 dan tahun sekarang"),

  // Data Teknis Lokasi validation
  alamatLengkap: z
    .string()
    .min(1, "Alamat Lengkap wajib diisi")
    .max(255, "Alamat tidak boleh lebih dari 255 karakter"),

  luasLantai: z
    .string()
    .min(1, "Luas Lantai wajib diisi")
    .regex(/^\d+(\.\d+)?$/, "Luas Lantai harus berupa angka")
    .refine((val) => {
      const num = parseFloat(val);
      return num > 0;
    }, "Luas Lantai harus lebih dari 0"),

  jumlahLantai: z
    .string()
    .min(1, "Jumlah Lantai wajib dipilih"),

  // Detail Kerusakan validation - optional (only required if status is rehabilitasi)
  jenisPekerjaan: z
    .string()
    .optional(),

  kondisiSetelahRehabilitasi: z
    .string()
    .optional(),

  // File upload validation - optional (only required if status is rehabilitasi)
  fotoKerusakan: z
    .array(z.instanceof(File))
    .optional()
    .refine((files) => {
      if (!files || files.length === 0) return true;
      return files.every(file => file.size <= 5 * 1024 * 1024); // 5MB max per file
    }, "Setiap file tidak boleh lebih dari 5MB")
    .refine((files) => {
      if (!files || files.length === 0) return true;
      return files.every(file => ["image/jpeg", "image/jpg", "image/png"].includes(file.type));
    }, "Semua file harus berformat JPG, JPEG, atau PNG"),
});

// Validation schema untuk rehabilitasi/perbaikan
export const tataBangunanRehabilitasiSchema = tataBangunanSchema.extend({
  jenisPekerjaan: z
    .string()
    .min(1, "Jenis Pekerjaan wajib dipilih"),

  kondisiSetelahRehabilitasi: z
    .string()
    .min(1, "Kondisi Setelah Rehabilitasi wajib dipilih"),

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

export type TataBangunanFormData = z.infer<typeof tataBangunanSchema>;