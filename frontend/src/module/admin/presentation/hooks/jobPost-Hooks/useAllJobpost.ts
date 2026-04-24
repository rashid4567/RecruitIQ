import { useState, useEffect, useCallback } from "react";
import type {
  JobPostEntity,
  JobStatus,
} from "../../../domain/entities/jobpost.entity";
import { getAllJobpostUC } from "../../di/jobPost.di";

export type TabId = "all" | "active" | "blocked" | "draft" | "expired";

const TAB_FILTERS: Record<TabId, { status?: JobStatus; isBlocked?: boolean }> =
  {
    all: {},
    active: { status: "active", isBlocked: false },
    blocked: { isBlocked: true },
    draft: { status: "draft" },
    expired: { status: "expired" },
  };

const DEBOUNCE_MS = 400;

interface UseAllJobPostsOptions {
  limit?: number;
}

export function useAllJobPosts({ limit = 10 }: UseAllJobPostsOptions = {}) {
  const [jobPosts, setJobPosts] = useState<JobPostEntity[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [activeTab, setActiveTab] = useState<TabId>("all");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, activeTab]);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const filters = TAB_FILTERS[activeTab];
      const result = await getAllJobpostUC.execute({
        page,
        limit,
        search: debouncedSearch || undefined,
        ...filters,
      });
      setJobPosts(result.jobPosts);
      setTotal(result.total);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Failed to fetch job posts");
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, activeTab]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const refresh = useCallback(() => fetchJobs(), [fetchJobs]);

  return {
    jobPosts,
    total,
    loading,
    error,
    page,
    setPage,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    refresh,
    totalPages: Math.ceil(total / limit),
  };
}
