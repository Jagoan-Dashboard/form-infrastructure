import { z } from "zod";

// Validation schema for the IndexView form data
export const indexViewSchema = z.object({
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

  // Data Pelapor validation
  namaPelapor: z
    .string()
    .min(1, "Nama Pelapor wajib diisi")
    .max(100, "Nama Pelapor tidak boleh lebih dari 100 karakter")
    .regex(
      /^[a-zA-Z\s\u00C0-\u017F\u0100-\u017F\u1E00-\u1EFF]*$/,
      "Nama Pelapor hanya boleh berisi huruf dan spasi"
    ),

  tanggalLaporan: z
    .date({
      message:
        "Tanggal Laporan wajib dipilih dan harus berupa tanggal yang valid",
    })
    .refine(
      (date) => date <= new Date(),
      "Tanggal Laporan tidak boleh di masa depan"
    ),

  nomorHP: z
    .string()
    .min(1, "Nomor HP/WA wajib diisi")
    .regex(
      /^(\+62|62|0)[0-9]{9,12}$/,
      "Nomor HP/WA tidak valid. Gunakan format: 08xxxxxxxxx atau +628xxxxxxxxx"
    ),

  peranPelapor: z
    .string()
    .min(1, "Peran Pelapor wajib dipilih"),

  desaKecamatan: z.string().min(1, "Desa/Kecamatan wajib dipilih"),
});

export type IndexViewFormData = z.infer<typeof indexViewSchema>;
