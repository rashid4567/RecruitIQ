import { useCallback, useState } from "react";
import { downloadResumeUC } from "../di/resume.di";

export function useDownloadResume() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadResume = useCallback(
    async (resumeId: string): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        const downloadUrl = await downloadResumeUC.execute(resumeId);

        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = "";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        return true;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to download resume";

        setError(message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    downloadResume,
    loading,
    error,
  };
}