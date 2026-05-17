import type { JobPostFilters } from "@/module/candidate/domain/dto/JobPostDTO";
import type { JobPost } from "@/module/candidate/domain/entities/jobPost";
import { useState, useEffect, useCallback, useRef } from "react";
import { GetAllJobPostUC } from "../../di/jobPost";

const DEFAULT_FILTERS: JobPostFilters = {
  page: 1,
  limit: 9,
};

const SEARCH_DEBOUNCE_MS = 400;

interface UseJobPostsReturn {
  jobs: JobPost[];
  loading: boolean;
  error: string | null;
  filters: JobPostFilters;
  searchInput: string;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  updateFilters: (partial: Partial<JobPostFilters>) => void;
  updateSearch: (value: string) => void;
  changePage: (page: number) => void;
  resetFilters: () => void;
  refetch: () => Promise<void>;
}

export function useJobPosts(): UseJobPostsReturn {
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<JobPostFilters>(DEFAULT_FILTERS);

  const [searchInput, setSearchInput] = useState<string>("");

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 9,
    totalPages: 0,
  });

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchJobs = useCallback(async (currentFilters: JobPostFilters) => {
    setLoading(true);
    setError(null);
    try {
      const result = await GetAllJobPostUC.execute(currentFilters);
      setJobs(result.data);
      setPagination({
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      });
    } catch (err : unknown) {
      const message = err instanceof Error ? err.message : "Failed to fetch jobs";
      setError(message);
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs(filters);
  }, [filters, fetchJobs]);

  const updateSearch = useCallback((value: string) => {
    setSearchInput(value);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        search: value.trim() || undefined,
        page: 1,
      }));
    }, SEARCH_DEBOUNCE_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  const updateFilters = useCallback((partial: Partial<JobPostFilters>) => {
    setFilters((prev) => ({ ...prev, ...partial, page: 1 }));
  }, []);

  const changePage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const resetFilters = useCallback(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    setSearchInput("");
    setFilters(DEFAULT_FILTERS);
  }, []);

  const refetch = useCallback(async () => {
    await fetchJobs(filters);
  }, [fetchJobs, filters]);

  return {
    jobs,
    loading,
    error,
    filters,
    searchInput,
    pagination,
    updateFilters,
    updateSearch,
    changePage,
    resetFilters,
    refetch,
  };
}
