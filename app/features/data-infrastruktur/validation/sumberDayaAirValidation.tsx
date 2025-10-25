import { z } from "zod";

// Validation schema for the SumberDayaAirView form data
export const sumberDayaAirSchema = z.object({
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

  // Identifikasi Daerah Irigasi validation
  namaDaerahIrigasi: z
    .string()
    .min(1, "Nama Daerah Irigasi wajib diisi")
    .max(100, "Nama Daerah Irigasi tidak boleh lebih dari 100 karakter"),

  jenisIrigasi: z
    .string()
    .min(1, "Jenis Irigasi wajib dipilih"),

  institusi: z
    .string()
    .min(1, "Institusi wajib dipilih"),

  // Data Kerusakan validation
  jenisKerusakan: z
    .string()
    .min(1, "Jenis Kerusakan wajib dipilih"),

  tingkatKerusakan: z
    .string()
    .min(1, "Tingkat Kerusakan wajib dipilih"),

  perkiraanPanjangKerusakan: z
    .string()
    .min(1, "Perkiraan Panjang Kerusakan wajib diisi")
    .regex(/^\d+(\.\d+)?$/, "Panjang Kerusakan harus berupa angka")
    .refine((val) => {
      const num = parseFloat(val);
      return num > 0;
    }, "Panjang Kerusakan harus lebih dari 0"),

  perkiraanLebarKerusakan: z
    .string()
    .min(1, "Perkiraan Lebar Kerusakan wajib diisi")
    .regex(/^\d+(\.\d+)?$/, "Lebar Kerusakan harus berupa angka")
    .refine((val) => {
      const num = parseFloat(val);
      return num > 0;
    }, "Lebar Kerusakan harus lebih dari 0"),

  perkiraanKedalamanKerusakan: z
    .string()
    .min(1, "Perkiraan Kedalaman Kerusakan wajib diisi")
    .regex(/^\d+(\.\d+)?$/, "Kedalaman Kerusakan harus berupa angka")
    .refine((val) => {
      const num = parseFloat(val);
      return num > 0;
    }, "Kedalaman Kerusakan harus lebih dari 0"),

  perkiraanLuasKerusakan: z
    .string()
    .min(1, "Perkiraan Luas Kerusakan wajib diisi")
    .regex(/^\d+(\.\d+)?$/, "Luas Kerusakan harus berupa angka")
    .refine((val) => {
      const num = parseFloat(val);
      return num > 0;
    }, "Luas Kerusakan harus lebih dari 0"),

  perkiraanVolumeKerusakan: z
    .string()
    .min(1, "Perkiraan Volume Kerusakan wajib diisi")
    .regex(/^\d+(\.\d+)?$/, "Volume Kerusakan harus berupa angka")
    .refine((val) => {
      const num = parseFloat(val);
      return num > 0;
    }, "Volume Kerusakan harus lebih dari 0"),

  // Dampak validation
  areaSawahTerdampak: z
    .string()
    .min(1, "Area Sawah Terdampak wajib diisi")
    .regex(/^\d+(\.\d+)?$/, "Area Sawah harus berupa angka")
    .refine((val) => {
      const num = parseFloat(val);
      return num >= 0;
    }, "Area Sawah tidak boleh negatif"),

  jumlahPetaniTerdampak: z
    .string()
    .min(1, "Jumlah Petani Terdampak wajib diisi")
    .regex(/^\d+$/, "Jumlah Petani harus berupa angka bulat")
    .refine((val) => {
      const num = parseInt(val);
      return num >= 0;
    }, "Jumlah Petani tidak boleh negatif"),

  kategoriUrgensi: z
    .string()
    .min(1, "Kategori Urgensi Penanganan wajib dipilih"),

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

export type SumberDayaAirFormData = z.infer<typeof sumberDayaAirSchema>;