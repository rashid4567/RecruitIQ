import { useState, useCallback } from "react";
import type { CandidateProfile } from "../../domain/entities/candidateProfile";
import type { ProfileFormData } from "../validators/profileValidation.ts";

export function useProfileEdit(profile: CandidateProfile | null) {
  const [isEditing, setIsEditing] = useState(false);

  const [editData, setEditData] = useState<Partial<ProfileFormData>>({});

  const [validationErrors, setValidationErrors] = useState<
    Partial<Record<keyof ProfileFormData, string>>
  >({});

  const [touchedFields, setTouchedFields] = useState<
    Partial<Record<keyof ProfileFormData, boolean>>
  >({});

  const mapProfileToForm = useCallback(
    (profile: CandidateProfile): ProfileFormData => {
      const safeGender =
        profile.gender === "male" ||
        profile.gender === "female" ||
        profile.gender === "other"
          ? profile.gender
          : undefined;

      return {
        fullName: profile.fullName,
        email: profile.email,
        currentJob: profile.currentJob,
        experienceYears: profile.experienceYears,
        educationLevel: profile.educationLevel,
        currentJobLocation: profile.currentJobLocation,
        linkedinUrl: profile.linkedinUrl,
        portfolioUrl: profile.portfolioUrl,
        bio: profile.bio,
        gender: safeGender,
        skills: profile.skills ?? [],
        preferredJobLocations: profile.preferredJobLocations ?? [],
      };
    },
    [],
  );

  const startEdit = useCallback(() => {
    if (!profile) return;

    setEditData(mapProfileToForm(profile));
    setIsEditing(true);
    setValidationErrors({});
    setTouchedFields({});
  }, [profile, mapProfileToForm]);

  const cancelEdit = useCallback(() => {
    setEditData({});
    setValidationErrors({});
    setTouchedFields({});
    setIsEditing(false);
  }, []);

  const resetEditData = useCallback(() => {
    if (!profile) return;

    setEditData(mapProfileToForm(profile));
    setValidationErrors({});
    setTouchedFields({});
  }, [profile, mapProfileToForm]);

  const updateField = useCallback(
    <K extends keyof ProfileFormData>(key: K, value: ProfileFormData[K]) => {
      if (key === "gender") {
        if (value !== "male" && value !== "female" && value !== "other") {
          value = undefined as ProfileFormData[K];
        }
      }

      setEditData((prev) => ({ ...prev, [key]: value }));

      setTouchedFields((prev) => ({ ...prev, [key]: true }));

      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    },
    [],
  );

  const setFieldError = useCallback(
    (field: keyof ProfileFormData, error: string) => {
      setValidationErrors((prev) => ({ ...prev, [field]: error }));
    },
    [],
  );

  const clearFieldError = useCallback((field: keyof ProfileFormData) => {
    setValidationErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  return {
    isEditing,
    editData,
    validationErrors,
    touchedFields,

    startEdit,
    cancelEdit,
    resetEditData,

    updateField,
    setFieldError,
    clearFieldError,

    setIsEditing,
    setEditData,
    setValidationErrors,
  };
}
