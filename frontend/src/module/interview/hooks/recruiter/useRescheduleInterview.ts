import { useState } from 'react';
import {
  type RescheduleInterviewRequest,
  type RescheduleInterviewResponse,
} from '../../types/recruiterInterview.types';
import { rescheduleInterview } from '../../api/interview.api';

export function useRescheduleInterview() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (
    interviewId: string,
    data: RescheduleInterviewRequest,
  ): Promise<RescheduleInterviewResponse | null> => {
    try {
      setLoading(true);
      setError(null);
      const response = await rescheduleInterview(interviewId, data);
      return response;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to reschedule interview';
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