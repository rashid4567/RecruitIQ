import { useState } from "react";
import { acceptInterview } from "../../api/interview.api";
import type { AcceptInterviewResponse } from "../../types/candidateInterview.types";

export function useAcceptInterview() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (
    interviewId: string,
  ): Promise<AcceptInterviewResponse | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await acceptInterview(interviewId);

      return response;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to accept interview";

      setError(message);

      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    submit,
    loading,
    error,
  };
}