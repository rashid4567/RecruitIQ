import { useState } from "react";
import { endInterview } from "../../api/interview.api";
import type { EndInterviewResponse } from "../../types/recruiterInterview.types";

export function useEndInterview() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (
    interviewId: string,
  ): Promise<EndInterviewResponse | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await endInterview(interviewId);

      return response;
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to end interview";

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