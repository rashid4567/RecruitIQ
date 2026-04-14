
import { useState } from "react";
import { completeProfileUC } from "../di/candidate";
import type { CompleteCandidateProfileForm } from "../types/candidate-profile.types";
import { getError } from "@/utils/getError";

export function useCompleteCandidateProfile() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const completeProfile = async (formData: CompleteCandidateProfileForm) => {
    setIsSubmitting(true);
    setError(null);

    try {

      const preferredJobLocations = formData.preferredJobLocations
        ? formData.preferredJobLocations
            .split(",")
            .map((l) => l.trim())
            .filter(Boolean)
        : [];

      await completeProfileUC.execute({
        currentJob: formData.currentJob.trim(),
        experienceYears: formData.experienceYears
          ? Number(formData.experienceYears)
          : undefined,
        educationLevel: formData.educationLevel,
        skills: formData.skills,
        preferredJobLocations,
        bio: formData.bio.trim(),
        linkedinUrl: formData.linkedinUrl?.trim() || undefined,
        currentJobLocation: undefined,
        gender: undefined
      });
    } catch (err: unknown) {
      setError(getError(err));
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { completeProfile, isSubmitting, error };
}