import { useCallback, useEffect, useState } from "react";
import { normalizeCandidateDetails, normalizeRecruiterDetails, type LobbyInterviewDetails, type LobbyRole } from "../../types/Lobby.types";
import { getCandidateInterviewDetails } from "../../api/candidate-interview.api";
import { getRecruiterInterviewDetails } from "../../api/recruiter-interview.api";

interface UseInterviewDetailsParams {
  interviewId: string;
  role: LobbyRole;
}

interface UseInterviewDetailsReturn {
  details: LobbyInterviewDetails | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}


export function useInterviewDetails({
  interviewId,
  role,
}: UseInterviewDetailsParams): UseInterviewDetailsReturn {
  const [details, setDetails] = useState<LobbyInterviewDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (role === "candidate") {
        const response = await getCandidateInterviewDetails(interviewId);
        setDetails(normalizeCandidateDetails(response));
      } else {
        const response = await getRecruiterInterviewDetails(interviewId);
        setDetails(normalizeRecruiterDetails(response));
      }
    } catch (err) {
      console.error("[useInterviewDetails] Failed to fetch details.", err);
      setError("Unable to load interview details.");
    } finally {
      setLoading(false);
    }
  }, [interviewId, role]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  return { details, loading, error, refetch: fetchDetails };
}