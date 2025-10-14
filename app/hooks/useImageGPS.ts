import { useState } from "react";
import * as exifr from "exifr";

interface GPSCoordinates {
  latitude: number;
  longitude: number;
}

interface UseImageGPSReturn {
  coordinates: GPSCoordinates | null;
  error: string | null;
  loading: boolean;
  extractGPS: (file: File) => Promise<GPSCoordinates | null>;
  reset: () => void;
  hasGPS: boolean;
}

/**
 * Custom hook untuk extract GPS coordinates dari gambar
 * @returns Object dengan coordinates, error state, dan fungsi helper
 */
export function useImageGPS(): UseImageGPSReturn {
  const [coordinates, setCoordinates] = useState<GPSCoordinates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const extractGPS = async (file: File): Promise<GPSCoordinates | null> => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      const errorMsg = "File harus berupa gambar";
      setError(errorMsg);
      setCoordinates(null);
      throw new Error(errorMsg);
    }

    setLoading(true);
    setError(null);

    try {
      const gpsData = await exifr.gps(file);

      if (gpsData && gpsData.latitude && gpsData.longitude) {
        const coords: GPSCoordinates = {
          latitude: gpsData.latitude,
          longitude: gpsData.longitude,
        };

        setCoordinates(coords);
        setError(null);
        return coords;
      } else {
        const errorMsg = "Foto tidak mengandung data GPS";
        setError(errorMsg);
        setCoordinates(null);
        throw new Error(errorMsg);
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Gagal membaca GPS data";
      setError(errorMsg);
      setCoordinates(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setCoordinates(null);
    setError(null);
    setLoading(false);
  };

  return {
    coordinates,
    error,
    loading,
    extractGPS,
    reset,
    hasGPS: coordinates !== null,
  };
}

/**
 * Validate apakah file image memiliki GPS metadata
 * @param file - File gambar untuk divalidasi
 * @returns Promise<boolean> - true jika memiliki GPS data
 */
export async function validateImageHasGPS(file: File): Promise<boolean> {
  if (!file.type.startsWith("image/")) {
    return false;
  }

  try {
    const gpsData = await exifr.gps(file);
    return !!(gpsData && gpsData.latitude && gpsData.longitude);
  } catch {
    return false;
  }
}

/**
 * Extract GPS coordinates dari file tanpa state management
 * @param file - File gambar
 * @returns Promise<GPSCoordinates | null>
 */
export async function extractGPSFromImage(
  file: File
): Promise<GPSCoordinates | null> {
  if (!file.type.startsWith("image/")) {
    throw new Error("File harus berupa gambar");
  }

  try {
    const gpsData = await exifr.gps(file);

    if (gpsData && gpsData.latitude && gpsData.longitude) {
      return {
        latitude: gpsData.latitude,
        longitude: gpsData.longitude,
      };
    }

    return null;
  } catch (err) {
    console.error("Error extracting GPS:", err);
    throw new Error("Gagal membaca GPS data");
  }
}
