import { useState } from "react";
import { getCandidateInterviews } from "../../api/interview.api";
import type { GetCandidateInterviewsResponse } from "../../types/candidateInterview.types";

export function useCandidateInterviews() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getInterviews = async (): Promise<
    GetCandidateInterviewsResponse[] | null
  > => {
    try {
      setLoading(true);
      setError(null);

      const response = await getCandidateInterviews();

      return response;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch interviews";

      setError(message);

      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    getInterviews,
    loading,
    error,
  };
}
