import { useState, useCallback } from "react";
import type { CandidateProfile } from "../types/candidate.types";
import {
  validateProfileForm,
  validateProfileField,
  type ProfileFormData,
} from "../validators/profileValidation";

type FieldErrors = Partial<Record<keyof ProfileFormData, string>>;
type TouchedFields = Partial<Record<keyof ProfileFormData, boolean>>;

export function useProfileEdit(profile: CandidateProfile | null) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<ProfileFormData>>({});
  const [validationErrors, setValidationErrors] = useState<FieldErrors>({});
  const [touchedFields, setTouchedFields] = useState<TouchedFields>({});

  const mapProfileToForm = useCallback(
    (p: CandidateProfile): Partial<ProfileFormData> => ({
      fullName: p.fullName,
      email: p.email ?? "",
      currentJob: p.currentJob ?? "",
      experienceYears: p.experienceYears ?? undefined,
      educationLevel: p.educationLevel ?? "",
      currentJobLocation: p.currentJobLocation ?? "",
      gender:
        p.gender === "male" || p.gender === "female" || p.gender === "other"
          ? p.gender
          : undefined,
      linkedinUrl: p.linkedinUrl ?? "",
      portfolioUrl: p.portfolioUrl ?? "",
      bio: p.bio ?? "",
      skills: p.skills ?? [],
      preferredJobLocations: p.preferredJobLocations ?? [],
      profileImage: p.profileImage ?? undefined,
    }),
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
      setEditData((prev) => ({ ...prev, [key]: value }));
      setTouchedFields((prev) => {
        const alreadyTouched = !!prev[key];
        if (alreadyTouched) {
          const message = validateProfileField(key, value);
          setValidationErrors((errs) => ({
            ...errs,
            [key]: message || undefined,
          }));
        }
        return prev;
      });
    },
    [],
  );

  const touchField = useCallback(<K extends keyof ProfileFormData>(key: K) => {
    setEditData((current) => {
      const value = current[key] as ProfileFormData[K];
      const message = validateProfileField(key, value);
      setValidationErrors((prev) => ({
        ...prev,
        [key]: message || undefined,
      }));
      return current;
    });
    setTouchedFields((prev) => ({ ...prev, [key]: true }));
  }, []);

  const validateAll = useCallback((): boolean => {
    if (!profile) return false;

    const merged: Partial<ProfileFormData> = {
      fullName: editData.fullName ?? profile.fullName,
      email: editData.email ?? profile.email ?? "",
      currentJob: editData.currentJob ?? profile.currentJob ?? "",
      experienceYears:
        editData.experienceYears ?? profile.experienceYears ?? undefined,
      educationLevel: editData.educationLevel ?? profile.educationLevel ?? "",
      currentJobLocation:
        editData.currentJobLocation ?? profile.currentJobLocation ?? "",
      gender:
        editData.gender ??
        (profile.gender === "male" ||
        profile.gender === "female" ||
        profile.gender === "other"
          ? profile.gender
          : undefined),
      linkedinUrl: editData.linkedinUrl ?? profile.linkedinUrl ?? "",
      portfolioUrl: editData.portfolioUrl ?? profile.portfolioUrl ?? "",
      bio: editData.bio ?? profile.bio ?? "",
      skills: editData.skills ?? profile.skills ?? [],
      preferredJobLocations:
        editData.preferredJobLocations ?? profile.preferredJobLocations ?? [],
      profileImage: editData.profileImage ?? profile.profileImage ?? undefined,
    };

    setTouchedFields(
      Object.fromEntries(
        Object.keys(merged).map((k) => [k, true]),
      ) as TouchedFields,
    );

    const result = validateProfileForm(merged);

    if (!result.success) {
      const errors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof ProfileFormData;
        if (!errors[field]) errors[field] = issue.message;
      }
      setValidationErrors(errors);
      return false;
    }

    setValidationErrors({});
    return true;
  }, [editData, profile]);
  const getFieldError = useCallback(
    (field: keyof ProfileFormData): string | undefined => {
      if (!touchedFields[field]) return undefined;
      return validationErrors[field] || undefined;
    },
    [touchedFields, validationErrors],
  );

  const shouldShowError = useCallback(
    (field: keyof ProfileFormData): boolean => !!getFieldError(field),
    [getFieldError],
  );

  const isFieldValid = useCallback(
    (field: keyof ProfileFormData): boolean => {
      if (!touchedFields[field]) return false;
      if (validationErrors[field]) return false;
      const value = editData[field];
      if (value === undefined || value === null || value === "") return false;
      if (Array.isArray(value)) return value.length > 0;
      return true;
    },
    [touchedFields, validationErrors, editData],
  );

  const hasErrors = Object.values(validationErrors).some(Boolean);

  const setFieldError = useCallback(
    (field: keyof ProfileFormData, error: string) =>
      setValidationErrors((prev) => ({ ...prev, [field]: error })),
    [],
  );

  const clearFieldError = useCallback(
    (field: keyof ProfileFormData) =>
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      }),
    [],
  );

  return {
    isEditing,
    editData,
    validationErrors,
    touchedFields,
    hasErrors,
    startEdit,
    cancelEdit,
    resetEditData,
    updateField,
    touchField,
    validateAll,
    shouldShowError,
    getFieldError,
    isFieldValid,
    setFieldError,
    clearFieldError,
    setIsEditing,
    setEditData,
    setValidationErrors,
  };
}
