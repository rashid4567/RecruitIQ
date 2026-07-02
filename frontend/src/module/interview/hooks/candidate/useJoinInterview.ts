import { useState } from "react";
import { joinInterview } from "../../api/candidate-interview.api";
import type { JoinInterviewResponse } from "../../types/candidateInterview.types";

export function useJoinInterview() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (
    interviewId: string,
  ): Promise<JoinInterviewResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      return await joinInterview(interviewId);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to join interview";

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
    setError,
  };
}