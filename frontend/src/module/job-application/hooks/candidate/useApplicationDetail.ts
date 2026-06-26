import { useState, useCallback } from "react";

import { getApplicationById } from "../../api/application.api";

import type { ApplicationDetailDTO } from "../../types/application.types";

export function useApplicationDetail() {
  const [loading, setLoading] = useState(false);
  const [applicationDetail, setApplicationDetail] =
    useState<ApplicationDetailDTO | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchApplicationDetail = useCallback(
    async (applicationId: string) => {
      try {
        setLoading(true);
        setError(null);

        const result = await getApplicationById(applicationId);

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
    },
    [],
  );

  return {
    loading,
    error,
    applicationDetail,
    fetchApplicationDetail,
  };
}