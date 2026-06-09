import { useState, useCallback } from "react";
import { toast } from "sonner";

import {
  deleteResumeUC,
  downloadResumeUC,
  uploadResumeUC,
} from "../di/resume.di";

import { Resume } from "../../domain/entity/Resume.entity";

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

function validateFile(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return "Only PDF or Word documents (.pdf, .doc, .docx) are accepted.";
  }

  if (file.size > MAX_SIZE_BYTES) {
    return `File size must be under ${MAX_SIZE_MB} MB.`;
  }

  return null;
}

export const useResume = (initialResume?: Resume | null) => {
  const [resume, setResume] = useState<Resume | null>(initialResume ?? null);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [isDeleting, setIsDeleting] = useState(false);

  const [isDownloading, setIsDownloading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const uploadResume = useCallback(async (file: File) => {
    console.log("Uploading file :", uploadResume);

    const validationError = validateFile(file);

    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    setError(null);
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) =>
        prev < 85 ? prev + Math.random() * 15 : prev,
      );
    }, 300);

    try {
      const uploadedResume = await uploadResumeUC.execute(file);

      clearInterval(interval);

      setUploadProgress(100);

      setResume(uploadedResume);

      toast.success("Resume uploaded successfully");
    } catch (error) {
      console.log(error);
      clearInterval(interval);

      setError("Upload failed. Please try again.");

      toast.error("Failed to upload resume");
    } finally {
      setIsUploading(false);

      setTimeout(() => {
        setUploadProgress(0);
      }, 500);
    }
  }, []);

  const downloadResume = useCallback(async () => {
    try {
      setIsDownloading(true);
      if (!resume?.getId()) {
        toast.error("Resume not found");
        return;
      }

      const url = await downloadResumeUC.execute(resume.getId());

      window.open(url, "_blank");
    } catch (error) {
      console.log(error);
      toast.error("Failed to download resume");
    } finally {
      setIsDownloading(false);
    }
  }, []);

  const deleteResume = useCallback(async () => {
    try {
      setIsDeleting(true);

      await deleteResumeUC.execute();

      setResume(null);

      setError(null);

      toast.success("Resume deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete resume");
    } finally {
      setIsDeleting(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    resume,
    isUploading,
    uploadProgress,
    isDeleting,
    isDownloading,
    error,
    uploadResume,
    downloadResume,
    deleteResume,
    clearError,
    hasResume: !!resume,
  };
};
