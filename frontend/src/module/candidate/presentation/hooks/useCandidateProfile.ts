import { useEffect, useState } from "react";
import { CandidateProfile } from "../../domain/entities/candidateProfile";
import { GetCandidateUc, updateCandidateUc } from "../di/candidate";

export function useCandidateProfile() {
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);



  const loadProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await GetCandidateUc.execute();
      setProfile(data);
      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load profile";

      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

const updateProfile = async (updated: CandidateProfile) => {
  setLoading(true);
  setError(null);

  try {
 
    const result = await updateCandidateUc.execute(updated);


    if (result) {
      setProfile(result);
    } else {
    
      setProfile(updated);
    }

    return true;
  } catch (err) {
    console.error("Update error:", err);

    const message =
      err instanceof Error ? err.message : "Failed to update profile";

    setError(message);
    return false;
  } finally {
    setLoading(false);
  }
};





  useEffect(() => {
    loadProfile();
  }, []);

  return {
    profile,
    loading,
    error,
    loadProfile,
    updateProfile,
  };
}
