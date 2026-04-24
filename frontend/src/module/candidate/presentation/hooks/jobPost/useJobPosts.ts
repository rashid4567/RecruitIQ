import type { JobPostFilters } from "@/module/candidate/domain/dto/JobPostDTO";
import type { JobPost } from "@/module/candidate/domain/entities/jobPost";
import { useState, useEffect, useCallback } from "react";
import { GetAllJobPostUC } from "../../di/jobPost";

const DEFAULT_FILTERS: JobPostFilters = {
  page: 1,
  limit: 9,
};

interface UseJobPostsReturn {
  jobs: JobPost[];
  loading: boolean;
  error: string | null;
  filters: JobPostFilters;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  updateFilters: (partial: Partial<JobPostFilters>) => void;
  changePage: (page: number) => void;
  resetFilters: () => void;
  refetch: () => Promise<void>;
}

export function useJobPosts(): UseJobPostsReturn {
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<JobPostFilters>(DEFAULT_FILTERS);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 9,
    totalPages: 0,
  });

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
    } catch (err: any) {
      setError(err.message ?? "Failed to fetch jobs");
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs(filters);
  }, [filters, fetchJobs]);

  const updateFilters = useCallback((partial: Partial<JobPostFilters>) => {
    setFilters((prev) => ({ ...prev, ...partial, page: 1 }));
  }, []);

  const changePage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const resetFilters = useCallback(() => {
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
    pagination,
    updateFilters,
    changePage,
    resetFilters,
    refetch,
  };
}