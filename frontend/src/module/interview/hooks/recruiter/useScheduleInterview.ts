import { useState } from "react";
import type { ScheduleInterviewRequest, ScheduleInterviewResponse } from "../../types/interview.types";
import { scheduleInterview } from "../../api/interview.api";


export function useScheduleInterview() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (
    data: ScheduleInterviewRequest,
  ): Promise<ScheduleInterviewResponse | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await scheduleInterview(data);

      return response;
    }  catch (err: unknown) {
  const message =
    err instanceof Error
      ? err.message
      : "Failed to schedule interview";

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