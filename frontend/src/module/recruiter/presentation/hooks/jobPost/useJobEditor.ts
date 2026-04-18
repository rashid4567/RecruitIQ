'use client';

import { useState } from "react";
import type { JobFormData } from "../../types/jobForm.types"; 
import { CreateJobPostUseCase } from "@/module/recruiter/Application/use-Cases/jobPost/createJobPost.useCase";
import { ApiJobPostRepository } from "@/module/recruiter/infrastructure/repositories/ApiJobPostRepository";
import type { CreateJobPostDTO } from "@/module/recruiter/Domain/dto/jobPost.dto";

export const useJobEditor = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<JobFormData>({
    title: "",
    description: "",
    responsibilities: [],
    requirements: [],
    requiredSkills: [],
    preferredSkills: [],
    experienceMin: 0,
    experienceMax: 0,
    location: { city: "", state: "", country: "" },
    isRemote: false,
    jobType: "full-time",
    salary: { min: 0, max: 0, currency: "INR" },
    department: "",
    positions: 1,
    expiresAt: "",
    externalLink: "",
  });

  const handleNext = () => {
    if (currentStep < 5) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(Math.max(1, currentStep - 1));
  };

  const handlePublish = () => setShowConfirmation(true);

  const confirmPublish = async () => {
    setShowConfirmation(false);
    setIsSubmitting(true);

    try {
      const repository = new ApiJobPostRepository();
      const useCase = new CreateJobPostUseCase(repository);

      const dto: CreateJobPostDTO = {
        title: formData.title,
        description: formData.description,
        responsibilities: formData.responsibilities.filter(Boolean),
        requirements: formData.requirements.filter(Boolean),
        requiredSkills: formData.requiredSkills,
        preferredSkills: formData.preferredSkills,
        experienceMin: formData.experienceMin,
        experienceMax: formData.experienceMax,
        location: formData.isRemote ? undefined : formData.location,
        isRemote: formData.isRemote,
        jobType: formData.jobType,
        salary: formData.salary,
        department: formData.department,
        positions: formData.positions,
        expiresAt: formData.expiresAt ? new Date(formData.expiresAt) : undefined,
        externalLink: formData.externalLink || undefined,
      };

      await useCase.execute(dto);
      alert("🎉 Job Published Successfully!");
      window.location.href = "/jobs";
    } catch (err: any) {
      alert("❌ " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    currentStep,
    setCurrentStep,
    completedSteps,
    formData,
    setFormData,
    showConfirmation,
    setShowConfirmation,
    isSubmitting,
    handleNext,
    handlePrevious,
    handlePublish,
    confirmPublish,
  };
};