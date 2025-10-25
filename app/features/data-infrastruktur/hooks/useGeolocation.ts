import { useState, useEffect } from "react";

export function useGeolocation(initialPosition: [number, number] = [-7.4034, 111.4464]) {
  const [position, setPosition] = useState<[number, number]>(initialPosition);
  const [latitude, setLatitude] = useState(initialPosition[0].toString());
  const [longitude, setLongitude] = useState(initialPosition[1].toString());
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Sync position dengan input values
  useEffect(() => {
    if (position) {
      setLatitude(position[0].toString());
      setLongitude(position[1].toString());
    }
  }, [position]);

  // Handle manual input latitude
  const handleLatitudeChange = (value: string) => {
    setLatitude(value);
    const lat = parseFloat(value);
    if (!isNaN(lat) && !isNaN(parseFloat(longitude))) {
      setPosition([lat, parseFloat(longitude)]);
    }
  };

  // Handle manual input longitude
  const handleLongitudeChange = (value: string) => {
    setLongitude(value);
    const lng = parseFloat(value);
    if (!isNaN(lng) && !isNaN(parseFloat(latitude))) {
      setPosition([parseFloat(latitude), lng]);
    }
  };

  // Aktifkan GPS location
  const aktivasiLokasi = () => {
    setIsLoadingLocation(true);

    if (!("geolocation" in navigator)) {
      alert("Geolocation tidak didukung oleh browser Anda.");
      setIsLoadingLocation(false);
      return;
    }

    const isSecureContext = window.isSecureContext;
    if (!isSecureContext) {
      console.warn(
        "Geolocation might not work properly in non-HTTPS environment"
      );
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newPosition: [number, number] = [
          pos.coords.latitude,
          pos.coords.longitude,
        ];
        setPosition(newPosition);
        setIsLoadingLocation(false);
      },
      (error) => {
        setIsLoadingLocation(false);
        console.error("Error getting location:", error);

        let errorMessage = "Tidak dapat mengakses lokasi. ";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage +=
              "Izin lokasi ditolak. Silakan aktifkan izin lokasi di pengaturan browser/device Anda.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += "Informasi lokasi tidak tersedia.";
            break;
          case error.TIMEOUT:
            errorMessage += "Permintaan lokasi timeout.";
            break;
          default:
            errorMessage += "Pastikan izin lokasi diaktifkan dan coba lagi.";
            break;
        }
        alert(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  return {
    position,
    setPosition,
    latitude,
    setLatitude,
    longitude,
    setLongitude,
    isLoadingLocation,
    handleLatitudeChange,
    handleLongitudeChange,
    aktivasiLokasi,
  };
}
