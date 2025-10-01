import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface IndexFormData {
  latitude: string;
  longitude: string;
  namaPelapor: string;
  nomorHP: string;
  peranPelapor: string;
  tanggalLaporan: Date | null;
  desaKecamatan: string;
  // Additional fields for TataBangunan compatibility
  jabatan?: string;
  desa?: string;
  kecamatan?: string;
}

interface TataRuangFormData {
  latitude: string;
  longitude: string;
  gambaranAreaLokasi: string;
  kategoriKawasan: string;
  jenisPelanggaran: string;
  tingkatPelanggaran: string;
  dampakLingkungan: string;
  tingkatUrgensi: string;
  fotoLokasi: File[];
}

interface FormDataStore {
  indexData: IndexFormData | null;
  tataRuangData: TataRuangFormData | null;

  setIndexData: (data: IndexFormData) => void;
  setTataRuangData: (data: TataRuangFormData) => void;
  clearIndexData: () => void;
  clearTataRuangData: () => void;
  clearAllData: () => void;

  getIndexData: () => IndexFormData | null;
  getTataRuangData: () => TataRuangFormData | null;
}

export const useFormDataStore = create<FormDataStore>()(
  persist(
    (set, get) => ({
      indexData: null,
      tataRuangData: null,

      setIndexData: (data: IndexFormData) => {
        set({ indexData: data });
      },

      setTataRuangData: (data: TataRuangFormData) => {
        set({ tataRuangData: data });
      },

      clearIndexData: () => {
        set({ indexData: null });
      },

      clearTataRuangData: () => {
        set({ tataRuangData: null });
      },

      clearAllData: () => {
        set({ indexData: null, tataRuangData: null });
      },

      getIndexData: () => get().indexData,
      getTataRuangData: () => get().tataRuangData,
    }),
    {
      name: 'form-data-storage',
      partialize: (state) => ({
        indexData: state.indexData ? {
          ...state.indexData,
          tanggalLaporan: state.indexData.tanggalLaporan instanceof Date
            ? state.indexData.tanggalLaporan.toISOString()
            : null,
        } : null,
        tataRuangData: state.tataRuangData ? {
          ...state.tataRuangData,
          fotoLokasi: []
        } : null,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.indexData?.tanggalLaporan && typeof state.indexData.tanggalLaporan === 'string') {
          state.indexData.tanggalLaporan = new Date(state.indexData.tanggalLaporan);
        }
      },
    }
  )
);

export type { IndexFormData, TataRuangFormData };