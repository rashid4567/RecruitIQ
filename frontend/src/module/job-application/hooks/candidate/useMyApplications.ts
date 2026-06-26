import { useEffect, useState, useCallback } from "react";

import { getMyApplications } from "../../api/application.api";

import type { CandidateApplication } from "../../types/application.types";

export const useMyApplications = () => {
  const [applications, setApplications] = useState<CandidateApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getMyApplications();

      setApplications(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load applications",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  return {
    applications,
    loading,
    error,
    refresh: loadApplications,
  };
};