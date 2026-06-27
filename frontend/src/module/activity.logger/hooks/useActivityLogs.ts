import { useState, useCallback, useEffect, useMemo } from "react";

import type { ActivityLog } from "../types/activity-log.types";
import { getActivityLogs } from "../api/activity-log.api";
import { getActivityUserName } from "../utils/activity-log.utils";

interface PaginationState {
  page: number;
  limit: number;
  total: number;
}

export function useActivityLogs() {
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

  const fetchLogs = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError(null);

    try {
      const data = await getActivityLogs();

      const sorted = [...data].sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );

      setLogs(sorted);

      setPagination((prev) => ({
        ...prev,
        page: 1,
        total: sorted.length,
      }));
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Could not load activity logs",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const filtered = useMemo(() => {
    const query = search.toLowerCase();

    return logs.filter((log) => {
      const action = log.action.toLowerCase();
      const userName = getActivityUserName(log).toLowerCase();

      const role = (
        (log.metadata?.role as string | undefined) ?? ""
      ).toLowerCase();

      return (
        action.includes(query) ||
        userName.includes(query) ||
        role.includes(query)
      );
    });
  }, [logs, search]);

  const totalPages = Math.ceil(filtered.length / pagination.limit);

  const paginated = useMemo(() => {
    const start = (pagination.page - 1) * pagination.limit;

    return filtered.slice(start, start + pagination.limit);
  }, [filtered, pagination]);

  const changePage = useCallback(
    (page: number) => {
      if (page < 1 || page > totalPages) return;

      setPagination((prev) => ({
        ...prev,
        page,
      }));
    },
    [totalPages],
  );

  const changeLimit = useCallback((limit: number) => {
    setPagination((prev) => ({
      ...prev,
      limit,
      page: 1,
    }));
  }, []);

  const stats = useMemo(() => {
    const errors = logs.filter((log) => {
      const action = log.action.toUpperCase();

      return (
        action.includes("ERROR") ||
        action.includes("FAIL") ||
        action.includes("CRITICAL")
      );
    }).length;
    const today = logs.filter((log) => {
      const date = new Date(log.timestamp);
      return date.toDateString() === new Date().toDateString();
    }).length;

    const mostRecentUser = logs.length > 0 ? getActivityUserName(logs[0]) : "—";

    return {
      total: logs.length,
      errors,
      today,
      mostRecentUser,
    };
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
