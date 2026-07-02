import { useState } from "react";
import { rejectRescheduleRequest } from "../../api/interview.api";
import type { RejectRescheduleResponse } from "../../types/recruiterInterview.types";

export function useRejectRescheduleRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (
    interviewId: string,
  ): Promise<RejectRescheduleResponse | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await rejectRescheduleRequest(interviewId);

      return response;
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to reject reschedule request";

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
