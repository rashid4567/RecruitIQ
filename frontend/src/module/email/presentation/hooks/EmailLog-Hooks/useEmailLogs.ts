import { useEffect, useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import type { EmailLog } from "@/module/email/domain/entity/email-log.entity";
import { ApiEmailLogRepository } from "@/module/email/infrastructure/repositories/ApiEmailLogRepository";
import { GetEmailLogUseCase } from "@/module/email/application/usecase/email-logs/GetEmailLogs.usecase";

export function useEmailLogs() {
  const repo = useMemo(() => new ApiEmailLogRepository(), []);
  const useCase = useMemo(() => new GetEmailLogUseCase(repo), [repo]);
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const fetchLogs = useCallback(
  async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError(null);

    try {
      const data = await useCase.execute();

     const sorted = [...data].sort(
  (a, b) =>
    new Date(b.getCreatedAt()).getTime() -
    new Date(a.getCreatedAt()).getTime(),
);
      setLogs(sorted);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to load email logs";

      setError(msg);

      toast.error(msg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  },
  [useCase],
);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return {
    logs,
    loading,
    error,
    refreshing,
    fetchLogs,
  };
}
