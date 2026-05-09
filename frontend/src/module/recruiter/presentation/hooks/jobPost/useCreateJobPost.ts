import { useState, useCallback, useRef } from "react";
import type { JobType } from "@/module/recruiter/Domain/dto/jobPost.dto";
import { CreateJobPostUc, publishJobPostUC } from "../../di/jobPost.di";

export interface LocationVO {
  city: string;
  state: string;
  country: string;
}

export interface SalaryVO {
  min: number;
  max: number;
  currency: string;
}

export interface JobFormData {
  title: string;
  description: string;
  department: string;
  positions: number;
  jobType: JobType;
  isRemote: boolean;
  location: LocationVO;
  responsibilities: string[];
  requirements: string[];
  requiredSkills: string[];
  preferredSkills: string[];
  experienceMin: number;
  experienceMax: number;
  salary: SalaryVO;
  externalLink: string;
  expiresAt: string;
}

export const defaultJobFormData: JobFormData = {
  title: "",
  description: "",
  department: "",
  positions: 1,
  jobType: "full-time",
  isRemote: false,
  location: { city: "", state: "", country: "" },
  responsibilities: [],
  requirements: [],
  requiredSkills: [],
  preferredSkills: [],
  experienceMin: 0,
  experienceMax: 0,
  salary: { min: 0, max: 0, currency: "INR" },
  externalLink: "",
  expiresAt: "",
};

function hasAnyData(formData: JobFormData): boolean {
  return (
    !!formData.title.trim() ||
    !!formData.description.trim() ||
    !!formData.department.trim() ||
    formData.responsibilities.length > 0 ||
    formData.requirements.length > 0 ||
    formData.requiredSkills.length > 0
  );
}

function buildDtoFromForm(formData: JobFormData) {
  return {
    title: formData.title.trim(),
    description: formData.description.trim(),
    responsibilities: formData.responsibilities.map((r) => r.trim()).filter(Boolean),
    requirements: formData.requirements.map((r) => r.trim()).filter(Boolean),
    requiredSkills: formData.requiredSkills,
    preferredSkills: formData.preferredSkills,
    experienceMin: formData.experienceMin,
    experienceMax: formData.experienceMax,
    location: {
      city: formData.location.city.trim(),
      state: formData.location.state.trim(),
      country: formData.location.country.trim(),
    },
    isRemote: formData.isRemote,
    jobType: formData.jobType,
    salary: {
      min: formData.salary.min,
      max: formData.salary.max,
      currency: formData.salary.currency,
    },
    department: formData.department.trim(),
    positions: formData.positions,
    expiresAt: formData.expiresAt ? new Date(formData.expiresAt) : undefined,
    externalLink: formData.externalLink.trim() || undefined,
  };
}


function getStepErrors(step: number, formData: JobFormData): Record<string, string> {
  const errs: Record<string, string> = {};

  if (step === 1) {
    if (!formData.title.trim()) errs.title = "Job title is required";
    if (!formData.department.trim()) errs.department = "Department is required";
    if (!formData.positions || formData.positions < 1) errs.positions = "At least 1 opening is required";
    if (!formData.location.city.trim()) errs["location.city"] = "City is required";
    if (!formData.location.state.trim()) errs["location.state"] = "State is required";
    if (!formData.location.country.trim()) errs["location.country"] = "Country is required";
  }

  if (step === 2) {
    if (!formData.description.trim()) errs.description = "Role overview is required";
    if (formData.responsibilities.filter((r) => r.trim()).length === 0)
      errs.responsibilities = "Add at least one responsibility";
    if (formData.requirements.filter((r) => r.trim()).length === 0)
      errs.requirements = "Add at least one requirement";
  }

  if (step === 3) {
    if (formData.requiredSkills.length === 0)
      errs.requiredSkills = "Add at least one required skill";
    if (
      formData.experienceMax > 0 &&
      formData.experienceMin > formData.experienceMax
    ) {
      errs.experienceMax = "Maximum must be greater than minimum";
    }
  }

  if (step === 4) {
    if (!formData.expiresAt) errs.expiresAt = "Application deadline is required";
    if (
      formData.salary.min > 0 &&
      formData.salary.max > 0 &&
      formData.salary.min > formData.salary.max
    ) {
      errs["salary.max"] = "Maximum salary must be greater than minimum";
    }
  }

  return errs;
}

export function useCreateJobPost() {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [formData, setFormData] = useState<JobFormData>(defaultJobFormData);
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});

  const savedDraftId = useRef<string | null>(null);

  const [showSaveDraftModal, setShowSaveDraftModal] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [saveDraftError, setSaveDraftError] = useState<string | null>(null);
  const [draftSavedSuccessfully, setDraftSavedSuccessfully] = useState(false);
  const [showPublishConfirmation, setShowPublishConfirmation] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);



  const handleNext = useCallback((): Record<string, string> => {
    const errs = getStepErrors(currentStep, formData);
    if (Object.keys(errs).length === 0) {
      setCompletedSteps((prev) => new Set([...prev, currentStep]));
      setStepErrors({});
      if (currentStep < 5) {
        setCurrentStep((prev) => prev + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return {};
    }
    setStepErrors(errs);
    return errs;
  }, [currentStep, formData]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 1) {
      setStepErrors({});
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStep]);

  const handleNavigateAway = useCallback((): boolean => {
    if (hasAnyData(formData) && !draftSavedSuccessfully) {
      setShowSaveDraftModal(true);
      return true;
    }
    return false;
  }, [formData, draftSavedSuccessfully]);

  const saveDraft = useCallback(async () => {
    if (isSavingDraft) return;
    setIsSavingDraft(true);
    setSaveDraftError(null);

    try {
      const dto = buildDtoFromForm(formData);
      if (!savedDraftId.current) {
        const created = await CreateJobPostUc.execute(dto);
        savedDraftId.current = created.id;
      }
      setDraftSavedSuccessfully(true);
      setShowSaveDraftModal(false);
    } catch (error) {
      setSaveDraftError(
        error instanceof Error ? error.message : "Failed to save draft. Please try again."
      );
    } finally {
      setIsSavingDraft(false);
    }
  }, [formData, isSavingDraft]);

  const dismissSaveDraftModal = useCallback(() => {
    setShowSaveDraftModal(false);
    setSaveDraftError(null);
  }, []);

  const handlePublish = useCallback(() => {
    const step1Errs = getStepErrors(1, formData);
    const step2Errs = getStepErrors(2, formData);
    const step3Errs = getStepErrors(3, formData);
    const step4Errs = getStepErrors(4, formData);

    if (Object.keys(step1Errs).length > 0) {
      setStepErrors(step1Errs);
      setCurrentStep(1);
      return;
    }
    if (Object.keys(step2Errs).length > 0) {
      setStepErrors(step2Errs);
      setCurrentStep(2);
      return;
    }
    if (Object.keys(step3Errs).length > 0) {
      setStepErrors(step3Errs);
      setCurrentStep(3);
      return;
    }
    if (Object.keys(step4Errs).length > 0) {
      setStepErrors(step4Errs);
      setCurrentStep(4);
      return;
    }

    setPublishError(null);
    setShowPublishConfirmation(true);
  }, [formData]);

  const confirmPublish = useCallback(async () => {
    if (isPublishing) return;
    setIsPublishing(true);
    setPublishError(null);

    try {
      const dto = buildDtoFromForm(formData);
      if (savedDraftId.current) {
        await publishJobPostUC.execute(savedDraftId.current);
      } else {
        const created = await CreateJobPostUc.execute(dto);
        savedDraftId.current = created.id;
        await publishJobPostUC.execute(created.id);
      }

      setShowPublishConfirmation(false);
      setFormData(defaultJobFormData);
      setCurrentStep(1);
      setCompletedSteps(new Set());
      savedDraftId.current = null;
      setDraftSavedSuccessfully(false);
      setStepErrors({});
    } catch (error) {
      setPublishError(
        error instanceof Error ? error.message : "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsPublishing(false);
    }
  }, [formData, isPublishing]);

  const dismissPublishConfirmation = useCallback(() => {
    setShowPublishConfirmation(false);
    setPublishError(null);
  }, []);

  return {
    currentStep,
    setCurrentStep,
    completedSteps,
    formData,
    setFormData,
    stepErrors,        
    showSaveDraftModal,
    isSavingDraft,
    saveDraftError,
    draftSavedSuccessfully,
    savedDraftId: savedDraftId.current,
    handleNavigateAway,
    handleNext,        
    handlePrevious,
    saveDraft,
    dismissSaveDraftModal,
    showPublishConfirmation,
    isPublishing,
    publishError,
    handlePublish,
    confirmPublish,
    dismissPublishConfirmation,
  };
}