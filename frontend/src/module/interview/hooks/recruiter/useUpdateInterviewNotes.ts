import { useState } from "react";

import { updateInterviewNotes } from "../../api/recruiter-interview.api";

import type {
  UpdateInterviewNotesRequest,
  UpdateInterviewNotesResponse,
} from "../../types/recruiterInterview.types";

export function useUpdateInterviewNotes() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (
    interviewId: string,
    data: UpdateInterviewNotesRequest,
  ): Promise<UpdateInterviewNotesResponse | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await updateInterviewNotes(interviewId, data);

      return response;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to update interview notes";

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
