import { useCallback, useEffect, useState } from "react";
import { GetRecruiterApplicationDetailsUC } from "../../di/application.di";
import type { RecruiterApplicationDetails } from "@/module/job-application/domain/dto/RecruiterApplicationDetails";

interface UseRecruiterApplicationDetailsReturn {
  loading: boolean;
  error: string | null;
  application: RecruiterApplicationDetails | null;
  fetchApplicationDetails: (
    applicationId: string,
  ) => Promise<RecruiterApplicationDetails>;
  clearApplication: () => void;
}

export function useRecruiterApplicationDetails(
  applicationId?: string,
): UseRecruiterApplicationDetailsReturn {
  const [loading, setLoading] = useState(false);
  const [application, setApplication] =
    useState<RecruiterApplicationDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchApplicationDetails = useCallback(
    async (id: string): Promise<RecruiterApplicationDetails> => {
      try {
        setLoading(true);
        setError(null);

        const result = await GetRecruiterApplicationDetailsUC.execute(id);
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

  useEffect(() => {
    if (!applicationId) {
      return;
    }
    void fetchApplicationDetails(applicationId);
  }, [applicationId, fetchApplicationDetails]);

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
