import { useState, useCallback } from "react";
import { GetApplicationDetailUC } from "../../di/application.di";
import type { ApplicationDetailDTO } from "../../../domain/repository/application.repository";

export function useApplicationDetail() {
  const [loading, setLoading] = useState(false);

  const [applicationDetail, setApplicationDetail] =
    useState<ApplicationDetailDTO | null>(null);

  const [error, setError] = useState<string | null>(null);

  const fetchApplicationDetail = useCallback(async (applicationId: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await GetApplicationDetailUC.execute(applicationId);

      setApplicationDetail(result);

      return result;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to load application details";

      setError(message);

      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    applicationDetail,
    fetchApplicationDetail,
  };
}
