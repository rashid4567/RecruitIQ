import { useState, useCallback } from "react";
import { getResumeDownloadUrl } from "../api/resume.api";

export function useResumeActions(resumeId: string) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [loadingDownload, setLoadingDownload] = useState(false);
  const [iframeReady, setIframeReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUrl = useCallback(async (): Promise<string | null> => {
    try {
      return await getResumeDownloadUrl(resumeId);
    } catch {
      setError("Could not load resume. Please try again.");
      return null;
    }
  }, [resumeId]);

  const openPreview = useCallback(async () => {
    setLoadingPreview(true);
    setError(null);
    setIframeReady(false);
    const url = await fetchUrl();
    if (url) setPreviewUrl(url);
    setLoadingPreview(false);
  }, [fetchUrl]);

  const closePreview = useCallback(() => {
    setPreviewUrl(null);
    setIframeReady(false);
  }, []);

  const download = useCallback(async () => {
    setLoadingDownload(true);
    setError(null);
    const url = await fetchUrl();
    if (url) {
      const link = document.createElement("a");
      link.href = url;
      link.download = "";
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    setLoadingDownload(false);
  }, [fetchUrl]);

  const clearError = useCallback(() => setError(null), []);

  return {
    previewUrl,
    loadingPreview,
    loadingDownload,
    iframeReady,
    setIframeReady,
    error,
    openPreview,
    closePreview,
    download,
    clearError,
  };
}
