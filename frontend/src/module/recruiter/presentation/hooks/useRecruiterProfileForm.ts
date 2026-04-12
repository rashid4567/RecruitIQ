// useRecruiterProfileForm.ts
import { useEffect, useMemo } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { Path, PathValue } from "react-hook-form";

import { RecruiterProfile } from "@/module/recruiter/Domain/entities/recruiterEntities";
import { updateRecruiterUc } from "../di/recruiter.di";
import { profileSchema, type ProfileFormData } from "../validators/recruiter-form.validator";
import { RecruiterProfileFormMapper } from "../mappers/recruiterForm.mapper";

interface UseRecruiterProfileFormProps {
  profile: RecruiterProfile | null;
  onProfileUpdated?: (profile: RecruiterProfile) => void;
}

export function useRecruiterProfileForm({
  profile,
  onProfileUpdated,
}: UseRecruiterProfileFormProps) {
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema) as Resolver<ProfileFormData>, // ← fixes resolver error
    mode: "onChange",
    defaultValues: {
      fullName: "",
      companyName: "",
      companyWebsite: "",
      companySize: 0,
      industry: "",
      location: "",
      bio: "",
      designation: "",
      linkedinUrl: "",
    },
  });

  const { handleSubmit, reset, watch, setValue, trigger, formState } = form;
  const { errors, isDirty, touchedFields, isSubmitting } = formState;

  useEffect(() => {
    if (profile) {
      reset(RecruiterProfileFormMapper.toForm(profile), {
        keepDirty: false,
        keepErrors: false,
      });
    }
  }, [profile, reset]);

  const currentBio = watch("bio");
  const currentName = watch("fullName");

  const bioLength = currentBio?.length ?? 0;
  const wordCount = useMemo(() => {
    return currentBio?.trim()
      ? currentBio.trim().split(/\s+/).filter(Boolean).length
      : 0;
  }, [currentBio]);

  // ← Remove explicit (data: ProfileFormData) annotation — let handleSubmit infer it
  const submit = handleSubmit(async (data) => {
    if (!profile) return;

    try {
      const updatedEntity = profile.updateProfile({
        fullName: data.fullName.trim(),
        companyName: data.companyName.trim(),
        companyWebsite: data.companyWebsite?.trim() || undefined,
        companySize: Number(data.companySize),
        industry: data.industry,
        location: data.location?.trim() || undefined,
        bio: data.bio.trim(),
        designation: data.designation.trim(),
        linkedinUrl: data.linkedinUrl?.trim() || undefined,
      });

      const savedProfile = await updateRecruiterUc.execute(updatedEntity);

      reset(RecruiterProfileFormMapper.toForm(savedProfile));
      onProfileUpdated?.(savedProfile);

      toast.success("Profile updated successfully!", {
        description: "Your changes have been saved.",
      });
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile", {
        description: error?.message || "Please try again later.",
      });
    }
  });

  const cancel = () => {
    if (profile) {
      reset(RecruiterProfileFormMapper.toForm(profile));
    }
  };

  const updateField = <TField extends Path<ProfileFormData>>(
    key: TField,
    value: PathValue<ProfileFormData, TField>
  ) => {
    setValue(key, value, { shouldValidate: true, shouldDirty: true });
  };

  return {
    form,
    submit,
    cancel,
    updateField,
    bioLength,
    wordCount,
    currentName,
    errors,
    isDirty,
    touchedFields,
    isSubmitting,
    watch,
    setValue,
    trigger,
    reset,
  };
}