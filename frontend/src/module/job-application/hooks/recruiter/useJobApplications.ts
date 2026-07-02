import { useState, useCallback } from "react";
import { getApplicationsByJob } from "../../api/recruiter-application.api";
import type { RecruiterApplication } from "../../types/application.types";

export function useJobApplications() {
  const [loading, setLoading] =useState(false);
  const [applications, setApplications] = useState<
    RecruiterApplication[]
  >([]);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = useCallback(
    async (
      jobId: string,
    ): Promise<RecruiterApplication[]> => {
      try {
        setLoading(true);
        setError(null);

        const result = await getApplicationsByJob(jobId);

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