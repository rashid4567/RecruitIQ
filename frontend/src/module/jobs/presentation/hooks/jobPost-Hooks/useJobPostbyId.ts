import { useState, useEffect, useCallback } from "react";
import type { Job } from "@/module/jobs/domain/entity/jobPost.entity"; 
import { GetAdminJobPostByIdUC } from "../../di/jobPost.di";


export function useJobPostById(id: string | null) {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const result = await GetAdminJobPostByIdUC.execute(id);
      setJob(result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load activity logs");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { job, loading, error, refetch: fetch };
}