import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import type { EmailLog } from "../../types/email.types";
import { getEmailLogs } from "../../api/email.api"; 

export function useEmailLogs() {
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError(null);

    try {
      const data = await getEmailLogs();

      const sorted = data.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime(),
      );

      setLogs(sorted);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load email logs";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return {
    logs,
    loading,
    refreshing,
    error,
    fetchLogs,
  };
}