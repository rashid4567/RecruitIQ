import { useState, useCallback } from "react";
import { deleteResumeUC, downloadResumeUC, uploadResumeUC } from "../di/resume.di";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ResumeFile {
  name: string;
  size: number;
  uploadedAt: Date;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

// ─── Validation ───────────────────────────────────────────────────────────────

function validateFile(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return "Only PDF or Word documents (.pdf, .doc, .docx) are accepted.";
  }
  if (file.size > MAX_SIZE_BYTES) {
    return `File size must be under ${MAX_SIZE_MB} MB.`;
  }
  return null;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useResume = (initialResume?: ResumeFile | null) => {
  const [resume, setResume] = useState<ResumeFile | null>(initialResume ?? null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Upload ──────────────────────────────────────────────────────────────────

  const uploadResume = useCallback(async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate progress ticks until the real upload completes.
    // Replace with real progress callbacks if your UC supports it.
    const interval = setInterval(() => {
      setUploadProgress((prev) => (prev < 85 ? prev + Math.random() * 15 : prev));
    }, 300);

    try {
      await uploadResumeUC.execute(file);

      clearInterval(interval);
      setUploadProgress(100);

      setResume({
        name: file.name,
        size: file.size,
        uploadedAt: new Date(),
      });

      toast.success("Resume uploaded successfully");
    } catch (err) {
      clearInterval(interval);
      setError("Upload failed. Please try again.");
      toast.error("Failed to upload resume");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, []);

  // ── Download ────────────────────────────────────────────────────────────────

  const downloadResume = useCallback(async () => {
    setIsDownloading(true);
    try {
      const url = await downloadResumeUC.execute();
      window.open(url, "_blank");
    } catch (err) {
      toast.error("Failed to download resume");
    } finally {
      setIsDownloading(false);
    }
  }, []);

  // ── Delete ──────────────────────────────────────────────────────────────────

  const deleteResume = useCallback(async () => {
    setIsDeleting(true);
    try {
      await deleteResumeUC.execute();
      setResume(null);
      setError(null);
      toast.success("Resume deleted successfully");
    } catch (err) {
      toast.error("Failed to delete resume");
    } finally {
      setIsDeleting(false);
    }
  }, []);

  // ── Clear error helper ──────────────────────────────────────────────────────

  const clearError = useCallback(() => setError(null), []);

  return {
    // State
    resume,
    isUploading,
    uploadProgress,
    isDeleting,
    isDownloading,
    error,
    // Actions
    uploadResume,
    downloadResume,
    deleteResume,
    clearError,
  };
};