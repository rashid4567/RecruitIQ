import { useState, useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";

import {
  getResumeDownloadUrl as getResumeDownloadUrlApi,
  uploadResume as uploadResumeApi,
  getMyResume,
  deleteResume as deleteResumeApi,
} from "../api/resume.api";
import { type Resume, ResumeParseStatus } from "../types/resume.types";

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

export const useResume = () => {
  const [resume, setResume] = useState<Resume | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  const startPolling = useCallback(() => {
    stopPolling();

    pollingRef.current = setInterval(async () => {
      try {
        const latestResume = await getMyResume();

        setResume(latestResume);

        const status = latestResume.parseStatus;

        if (status === ResumeParseStatus.COMPLETED) {
          stopPolling();
          toast.success("Resume analysis completed");
        }

        if (status === ResumeParseStatus.FAILED) {
          stopPolling();
          toast.error(
            "Resume analysis failed. Please upload your resume again.",
          );
        }
      } catch (error) {
        console.error(error);
        stopPolling();
      }
    }, 3000);
  }, [stopPolling]);

  const refreshResume = useCallback(async () => {
    try {
      const latestResume = await getMyResume();

      setResume(latestResume);

      const status = latestResume.parseStatus;

      if (
        status === ResumeParseStatus.PENDING ||
        status === ResumeParseStatus.PROCESSING
      ) {
        startPolling();
      }

      return latestResume;
    } catch (error) {
      console.error(error);
      return null;
    }
  }, [startPolling]);

  useEffect(() => {
    const loadResume = async () => {
      try {
        const existingResume = await getMyResume();

        setResume(existingResume);

        const status = existingResume.parseStatus;

        if (
          status === ResumeParseStatus.PENDING ||
          status === ResumeParseStatus.PROCESSING
        ) {
          startPolling();
        }
      } catch (error) {
        console.error("No resume found", error);
        setResume(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadResume();

    return () => {
      stopPolling();
    };
  }, [startPolling, stopPolling]);

  const uploadResume = useCallback(
    async (file: File) => {
      const validationError = validateFile(file);

      if (validationError) {
        setError(validationError);
        toast.error(validationError);
        return;
      }

      setError(null);
      setIsUploading(true);
      setUploadProgress(0);

      const progressInterval = setInterval(() => {
        setUploadProgress((prev) =>
          prev < 85 ? prev + Math.random() * 15 : prev,
        );
      }, 300);

      try {
        const uploadedResume = await uploadResumeApi(file);

        clearInterval(progressInterval);

        setUploadProgress(100);
        setResume(uploadedResume);

        toast.success("Resume uploaded successfully");

        const status = uploadedResume.parseStatus;

        if (
          status === ResumeParseStatus.PENDING ||
          status === ResumeParseStatus.PROCESSING
        ) {
          startPolling();
        }
      } catch (error) {
        console.error(error);

        clearInterval(progressInterval);

        setError("Upload failed. Please try again.");
        toast.error("Failed to upload resume");
      } finally {
        setIsUploading(false);

        setTimeout(() => {
          setUploadProgress(0);
        }, 500);
      }
    },
    [startPolling],
  );

  const downloadResume = useCallback(async () => {
    try {
      setIsDownloading(true);

      if (!resume?.id) {
        toast.error("Resume not found");
        return;
      }

      const url = await getResumeDownloadUrlApi(resume.id);
      window.open(url, "_blank");
    } catch (error) {
      console.error(error);
      toast.error("Failed to download resume");
    } finally {
      setIsDownloading(false);
    }
  }, [resume]);

  const deleteResume = useCallback(async () => {
    if (isDeleting) return;

    try {
      setIsDeleting(true);
      stopPolling();
      await deleteResumeApi();
      setResume(null);
      setError(null);

      toast.success("Resume deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete resume");
    } finally {
      setIsDeleting(false);
    }
  }, [isDeleting, stopPolling]);
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const parseStatus = resume?.parseStatus;
  const isResumeReady = parseStatus === ResumeParseStatus.COMPLETED;
  const isResumeProcessing =
    parseStatus === ResumeParseStatus.PENDING ||
    parseStatus === ResumeParseStatus.PROCESSING;
  const isResumeFailed = parseStatus === ResumeParseStatus.FAILED;

  return {
    resume,
    hasResume: !!resume,
    isLoading,
    isUploading,
    isDeleting,
    isDownloading,
    uploadProgress,
    error,
    parseStatus,
    isResumeReady,
    isResumeProcessing,
    isResumeFailed,
    uploadResume,
    downloadResume,
    deleteResume,
    refreshResume,
    clearError,
  };
};
