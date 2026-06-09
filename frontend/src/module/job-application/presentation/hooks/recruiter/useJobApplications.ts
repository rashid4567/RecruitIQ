import { useState, useCallback } from "react";
import { GetApplicationsByJobUC } from "../../di/application.di";
import type { RecruiterApplication } from "@/module/job-application/domain/repository/application.repository"; 

export function useJobApplications() {
  const [loading, setLoading] = useState(false);

  const [applications, setApplications] = useState<
    RecruiterApplication[]
  >([]);

  const [error, setError] = useState<string | null>(null);

  const fetchApplications = useCallback(
    async (jobId: string): Promise<RecruiterApplication[]> => {
      setLoading(true);
      setError(null);

      try {
        const result =
          await GetApplicationsByJobUC.execute(jobId);

        setApplications(result);

        return result;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to fetch applications";

        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const clearApplications = useCallback(() => {
    setApplications([]);
    setError(null);
  }, []);

  return {
    loading,
    error,
    applications,
    fetchApplications,
    clearApplications,
  };
}