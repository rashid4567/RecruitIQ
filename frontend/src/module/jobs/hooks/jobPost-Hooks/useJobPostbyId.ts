import { useState, useEffect, useCallback } from "react";
import { getJobById } from "@/module/jobs/api/job.api";
import type { Job } from "@/module/jobs/types/job.types";

export function useJobPostById(id: string | null) {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJob = useCallback(async () => {
    if (!id) {
      setJob(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await getJobById("admin", id);
      setJob(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load job details",
      );
      setJob(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchJob();
  }, [fetchJob]);

  return {
    job,
    loading,
    error,
    refetch: fetchJob,
  };
}
