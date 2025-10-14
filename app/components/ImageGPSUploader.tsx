import React, { useState, useRef } from "react";
import * as exifr from "exifr";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

interface GPSCoordinates {
  latitude: number;
  longitude: number;
}

interface ImageGPSUploaderProps {
  onCoordinatesExtracted?: (coords: GPSCoordinates, index: number) => void;
  onFilesSelected?: (files: File[]) => void;
  onPreviewUrlsUpdated?: (urls: string[]) => void;
  maxFiles?: number;
  label?: string;
  required?: boolean;
  className?: string;
}

export default function ImageGPSUploader({
  onCoordinatesExtracted,
  onFilesSelected,
  onPreviewUrlsUpdated,
  maxFiles = 2,
  label = "Foto Lokasi/Kerusakan",
  required = false,
  className = "",
}: ImageGPSUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractGPSFromFile = async (file: File, index: number) => {
    try {
      // Use exifr.gps() for better performance - only parses GPS coords
      const gpsData = await exifr.gps(file);

      if (gpsData && gpsData.latitude && gpsData.longitude) {
        const coordinates: GPSCoordinates = {
          latitude: gpsData.latitude,
          longitude: gpsData.longitude,
        };
        onCoordinatesExtracted?.(coordinates, index);
        return coordinates;
      }
      return null;
    } catch (err) {
      console.error("Error reading GPS data:", err);
      return null;
    }
  };

  const processFiles = async (newFiles: File[]) => {
    // Validate file types
    const imageFiles = newFiles.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length !== newFiles.length) {
      toast.error("File harus berupa gambar", {
        description: "Hanya file JPG, PNG, atau JPEG yang diperbolehkan",
      });
    }

    if (imageFiles.length === 0) return;

    // Check max files limit
    const totalFiles = files.length + imageFiles.length;
    if (totalFiles > maxFiles) {
      toast.warning(`Maksimal ${maxFiles} foto`, {
        description: `Anda hanya dapat mengupload maksimal ${maxFiles} foto`,
      });
      return;
    }

    setLoading(true);

    // Create preview URLs
    const newPreviewUrls: string[] = [];
    const newFilesList: File[] = [];
    let gpsCount = 0;

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      newFilesList.push(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviewUrls.push(reader.result as string);

        // Update state after all previews are loaded
        if (newPreviewUrls.length === imageFiles.length) {
          const updatedFiles = [...files, ...newFilesList];
          const updatedPreviews = [...previewUrls, ...newPreviewUrls];

          setFiles(updatedFiles);
          setPreviewUrls(updatedPreviews);
          onFilesSelected?.(updatedFiles);
          onPreviewUrlsUpdated?.(updatedPreviews);
        }
      };
      reader.readAsDataURL(file);

      // Extract GPS in parallel
      const gpsData = await extractGPSFromFile(file, files.length + i);
      if (gpsData) {
        gpsCount++;
      }
    }

    setLoading(false);

    // Show GPS extraction results
    if (gpsCount > 0) {
      toast.success(`GPS ditemukan di ${gpsCount} foto`, {
        description: "Koordinat otomatis diperbarui dari metadata foto",
      });
    } else {
      toast.warning("GPS tidak ditemukan", {
        description: "Pastikan foto diambil dengan GPS/lokasi aktif di kamera",
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    processFiles(selectedFiles);

    // Reset input value so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previewUrls.filter((_, i) => i !== index);

    setFiles(newFiles);
    setPreviewUrls(newPreviews);
    onFilesSelected?.(newFiles);
    onPreviewUrlsUpdated?.(newPreviews);
  };

  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-8 transition-all ${
          isDragging
            ? "border-blue-600 bg-blue-50"
            : "border-gray-300 hover:border-blue-400"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={maxFiles > 1}
          onChange={handleFileSelect}
          disabled={loading || files.length >= maxFiles}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />

        {previewUrls.length > 0 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage(index);
                    }}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    <Icon icon="mdi:close" className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 text-center">
              {files.length} foto dipilih.{" "}
              {files.length < maxFiles && "Klik untuk menambah foto lagi."}
            </p>
          </div>
        ) : (
          <div className="text-center">
            {loading ? (
              <>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
                <p className="text-sm font-semibold text-gray-700 mb-1">
                  Membaca metadata GPS...
                </p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon icon="mdi:cloud-upload" className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-sm font-semibold text-gray-700 mb-1">
                  Upload Foto dengan GPS
                </p>
                <p className="text-xs text-gray-500">
                  Drag & drop atau klik untuk upload (maksimal {maxFiles} foto)
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  PNG, JPG, JPEG (Max 5MB per file)
                </p>
              </>
            )}
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500 mt-2">
        💡 Koordinat akan otomatis diisi jika foto mengandung data GPS
      </p>
    </div>
  );
}
