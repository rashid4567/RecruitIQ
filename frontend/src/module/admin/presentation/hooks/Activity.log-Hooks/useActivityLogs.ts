import { useEffect, useState, useCallback } from "react";
import { ActivityLog } from "@/module/admin/domain/entities/activity-log.enitity";
import { GetActivityLogUC } from "../../di/activity-log.di";
import type { ActivityLogViewModel } from "../../types/activityLog.ViewModal";




function getSeverity(action: string): ActivityLogViewModel["severity"] {
  const a = action.toUpperCase();

  if (a.includes("ERROR") || a.includes("FAIL")) return "error";
  if (a.includes("CREATED") || a.includes("SUCCESS")) return "success";
  if (a.includes("UPDATE") || a.includes("LOGIN")) return "info";

  return "info";
}

function mapToViewModel(log: ActivityLog): ActivityLogViewModel {
  return {
    id: log.getEntityId() ?? crypto.randomUUID(),
    userName: log.getUserName(),
    action: log.getAction(),
    entity: log.getEntity() ?? "—",
    timestamp: log.getTimestamp(),
    severity: getSeverity(log.getAction()),
  };
}

export function useActivityLogs() {
  const [logs, setLogs] = useState<ActivityLogViewModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await GetActivityLogUC.execute();

      const sorted = data
        .sort(
          (a: { getTimestamp: () => string | number | Date; }, b: { getTimestamp: () => string | number | Date; }) =>
            new Date(b.getTimestamp()).getTime() -
            new Date(a.getTimestamp()).getTime()
        )
        .map(mapToViewModel);

      setLogs(sorted);
    } catch (err: any) {
      setError(err?.message ?? "Failed to load activity logs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return {
    logs,
    loading,
    error,
    refresh: fetchLogs,
  };
}