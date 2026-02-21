import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "use-debounce";

import type { Candidate } from "@/module/admin/domain/entities/candidates.entity";
import type { GetCandidatesQuery } from "@/module/admin/application/dto/get-candidates.query";

import { GetCandidateListUC } from "../di/candidate.di";
import type { FilterStatusUI, UseCandidatesOptions } from "../types/useCandidate.types";


export function useCandidates(options?: UseCandidatesOptions) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch] = useDebounce(searchTerm, 500);

  const [filterStatus, setFilterStatus] = useState<FilterStatusUI>("All");

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [actionLoading] = useState<Record<string, boolean>>(
    {},
  );

  const [pagination, setPagination] = useState({
    page: options?.initialPage ?? 1,
    limit: options?.initialLimit ?? 10,
    total: 0,
    totalPages: 1,
  });

  const mapStatusToQuery = (status: FilterStatusUI): boolean | undefined => {
    if (status === "All") return undefined;
    return status === "Active";
  };

  const loadCandidates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const query: GetCandidatesQuery = {
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearch || undefined,
        status: mapStatusToQuery(filterStatus),
      };

      const response = await GetCandidateListUC.execute(query);

      setCandidates(response.candidates ?? []);

      setPagination((prev) => ({
        ...prev,
        total: response.total ?? 0,
        totalPages: response.total ? Math.ceil(response.total / prev.limit) : 1,
      }));
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to load candidates";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, debouncedSearch, filterStatus]);

  useEffect(() => {
    loadCandidates();
  }, [loadCandidates]);

  const changePage = (page: number) => {
    if (page < 1 || page > pagination.totalPages) return;
    setPagination((prev) => ({ ...prev, page }));
  };

  const changeLimit = (limit: number) => {
    setPagination((prev) => ({ ...prev, limit, page: 1 }));
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
