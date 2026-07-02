import { useState } from "react";
import { cancelInterview } from "../../api/recruiter-interview.api";
import type {
  CancelInterviewRequest,
  CancelInterviewResponse,
} from "../../types/recruiterInterview.types";

export function useCancelInterview() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (
    interviewId: string,
    data: CancelInterviewRequest,
  ): Promise<CancelInterviewResponse | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await cancelInterview(interviewId, data);

      return response;
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to cancel interview";

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