import { useState } from "react";
import { rejectInterview } from "../../api/candidate-interview.api";
import type {
  RejectInterviewRequest,
  RejectInterviewResponse,
} from "../../types/candidateInterview.types";

export function useRejectInterview() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (
    interviewId: string,
    data: RejectInterviewRequest,
  ): Promise<RejectInterviewResponse | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await rejectInterview(interviewId, data);

      return response;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to reject interview";

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