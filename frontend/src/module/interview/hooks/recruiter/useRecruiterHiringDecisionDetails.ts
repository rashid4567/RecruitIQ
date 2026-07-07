import { useCallback, useEffect, useState } from "react";
import { getRecruiterHiringDecisionDetails } from "../../api/recruiter-interview.api";
import type { GetRecruiterHiringDecisionDetailsResponse } from "../../types/recruiterInterview.types";

interface UseRecruiterHiringDecisionDetailsReturn {
  loading: boolean;
  error: string | null;
  decision: GetRecruiterHiringDecisionDetailsResponse | null;
  fetchHiringDecision: (
    interviewId: string,
  ) => Promise<GetRecruiterHiringDecisionDetailsResponse>;
  clearDecision: () => void;
  refetch: () => Promise<void>;
}

export function useRecruiterHiringDecisionDetails(
  interviewId?: string,
): UseRecruiterHiringDecisionDetailsReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [decision, setDecision] =
    useState<GetRecruiterHiringDecisionDetailsResponse | null>(null);
  const fetchHiringDecision = useCallback(
    async (id: string): Promise<GetRecruiterHiringDecisionDetailsResponse> => {
      try {
        setLoading(true);
        setError(null);
        const result = await getRecruiterHiringDecisionDetails(id);
        setDecision(result);
        return result;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to fetch hiring decision details";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (!interviewId) {
      return;
    }
    void fetchHiringDecision(interviewId);
  }, [interviewId, fetchHiringDecision]);
  const clearDecision = useCallback(() => {
    setDecision(null);
    setError(null);
  }, []);
  const refetch = useCallback(async () => {
    if (!interviewId) {
      return;
    }
    await fetchHiringDecision(interviewId);
  }, [interviewId, fetchHiringDecision]);

  return {
    loading,
    error,
    decision,
    fetchHiringDecision,
    clearDecision,
    refetch,
  };
}
