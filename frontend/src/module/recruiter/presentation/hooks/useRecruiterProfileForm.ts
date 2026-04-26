import { useEffect, useMemo } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { Path, PathValue } from "react-hook-form";

import { RecruiterProfile } from "@/module/recruiter/Domain/entities/recruiterEntities";
import { updateRecruiterUc } from "../di/recruiter.di";
import {
  profileSchema,
  type ProfileFormData,
} from "../validators/recruiter-form.validator";
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
    resolver: zodResolver(profileSchema) as Resolver<ProfileFormData>,
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

  const submit = handleSubmit(async (data) => {
    try {
      const payload = RecruiterProfileFormMapper.toApi(data);

      console.log("Sending payload:", payload);

      const savedProfile = await updateRecruiterUc.execute(payload);

      reset(RecruiterProfileFormMapper.toForm(savedProfile));

      onProfileUpdated?.(savedProfile);

      toast.success("Profile updated successfully!", {
        description: "Your changes have been saved.",
      });
    } catch (error: any) {
      console.error("Profile update error:", error);

      toast.error("Failed to update profile", {
        description:
          error?.response?.data?.message ||
          error?.message ||
          "Please try again later.",
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
    value: PathValue<ProfileFormData, TField>,
  ) => {
    setValue(key, value, {
      shouldValidate: true,
      shouldDirty: true,
    });
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
