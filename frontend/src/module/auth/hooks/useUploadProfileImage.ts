import { useState } from "react";
import { uploadProfileImage } from "../api/auth.api";

export function useUploadProfileImage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const upload = async (file: File): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      await uploadProfileImage(file);

      return true;
    } catch (err) {
      setImagePreview(null);
      setError(err instanceof Error ? err.message : "Upload failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearPreview = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
  };

  return {
    upload,
    loading,
    error,
    imagePreview,
    clearPreview,
  };
}
