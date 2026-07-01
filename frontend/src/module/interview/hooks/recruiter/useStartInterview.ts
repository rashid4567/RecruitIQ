import { useState } from "react";
import { startInterview } from "../../api/interview.api";
import type { StartInterviewResponse } from "../../types/recruiterInterview.types";

export function useStartInterview() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (
    interviewId: string,
  ): Promise<StartInterviewResponse | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await startInterview(interviewId);

      return response;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to start interview";

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
