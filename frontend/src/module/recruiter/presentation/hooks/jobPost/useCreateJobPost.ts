import { useState, useCallback } from "react";
import type { JobType } from "@/module/recruiter/Domain/dto/jobPost.dto";
import { ApiJobPostRepository } from "@/module/recruiter/infrastructure/repositories/ApiJobPostRepository";
import { CreateJobPostUseCase } from "@/module/recruiter/Application/use-Cases/jobPost/createJobPost.useCase";

const repo = new ApiJobPostRepository();
const createJobPostUseCase = new CreateJobPostUseCase(repo);

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

export function useCreateJobPost() {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [formData, setFormData] = useState<JobFormData>(defaultJobFormData);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);


  const validateStep = useCallback(
    (step: number): boolean => {
      switch (step) {
        case 1:
          return (
            !!formData.title.trim() &&
            !!formData.department.trim() &&
            formData.positions > 0
          );
        case 2:
          return !!formData.description.trim();
        case 3:
          return (
            formData.requiredSkills.length > 0 &&
            formData.experienceMin >= 0 &&
            formData.experienceMax >= 0 &&
            (formData.experienceMax === 0 ||
              formData.experienceMin <= formData.experienceMax)
          );
        case 4:
          return true;
        default:
          return true;
      }
    },
    [formData]
  );

  const markStepCompleted = useCallback(
    (step: number): boolean => {
      if (validateStep(step)) {
        setCompletedSteps((prev) => new Set([...prev, step]));
        return true;
      }
      return false;
    },
    [validateStep]
  );

  
  const handleNext = useCallback(() => {
    if (markStepCompleted(currentStep) && currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const errors: Record<number, string> = {
        1: "Please fill in all required fields in Basic Information",
        2: "Please add a job description",
        3: "Please add at least one required skill and a valid experience range",
      };
      if (errors[currentStep]) alert(errors[currentStep]);
    }
  }, [currentStep, markStepCompleted]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStep]);

  const handlePublish = useCallback(() => {
    if (!validateStep(1)) {
      alert("Please complete Basic Information before publishing");
      setCurrentStep(1);
      return;
    }
    if (!validateStep(2)) {
      alert("Please complete Job Description before publishing");
      setCurrentStep(2);
      return;
    }
    if (!validateStep(3)) {
      alert("Please add required skills and a valid experience range before publishing");
      setCurrentStep(3);
      return;
    }
    setPublishError(null);
    setShowConfirmation(true);
  }, [validateStep]);

  const confirmPublish = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setPublishError(null);

    try {
      const dto = {
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

      await createJobPostUseCase.execute(dto);


      setShowConfirmation(false);
      setFormData(defaultJobFormData);
      setCurrentStep(1);
      setCompletedSteps(new Set());
    } catch (error) {
      setPublishError(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, isSubmitting]);

  const retryPublish = useCallback(() => {
    setPublishError(null);
    confirmPublish();
  }, [confirmPublish]);

  return {
    currentStep,
    setCurrentStep,
    completedSteps,
    formData,
    setFormData,
    showConfirmation,
    setShowConfirmation,
    isSubmitting,
    publishError,
    handleNext,
    handlePrevious,
    handlePublish,
    confirmPublish,
    retryPublish,
  };
}