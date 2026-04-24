
import { useState, useEffect, useCallback } from "react";
import type { JobPost } from "@/module/candidate/domain/entities/jobPost";
import { GetJobPostById } from "../../di/jobPost";

interface UseJobPostDetailReturn {
  job: JobPost | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useJobPostDetail(jobId: string | null): UseJobPostDetailReturn {
  const [job, setJob] = useState<JobPost | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJobDetail = useCallback(async () => {
    if (!jobId) {
      setJob(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const result = await GetJobPostById.execute(jobId);
      setJob(result);
    } catch (err: any) {
      setError(err.message ?? "Failed to fetch job details");
      console.error("Error fetching job details:", err);
      setJob(null);
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchJobDetail();
  }, [fetchJobDetail]);

  return {
    job,
    loading,
    error,
    refetch: fetchJobDetail,
  };
}