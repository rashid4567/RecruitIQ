import { useState } from "react";
import { getCandidateInterviewDetails } from "../../api/interview.api";
import type { GetCandidateInterviewDetailsResponse } from "../../types/candidateInterview.types";

export function useCandidateInterviewDetails() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getDetails = async (
    interviewId: string,
  ): Promise<GetCandidateInterviewDetailsResponse | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await getCandidateInterviewDetails(interviewId);

      return response;
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to fetch interview details";

      setError(message);

      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    getDetails,
    loading,
    error,
  };
}