import { useCallback, useState } from "react";
import type { GetRecruiterInterviewDetailsResponse } from "../../types/recruiterInterview.types";
import { getRecruiterInterviewDetails } from "../../api/recruiter-interview.api";

export function useRecruiterInterviewDetails() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getDetails = useCallback(
    async (
      interviewId: string,
    ): Promise<GetRecruiterInterviewDetailsResponse | null> => {
      try {
        setLoading(true);
        setError(null);

        const response = await getRecruiterInterviewDetails(interviewId);

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
    },
    [],
  );

  return {
    getDetails,
    loading,
    error,
  };
}
