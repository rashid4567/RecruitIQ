import { useState } from "react";
import { markRecruiterJoined } from "../../api/interview.api";
import type { MarkRecruiterJoinedResponse } from "../../types/recruiterInterview.types";

export function useMarkRecruiterJoined() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (
    interviewId: string,
  ): Promise<MarkRecruiterJoinedResponse | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await markRecruiterJoined(interviewId);

      return response;
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
  };
}