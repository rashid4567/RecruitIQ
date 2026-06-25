import { useState, useEffect, useCallback } from "react";
import { getJobById } from "../../api/job.api";
import type { Job } from "../../types/job.types";

interface UseJobPostDetailReturn {
  job: Job | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useJobPostDetail(
  jobId: string | null,
): UseJobPostDetailReturn {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(false);
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
      const result = await getJobById(
        "candidate",
        jobId,
      );

      setJob(result);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to fetch job details";

      setError(message);
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