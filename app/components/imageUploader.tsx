import React, { useState, useRef } from "react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

export interface ImageUploaderProps {
  onFilesSelected?: (files: File[]) => void;
  onPreviewUrlsUpdated?: (urls: string[]) => void;
  maxFiles?: number;
  label?: string;
  required?: boolean;
  className?: string;
}

export default function ImageUploader({
  onFilesSelected,
  onPreviewUrlsUpdated,
  maxFiles = 2,
  label = "Foto Lokasi",
  required = false,
  className = "",
}: ImageUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Process uploaded files
   * @param newFiles - Array of files to process
   */
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

    setIsProcessing(true);

    try {
      const newFilesList = [...files, ...imageFiles];
      const newPreviewUrls = [...previewUrls];

      // Process each image file
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        
        // Create preview URL
        const previewUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        newPreviewUrls.push(previewUrl);
      }

      setFiles(newFilesList);
      setPreviewUrls(newPreviewUrls);
      onFilesSelected?.(newFilesList);
      onPreviewUrlsUpdated?.(newPreviewUrls);

      toast.success(`${imageFiles.length} foto berhasil diupload`);
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

    toast.success("Foto berhasil dihapus");
  };

  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500"> * </span>}
        <span className="text-blue-500 font-medium">(Maksimal {maxFiles} foto)</span>
      </label>

      {/* File Upload Area with Preview */}
      <div className="space-y-4">
        <div
          className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 transition-colors ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'hover:border-blue-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            disabled={files.length >= maxFiles || isProcessing}
          />

          {previewUrls.length === 0 ? (
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Icon icon="mdi:cloud-upload" className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="mt-3 text-sm font-medium text-gray-900">
                {label} {required && <span className="text-red-500">*</span>}
              </h4>
              <p className="mt-1 text-xs text-gray-500">
                Klik untuk memilih file gambar atau tarik dan lepas di sini
              </p>
              <p className="mt-1 text-xs text-gray-400">
                JPG, PNG (Maks. 5MB per file, maks. {maxFiles} file)
              </p>
            </div>
          ) : (
            <div className="w-full">
              <div className="grid grid-cols-2 gap-3 mb-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(index);
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Hapus gambar"
                    >
                      <Icon icon="mdi:close" className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                
                {files.length < maxFiles && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-4 cursor-pointer hover:border-blue-400 transition-colors">
                    <Icon icon="mdi:plus" className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-xs text-gray-500 text-center">
                      Tambah Foto
                      <span className="block text-gray-400">
                        ({files.length}/{maxFiles})
                      </span>
                    </p>
                  </div>
                )}
              </div>
              
              <p className="text-xs text-center text-gray-500 mt-2">
                Klik untuk menambah atau ganti foto
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
