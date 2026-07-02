import { useState } from "react";
import { approveRescheduleRequest } from "../../api/recruiter-interview.api";
import type { ApproveRescheduleResponse } from "../../types/recruiterInterview.types";

export function useApproveRescheduleRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (
    interviewId: string,
  ): Promise<ApproveRescheduleResponse | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await approveRescheduleRequest(interviewId);

      return response;
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to approve reschedule request";

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
