import { useEffect, useState, useCallback } from "react";
import { CandidateProfile } from "../../domain/entities/candidateProfile";
import { GetCandidateUc, updateCandidateUc } from "../di/candidate";

export function useCandidateProfile() {
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
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
  }, []);

  const updateProfile = useCallback(async (updated: CandidateProfile) => {
    setIsUpdating(true);
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
      setIsUpdating(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    profile,
    loading,
    isUpdating,
    error,
    loadProfile,
    updateProfile,
  };
}