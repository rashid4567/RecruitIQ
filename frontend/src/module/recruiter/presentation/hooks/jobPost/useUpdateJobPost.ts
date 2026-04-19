import { useState, useCallback, useEffect } from "react";
import { ApiJobPostRepository } from "@/module/recruiter/infrastructure/repositories/ApiJobPostRepository";
import { UpdateJobPostUseCase } from "@/module/recruiter/Application/use-Cases/jobPost/updateJobPost.useCase";
import { GetJobPostByIdUseCase } from "@/module/recruiter/Application/use-Cases/jobPost/getJobPostById.useCase";
import { type JobFormData, defaultJobFormData } from "./useCreateJobPost";
import { toast } from "sonner";

const repo = new ApiJobPostRepository();
const updateJobPostUseCase = new UpdateJobPostUseCase(repo);
const getJobPostByIdUseCase = new GetJobPostByIdUseCase(repo);

export function useUpdateJobPost(jobId: string, recruiterId: string) {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [formData, setFormData] = useState<JobFormData>(defaultJobFormData);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [resolvedRecruiterId, setResolvedRecruiterId] = useState<string>("");


  useEffect(() => {
    if (!jobId) return;

    const load = async () => {
      setIsLoading(true);
      setLoadError(null);

      const toastId = toast.loading("Loading job post...");

      try {
        const job = await getJobPostByIdUseCase.execute(jobId);

        setResolvedRecruiterId(job.recruiterId);

        setFormData({
          title: job.title,
          description: job.description,
          department: job.department,
          positions: job.positions,
          jobType: job.jobType,
          isRemote: job.isRemote,
          location: {
            city: job.location.city,
            state: job.location.state,
            country: job.location.country,
          },
          responsibilities: job.responsibilities,
          requirements: job.requirements,
          requiredSkills: job.requiredSkills,
          preferredSkills: job.preferredSkills,
          experienceMin: job.experienceMin,
          experienceMax: job.experienceMax,
          salary: {
            min: job.salary.min,
            max: job.salary.max,
            currency: job.salary.currency,
          },
          externalLink: job.externalLink ?? "",
          expiresAt: job.expiresAt
            ? new Date(job.expiresAt).toISOString().split("T")[0]
            : "",
        });

        setCompletedSteps(new Set([1, 2, 3, 4, 5]));

        toast.success("Job post loaded successfully", {
          id: toastId,
          description: `Editing "${job.title}"`,
        });
      } catch (err) {
        console.log(err)
        const message =
          err instanceof Error ? err.message : "Failed to load job post";
        setLoadError(message);
        toast.error("Failed to load job post", {
          id: toastId,
          description: message,
        });
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [jobId]);


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
      if (errors[currentStep]) {
        toast.warning("Incomplete Step", {
          description: errors[currentStep],
        });
      }
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
      toast.warning("Basic Information Incomplete", {
        description: "Please fill in all required fields in Basic Information",
      });
      setCurrentStep(1);
      return;
    }
    if (!validateStep(2)) {
      toast.warning("Job Description Missing", {
        description: "Please add a job description before saving",
      });
      setCurrentStep(2);
      return;
    }
    if (!validateStep(3)) {
      toast.warning("Requirements Incomplete", {
        description:
          "Please add required skills and a valid experience range before saving",
      });
      setCurrentStep(3);
      return;
    }
    setPublishError(null);
    setShowConfirmation(true);
  }, [validateStep]);

  const confirmPublish = useCallback(async () => {
    if (isSubmitting) return;

    if (!resolvedRecruiterId) {
      const msg =
        "Could not verify ownership of this job post. Please refresh and try again.";
      setPublishError(msg);
      toast.error("Authorization Error", {
        description: msg,
      });
      return;
    }

    setIsSubmitting(true);
    setPublishError(null);

    const toastId = toast.loading("Saving changes...", {
      description: "Please wait while we update your job post",
    });

    try {
      const dto = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        responsibilities: formData.responsibilities
          .map((r) => r.trim())
          .filter(Boolean),
        requirements: formData.requirements
          .map((r) => r.trim())
          .filter(Boolean),
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
        expiresAt: formData.expiresAt
          ? new Date(formData.expiresAt)
          : undefined,
        externalLink: formData.externalLink.trim() || undefined,
      };

      await updateJobPostUseCase.execute(resolvedRecruiterId, jobId, dto);

      setShowConfirmation(false);

      toast.success("Job post updated!", {
        id: toastId,
        description: `"${formData.title}" has been saved successfully`,
      });
    } catch (error) {
      console.log(error)
      const message =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again.";

      setPublishError(message);

      toast.error("Failed to save changes", {
        id: toastId,
        description: message,
      });
      
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, isSubmitting, jobId, resolvedRecruiterId]);

  const retryPublish = useCallback(() => {
    setPublishError(null);
    toast.info("Retrying...", {
      description: "Attempting to save your changes again",
    });
    confirmPublish();
  }, [confirmPublish]);

  return {
    isLoading,
    loadError,
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