import { useEffect, useState, useCallback } from "react";

import {
  getCandidateProfile,
  updateCandidateProfile,
} from "../api/candidate.api"

import type {
  CandidateProfile,
  UpdateCandidateProfilePayload,
} from "../types/candidate.types";

export function useCandidateProfile() {
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getCandidateProfile();
      setProfile(data);
      return true;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to load profile";

      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(
    async (payload: UpdateCandidateProfilePayload) => {
      setIsUpdating(true);
      setError(null);

      try {
        const updatedProfile = await updateCandidateProfile(payload);

        setProfile(updatedProfile);

        return true;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to update profile";

        setError(message);

        return false;
      } finally {
        setIsUpdating(false);
      }
    },
    [],
  );

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