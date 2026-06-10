import { useState, useCallback } from "react";
import { GetRecruiterApplicationDetailsUC } from "../../di/application.di";
import type { RecruiterApplicationDetails } from "@/module/job-application/domain/dto/RecruiterApplicationDetails";

export function useRecruiterApplicationDetails() {
  const [loading, setLoading] = useState(false);

  const [application, setApplication] =
    useState<RecruiterApplicationDetails | null>(null);

  const [error, setError] = useState<string | null>(null);

  const fetchApplicationDetails = useCallback(
    async (applicationId: string): Promise<RecruiterApplicationDetails> => {
      setLoading(true);
      setError(null);

      try {
        const result =
          await GetRecruiterApplicationDetailsUC.execute(applicationId);

        setApplication(result);

        return result;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to fetch application details";

        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const clearApplication = useCallback(() => {
    setApplication(null);
    setError(null);
  }, []);

  return {
    loading,
    error,
    application,
    fetchApplicationDetails,
    clearApplication,
  };
}
