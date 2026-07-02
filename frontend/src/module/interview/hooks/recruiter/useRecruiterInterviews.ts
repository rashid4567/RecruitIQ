import { useCallback, useEffect, useState } from "react";
import { getRecruiterInterviews } from "../../api/recruiter-interview.api";
import type { RecruiterInterviewItem } from "../../types/recruiterInterview.types"; 

export function useRecruiterInterviews(
  page?: number,
  limit?: number,
) {
  const [interviews, setInterviews] = useState<RecruiterInterviewItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInterviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getRecruiterInterviews(page, limit);

      setInterviews(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch recruiter interviews.",
      );
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  return {
    interviews,
    loading,
    error,
    refetch: fetchInterviews,
  };
}