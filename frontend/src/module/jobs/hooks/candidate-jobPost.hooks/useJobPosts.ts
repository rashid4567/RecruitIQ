import { useState, useEffect, useCallback, useRef } from "react";
import { getJobs } from "@/module/jobs/api/job.api";
import type { JobPostFilters } from "@/module/jobs/types/JobPostDTO";
import type { Job } from "@/module/jobs/types/job.types";

const DEFAULT_FILTERS: JobPostFilters = {
  page: 1,
  limit: 9,
};

const SEARCH_DELAY = 400;

interface PaginationState {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface UseJobPostsReturn {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  filters: JobPostFilters;
  searchInput: string;
  pagination: PaginationState;
  updateFilters: (partial: Partial<JobPostFilters>) => void;
  updateSearch: (value: string) => void;
  changePage: (page: number) => void;
  resetFilters: () => void;
  refetch: () => Promise<void>;
}

export function useJobPosts(): UseJobPostsReturn {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] =
    useState<JobPostFilters>(DEFAULT_FILTERS);

  const [searchInput, setSearchInput] = useState("");

  const [pagination, setPagination] =
    useState<PaginationState>({
      total: 0,
      page: 1,
      limit: 9,
      totalPages: 0,
    });

  const timer =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchJobs = useCallback(
    async (currentFilters: JobPostFilters) => {
      try {
        setLoading(true);
        setError(null);

        const result = await getJobs(
          "candidate",
          currentFilters,
        );

        setJobs(result.data);

        setPagination({
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        });
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to fetch jobs";

        setError(message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchJobs(filters);
  }, [filters, fetchJobs]);

  const updateSearch = useCallback((value: string) => {
    setSearchInput(value);

    if (timer.current) {
      clearTimeout(timer.current);
    }

    timer.current = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        search: value.trim() || undefined,
        page: 1,
      }));
    }, SEARCH_DELAY);
  }, []);

  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, []);

  const updateFilters = useCallback(
    (partial: Partial<JobPostFilters>) => {
      setFilters((prev) => ({
        ...prev,
        ...partial,
        page: 1,
      }));
    },
    [],
  );

  const changePage = useCallback((page: number) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const resetFilters = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
    }

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