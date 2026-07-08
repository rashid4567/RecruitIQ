import { useState, useCallback } from "react";
import { toast } from "sonner";
import { closeJob } from "../../api/job.api"; 

export const useCloseJob = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleCloseJob = useCallback(async (jobId: string) => {
    try {
      setLoading(true);
      setError(null);
      await closeJob("recruiter", jobId);
      toast.success("Job closed successfully");

      return true;
    } catch (err) {
      console.error(err);
      const message =
        err instanceof Error
          ? err.message
          : "Failed to close job";
      setError(message);
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    handleCloseJob,
    loading,
    error,
  };
};