import { useState } from "react";
import { requestInterviewReschedule } from "../../api/candidate-interview.api";
import type {
  RequestInterviewRescheduleRequest,
  RequestInterviewRescheduleResponse,
} from "../../types/candidateInterview.types";

export function useRequestInterviewReschedule() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (
    interviewId: string,
    data: RequestInterviewRescheduleRequest,
  ): Promise<RequestInterviewRescheduleResponse | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await requestInterviewReschedule(
        interviewId,
        data,
      );

      return response;
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to request interview reschedule";

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