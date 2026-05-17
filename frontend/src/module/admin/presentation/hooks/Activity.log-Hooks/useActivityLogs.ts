import { useState, useCallback, useEffect, useMemo } from "react";
import { ActivityLog } from "@/module/admin/domain/entities/activity-log.enitity";
import { ApiActivityLogRepository } from "../../../infrastructure/repositories/Api-Activity.log.repository";
import { GetActivityLogUseCase } from "../../../application/useCases/activityLogs/GetActivity-logs.usecase";
import { getValue } from "../../components/activity.logger/Activitylog.helpers"; 

interface PaginationState {
  page: number;
  limit: number;
  total: number;
}

export function useActivityLogs() {
  const repo = useMemo(() => new ApiActivityLogRepository(), []);
  const useCase = useMemo(() => new GetActivityLogUseCase(repo), [repo]);

  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 12,
    total: 0,
  });

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
            new Date(
              getValue(b, "getTimestamp", "timestamp") || 0
            ).getTime() -
            new Date(
              getValue(a, "getTimestamp", "timestamp") || 0
            ).getTime()
        );
        setLogs(sorted);
        setPagination((p) => ({ ...p, page: 1, total: sorted.length }));
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Could not load activity logs";
        setError(message);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [useCase]
  );

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const filtered = logs.filter((log) => {
    const desc = (getValue(log, "getAction", "action") || "").toLowerCase();
    const name = (
      getValue(log, "getMetadata", "metadata")?.fullName ||
      getValue(log, "getUserId", "userId") ||
      ""
    ).toLowerCase();
    const role = (
      getValue(log, "getMetadata", "metadata")?.role || ""
    ).toLowerCase();
    const q = search.toLowerCase();
    return desc.includes(q) || name.includes(q) || role.includes(q);
  });

  const totalPages = Math.ceil(filtered.length / pagination.limit);

  const paginated = filtered.slice(
    (pagination.page - 1) * pagination.limit,
    pagination.page * pagination.limit
  );

  const changePage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPagination((p) => ({ ...p, page: newPage }));
  };

  const changeLimit = (limit: number) => {
    setPagination((p) => ({ ...p, limit, page: 1 }));
  };

  const stats = useMemo(() => {
    const errors = logs.filter((l) => {
      const a = (getValue(l, "getAction", "action") || "").toUpperCase();
      return (
        a.includes("ERROR") || a.includes("FAIL") || a.includes("CRITICAL")
      );
    }).length;

    const today = logs.filter((l) => {
      const d = new Date(getValue(l, "getTimestamp", "timestamp") || 0);
      return d.toDateString() === new Date().toDateString();
    }).length;

    const mostRecentUser =
      logs[0]
        ? getValue(logs[0], "getMetadata", "metadata")?.fullName ||
          getValue(logs[0], "getMetadata", "metadata")?.userName ||
          getValue(logs[0], "getUserId", "userId") ||
          "—"
        : "—";

    return { total: logs.length, errors, today, mostRecentUser };
  }, [logs]);

  return {
    logs,
    filtered,
    paginated,
    loading,
    error,
    refreshing,
    search,
    setSearch,
    pagination,
    totalPages,
    changePage,
    changeLimit,
    fetchLogs,
    stats,
  };
}