import React, { useState, useRef } from "react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import exifr from "exifr";

interface GPSCoordinates {
  latitude: number;
  longitude: number;
}

interface SmartImageUploaderProps {
  onFilesSelected?: (files: File[]) => void;
  onPreviewUrlsUpdated?: (urls: string[]) => void;
  onCoordinatesExtracted?: (coords: GPSCoordinates, index: number) => void;
  maxFiles?: number;
  label?: string;
  required?: boolean;
  className?: string;
  // Feature toggles
  enableCamera?: boolean;
  enableGPSExtraction?: boolean; // Only for uploaded files, not camera captures
  autoFillCoordinates?: boolean; // Auto-fill form coordinates from first photo
}

export default function SmartImageUploader({
  onFilesSelected,
  onPreviewUrlsUpdated,
  onCoordinatesExtracted,
  maxFiles = 2,
  label = "Foto Lokasi",
  required = false,
  className = "",
  enableCamera = true,
  enableGPSExtraction = true,
  autoFillCoordinates = true,
}: SmartImageUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [gpsData, setGpsData] = useState<(GPSCoordinates | null)[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /**
   * Extract GPS coordinates from image EXIF data
   */
  const extractGPSFromImage = async (file: File): Promise<GPSCoordinates | null> => {
    if (!enableGPSExtraction) return null;

    try {
      // Parse EXIF data from image
      const exifData = await exifr.parse(file, {
        gps: true,
        pick: ["latitude", "longitude"],
      });

      if (exifData && exifData.latitude && exifData.longitude) {
        const coords: GPSCoordinates = {
          latitude: exifData.latitude,
          longitude: exifData.longitude,
        };

        console.log("GPS coordinates extracted:", coords);
        return coords;
      }

      return null;
    } catch (error) {
      console.error("Error extracting GPS from image:", error);
      return null;
    }
  };

  /**
   * Process uploaded files
   * @param newFiles - Array of files to process
   * @param source - Source of files: 'upload' or 'camera'
   */
  const processFiles = async (newFiles: File[], source: 'upload' | 'camera' = 'upload') => {
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

    setIsProcessing(true);

    // Create preview URLs and extract GPS
    const newFilesList = [...files, ...imageFiles];
    const newPreviewUrls = [...previewUrls];
    const newGpsData = [...gpsData];

    // Determine if GPS extraction should be performed
    const shouldExtractGPS = enableGPSExtraction && source === 'upload';

    try {
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        const fileIndex = files.length + i;

        // Create preview URL
        const previewUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        newPreviewUrls.push(previewUrl);

        // Extract GPS coordinates (only for uploaded files, not camera captures)
        if (shouldExtractGPS) {
          const coords = await extractGPSFromImage(file);
          newGpsData.push(coords);

          if (coords) {
            toast.success(`GPS ditemukan di foto ${fileIndex + 1}`, {
              description: `Lat: ${coords.latitude.toFixed(6)}, Long: ${coords.longitude.toFixed(6)}`,
            });

            // Notify parent component
            onCoordinatesExtracted?.(coords, fileIndex);
          } else {
            toast.info(`Foto ${fileIndex + 1} tidak memiliki data GPS`, {
              description: "Koordinat tidak dapat diekstrak dari foto ini",
            });
          }
        } else {
          // No GPS extraction for camera captures or when disabled
          newGpsData.push(null);
        }
      }

      setFiles(newFilesList);
      setPreviewUrls(newPreviewUrls);
      setGpsData(newGpsData);

      onFilesSelected?.(newFilesList);
      onPreviewUrlsUpdated?.(newPreviewUrls);

      if (source === 'camera') {
        toast.success("Foto berhasil diambil!");
      } else {
        toast.success(`${imageFiles.length} foto berhasil diupload`);
      }
    } catch (error) {
      console.error("Error processing files:", error);
      toast.error("Gagal memproses foto");
    } finally {
      setIsProcessing(false);
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
    processFiles(droppedFiles, 'upload'); // Explicitly mark as upload source
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    processFiles(selectedFiles, 'upload'); // Explicitly mark as upload source

    // Reset input value so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previewUrls.filter((_, i) => i !== index);
    const newGps = gpsData.filter((_, i) => i !== index);

    setFiles(newFiles);
    setPreviewUrls(newPreviews);
    setGpsData(newGps);

    onFilesSelected?.(newFiles);
    onPreviewUrlsUpdated?.(newPreviews);

    toast.success("Foto berhasil dihapus");
  };

  const startCamera = async () => {
    if (!enableCamera) {
      toast.warning("Kamera dinonaktifkan");
      return;
    }

    try {
      // Check if camera is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast.error("Kamera tidak didukung", {
          description: "Browser Anda tidak mendukung akses kamera",
        });
        return;
      }

      // Request camera access
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Use back camera on mobile
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });

      setStream(mediaStream);
      setShowCamera(true);

      // Wait for video element to be ready
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      }, 100);
    } catch (error: any) {
      console.error("Error accessing camera:", error);

      let errorMessage = "Tidak dapat mengakses kamera";
      let errorDescription = "Pastikan izin kamera telah diaktifkan";

      if (error.name === "NotAllowedError") {
        errorDescription = "Izin akses kamera ditolak. Aktifkan izin di pengaturan browser.";
      } else if (error.name === "NotFoundError") {
        errorDescription = "Kamera tidak ditemukan pada perangkat Anda.";
      } else if (error.name === "NotReadableError") {
        errorDescription = "Kamera sedang digunakan aplikasi lain.";
      }

      toast.error(errorMessage, { description: errorDescription });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    // Set canvas dimensions to video dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (!blob) return;

      // Create file from blob
      const timestamp = new Date().getTime();
      const file = new File([blob], `camera-${timestamp}.jpg`, {
        type: "image/jpeg",
      });

      // Process the captured photo (mark as 'camera' source - NO GPS EXTRACTION)
      processFiles([file], 'camera');

      // Stop camera after capturing
      stopCamera();
    }, "image/jpeg", 0.9);
  };

  const switchCamera = async () => {
    if (!stream) return;

    // Stop current stream
    stream.getTracks().forEach((track) => track.stop());

    // Get current facing mode
    const currentTrack = stream.getVideoTracks()[0];
    const currentSettings = currentTrack.getSettings();
    const currentFacingMode = currentSettings.facingMode;

    // Switch to opposite facing mode
    const newFacingMode = currentFacingMode === "environment" ? "user" : "environment";

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: newFacingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      toast.success("Kamera berhasil diganti");
    } catch (error) {
      console.error("Error switching camera:", error);
      toast.error("Tidak dapat mengganti kamera");

      // Restart with original facing mode
      startCamera();
    }
  };

  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500">*</span>}
        {enableGPSExtraction && (
          <span className="ml-2 text-xs text-blue-600 font-normal">
            (GPS akan diekstrak otomatis)
          </span>
        )}
      </label>

      {/* Camera Modal */}
      {showCamera && enableCamera && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
          <div className="relative w-full h-full max-w-4xl max-h-screen flex flex-col">
            {/* Video Preview */}
            <div className="flex-1 flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              />
            </div>

            {/* Camera Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-center items-center gap-4 bg-gradient-to-t from-black/80 to-transparent">
              <Button
                type="button"
                onClick={stopCamera}
                variant="outline"
                className="bg-white/20 border-white text-white hover:bg-white/30"
              >
                <Icon icon="mdi:close" className="w-5 h-5 mr-2" />
                Batal
              </Button>

              <Button
                type="button"
                onClick={capturePhoto}
                className="bg-white text-black hover:bg-gray-200 w-16 h-16 rounded-full p-0"
              >
                <Icon icon="mdi:camera" className="w-8 h-8" />
              </Button>

              <Button
                type="button"
                onClick={switchCamera}
                variant="outline"
                className="bg-white/20 border-white text-white hover:bg-white/30"
              >
                <Icon icon="mdi:camera-flip" className="w-5 h-5 mr-2" />
                Putar
              </Button>
            </div>
          </div>

          {/* Hidden canvas for capturing */}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-8 transition-all ${
          isDragging
            ? "border-blue-600 bg-blue-50"
            : "border-gray-300 hover:border-blue-400"
        } ${isProcessing ? "opacity-50 pointer-events-none" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          disabled={files.length >= maxFiles || isProcessing}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />

        {isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl z-10">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-700">
                Memproses foto...
              </p>
            </div>
          </div>
        )}

        {previewUrls.length > 0 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />

                  {/* GPS Badge */}
                  {gpsData[index] && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <Icon icon="mdi:map-marker" className="w-3 h-3" />
                      GPS
                    </div>
                  )}

                  {/* Remove Button - Always Visible */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage(index);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-lg transition-all hover:scale-110 z-10"
                    title="Hapus foto"
                  >
                    <Icon icon="mdi:close" className="w-5 h-5" />
                  </button>

                  {/* GPS Info on Hover */}
                  {gpsData[index] && (
                    <div className="absolute bottom-2 left-2 right-2 bg-black/70 text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="font-semibold mb-0.5">Koordinat GPS:</p>
                      <p>Lat: {gpsData[index]!.latitude.toFixed(6)}</p>
                      <p>Long: {gpsData[index]!.longitude.toFixed(6)}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 text-center">
              {files.length} foto dipilih.{" "}
              {files.length < maxFiles && "Klik + untuk menambah foto lagi."}
            </p>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon icon="mdi:cloud-upload" className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-sm font-semibold text-gray-700 mb-1">
              Upload {label}
            </p>
            <p className="text-xs text-gray-500">
              Drag & drop atau klik untuk upload
              {required && " (minimal 1 foto)"}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              PNG, JPG, JPEG (Max 5MB per file)
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {/* Camera Button */}
        {enableCamera && files.length < maxFiles && (
          <Button
            type="button"
            onClick={startCamera}
            disabled={isProcessing}
            variant="outline"
            className="border-blue-600 text-blue-600 hover:bg-blue-50 disabled:opacity-50"
          >
            <Icon icon="mdi:camera" className="w-5 h-5 mr-2" />
            Ambil Foto dengan Kamera
          </Button>
        )}
      </div>

      {/* Info Text */}
      <div className="mt-3 space-y-1">
        <p className="text-xs text-gray-500 flex items-start gap-1">
          <Icon icon="mdi:information" className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>
            {enableCamera && enableGPSExtraction
              ? "Upload foto untuk ekstraksi GPS otomatis, atau ambil foto langsung (tanpa GPS)."
              : enableCamera
              ? "Anda dapat mengupload foto atau mengambil foto langsung dengan kamera."
              : enableGPSExtraction
              ? "Upload foto dengan data GPS untuk ekstraksi koordinat otomatis."
              : "Upload foto untuk dokumentasi."}
          </span>
        </p>
        {enableGPSExtraction && (
          <p className="text-xs text-amber-600 flex items-start gap-1">
            <Icon icon="mdi:alert-circle" className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>
              GPS hanya diekstrak dari foto yang di-upload. Foto dari kamera tidak memiliki data GPS.
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
