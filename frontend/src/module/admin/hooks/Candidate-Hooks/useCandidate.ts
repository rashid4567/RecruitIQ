import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "use-debounce";

import { getCandidates } from "@/module/admin/api/adminCandidate.api";

import type {
  CandidateListItem,
  CandidateQueryParams,
} from "../../types/candidate.types"

import type {
  FilterStatusUI,
  UseCandidatesOptions,
} from "../../../activity.logger/presentation/types/useCandidate.types";

export function useCandidates(options?: UseCandidatesOptions) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch] = useDebounce(searchTerm, 500);

  const [filterStatus, setFilterStatus] =
    useState<FilterStatusUI>("All");

  const [candidates, setCandidates] = useState<CandidateListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [actionLoading] = useState<Record<string, boolean>>({});

  const [pagination, setPagination] = useState({
    page: options?.initialPage ?? 1,
    limit: options?.initialLimit ?? 10,
    total: 0,
    totalPages: 1,
  });

  const mapStatusToQuery = (
    status: FilterStatusUI,
  ): boolean | undefined => {
    if (status === "All") return undefined;
    return status === "Active";
  };

  const loadCandidates = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params: CandidateQueryParams = {
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearch || undefined,
        isActive: mapStatusToQuery(filterStatus),
      };

      const response = await getCandidates(params);

      setCandidates(response.candidates);

      setPagination((prev) => ({
        ...prev,
        total: response.pagination.total,
        totalPages: Math.ceil(
          response.pagination.total / prev.limit,
        ),
      }));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load candidates",
      );
    } finally {
      setLoading(false);
    }
  }, [
    pagination.page,
    pagination.limit,
    debouncedSearch,
    filterStatus,
  ]);

  useEffect(() => {
    loadCandidates();
  }, [loadCandidates]);

  const changePage = (page: number) => {
    if (page < 1 || page > pagination.totalPages) return;

    setPagination((prev) => ({
      ...prev,
      page,
    }));
  };

  const changeLimit = (limit: number) => {
    setPagination((prev) => ({
      ...prev,
      limit,
      page: 1,
    }));
  };

  return {
    candidates,
    loading,
    error,
    pagination,
    actionLoading,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    refresh: loadCandidates,
    changePage,
    changeLimit,
  };
}