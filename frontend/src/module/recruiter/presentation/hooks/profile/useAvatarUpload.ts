import { useState } from "react";
import { toast } from "sonner";

interface UseAvatarUploadOptions {
  maxSizeMB?: number;
  allowedTypes?: string[];
}

export function useAvatarUpload(options?: UseAvatarUploadOptions) {
  const maxSize = (options?.maxSizeMB ?? 5) * 1024 * 1024;

  const allowedTypes = options?.allowedTypes ?? [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
  ];

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const validateFile = (file: File) => {
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type", {
        description: "Please upload JPEG, PNG, WEBP, or GIF images only.",
      });
      return false;
    }

    if (file.size > maxSize) {
      toast.error("File too large", {
        description: `Please upload an image smaller than ${maxSize / 1024 / 1024}MB.`,
      });
      return false;
    }

    return true;
  };

  const generatePreview = (file: File) => {
    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!validateFile(selectedFile)) return;

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 100);

      const previewUrl = await generatePreview(selectedFile);

      setFile(selectedFile);
      setPreview(previewUrl);

      setTimeout(() => {
        clearInterval(interval);
        setUploadProgress(0);
        setIsUploading(false);
      }, 1000);
    } catch (error) {
      console.error("Avatar upload error:", error);
      toast.error("Failed to process image");
      setIsUploading(false);
    }
  };

  const removeAvatar = () => {
    setFile(null);
    setPreview(null);
    setUploadProgress(0);
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setUploadProgress(0);
    setIsUploading(false);
  };

  return {
    file,
    preview,
    uploadProgress,
    isUploading,

    handleFileChange,
    removeAvatar,
    reset,
  };
}
