import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface IndexFormData {
  latitude: string;
  longitude: string;
  namaPelapor: string;
  nomorHP: string;
  peranPelapor: string;
  tanggalLaporan: Date | string | undefined;
  desaKecamatan: string;
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

  // Actions
  setIndexData: (data: IndexFormData) => void;
  setTataRuangData: (data: TataRuangFormData) => void;
  clearIndexData: () => void;
  clearTataRuangData: () => void;
  clearAllData: () => void;

  // Getters
  getIndexData: () => IndexFormData | null;
  getTataRuangData: () => TataRuangFormData | null;
}

export const useFormDataStore = create<FormDataStore>()(
  persist(
    (set, get) => ({
      indexData: null,
      tataRuangData: null,

      setIndexData: (data: IndexFormData) => {
        console.log('🏠 Storing Index Data:', data);
        set({ indexData: data });
      },

      setTataRuangData: (data: TataRuangFormData) => {
        console.log('🏗️ Storing Tata Ruang Data:', data);
        set({ tataRuangData: data });
      },

      clearIndexData: () => {
        console.log('🗑️ Clearing Index Data');
        set({ indexData: null });
      },

      clearTataRuangData: () => {
        console.log('🗑️ Clearing Tata Ruang Data');
        set({ tataRuangData: null });
      },

      clearAllData: () => {
        console.log('🗑️ Clearing All Form Data');
        set({ indexData: null, tataRuangData: null });
      },

      getIndexData: () => get().indexData,
      getTataRuangData: () => get().tataRuangData,
    }),
    {
      name: 'form-data-storage',
      // Only persist basic data, not File objects
      partialize: (state) => ({
        indexData: state.indexData ? {
          ...state.indexData,
          // Convert Date to string for persistence
          tanggalLaporan: state.indexData.tanggalLaporan?.toISOString() || null,
        } : null,
        // Don't persist files in tataRuangData to avoid serialization issues
        tataRuangData: state.tataRuangData ? {
          ...state.tataRuangData,
          fotoLokasi: [] // Reset files on reload
        } : null,
      }),
      // Handle date deserialization when loading from storage
      onRehydrateStorage: () => (state) => {
        if (state?.indexData?.tanggalLaporan && typeof state.indexData.tanggalLaporan === 'string') {
          state.indexData.tanggalLaporan = new Date(state.indexData.tanggalLaporan);
          console.log('📅 Rehydrated date:', state.indexData.tanggalLaporan);
        }
      },
    }
  )
);

export type { IndexFormData, TataRuangFormData };