import { useState } from "react";
import { toast } from "sonner";

interface UseImageUploadOptions {
  maxSizeMB?: number;
  allowedTypes?: string[];
  onSuccess?: (imageData: string) => void;
  onError?: (error: Error) => void;
}

export function useImageUpload(onSuccess?: (img: string) => void) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateImage = (file: File): boolean => {
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return false;
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image (JPEG, PNG, WebP, GIF)");
      return false;
    }

    return true;
  };

  const uploadImage = async (file: File) => {
    if (!validateImage(file)) return;

    setUploading(true);
    setError(null);

    try {

      const previewReader = new FileReader();
      previewReader.onload = () => {
        if (typeof previewReader.result === "string") {
          setPreview(previewReader.result);
        }
      };
      previewReader.readAsDataURL(file);

      const data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      onSuccess?.(data);
      toast.success("Image uploaded successfully!");
      
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to upload image";
      setError(message);
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  const clearPreview = () => {
    setPreview(null);
  };

  return {
    uploadImage,
    uploading,
    preview,
    error,
    clearPreview,
  };
}