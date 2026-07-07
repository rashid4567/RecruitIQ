import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { getRecruiterDashboard } from "../api/dashboard.api";
import type { RecruiterDashboardResponse } from "../types/recruiter-dashboard.types";

export const useRecruiterDashboard = () => {
  const [dashboard, setDashboard] = useState<RecruiterDashboardResponse | null>(
    null,
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getRecruiterDashboard();
      setDashboard(data);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch recruiter dashboard.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    dashboard,
    loading,
    error,
    refresh: fetchDashboard,
    hasData: dashboard !== null,
    isEmpty:
      dashboard !== null &&
      dashboard.jobs.length === 0 &&
      dashboard.applications.length === 0,
  };
};
