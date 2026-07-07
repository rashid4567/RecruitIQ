import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { getAdminDashboard } from "../api/dashboard.api";
import type { AdminDashboardResponse } from "../types/admin-dashboard.types";

export const useAdminDashboard = () => {
  const [dashboard, setDashboard] = useState<AdminDashboardResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAdminDashboard();
      setDashboard(data);
      setLastUpdated(new Date().toISOString());
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch admin dashboard.";
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
    lastUpdated,
    refresh: fetchDashboard,
  };
};
