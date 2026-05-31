import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { Job } from "@/module/jobs/domain/entity/jobPost.entity";
import type { JobCardProps, ViewMode } from "../../types/jobCard.types";
import { ApiJobPostRepository } from "@/module/jobs/infrastructure/repository/ApiJobPostRepository";
import { GetJobPostsUseCase } from "@/module/jobs/application/usecase/jobPost/getJobPosts.useCase";

const mapJobPostToCard = (job: Job): JobCardProps => {
  const locationStr = job.isRemote
    ? "Remote"
    : [job.location?.city, job.location?.state, job.location?.country]
        .filter(Boolean)
        .join(", ") || "Not specified";
  const getDisplayStatus = (): JobCardProps["status"] => {
    if (job.isBlocked) {
      return "Blocked";
    }
    if (job.visibility === "hidden") {
      return "Paused";
    }
    if (job.status === "active") {
      return "Active";
    }
    if (job.status === "expired") {
      return "Expired";
    }
    return "Draft";
  };

  return {
    id: job.id,
    title: job.title,
    description: job.description || "",
    responsibilities: job.responsibilities || [],
    requirements: job.requirements || [],
    requiredSkills: job.requiredSkills || [],
    preferredSkills: job.preferredSkills || [],
    experienceMin: job.experienceMin ?? 0,
    experienceMax: job.experienceMax ?? 0,
    salary: job.salary
      ? `${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()} ${job.salary.currency}`
      : "Not specified",
    department: job.department || "General",
    category: job.department || "General",
    positions: job.positions ?? 1,
    status: getDisplayStatus(),
    visibility: job.visibility,
    isBlocked: job.isBlocked,
    location: locationStr,
    isRemote: job.isRemote ?? false,
    jobType: job.jobType ?? "full-time",
    postedDate: job.postedOn
      ? new Date(job.postedOn).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "N/A",
    expiresDate: job.expiresAt
      ? new Date(job.expiresAt).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "No expiry",
    externalLink: job.externalLink || null,
    views: job.views || 0,
    applications: job.applicationsCount || 0,
    publicationCount: job.publicationCount || 0,
    shortlisted: 0,
    avgAiScore: 0,
    positionsFilled: Math.round((job.applicationsCount || 0) * 0.3),
  };
};

export const useJobs = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [jobs, setJobs] = useState<JobCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobCardProps | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "applicants">(
    "overview",
  );
  const navigate = useNavigate();
  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const repository = new ApiJobPostRepository("recruiter");
      const useCase = new GetJobPostsUseCase(repository);
      const result = await useCase.execute();
      setJobs(result.data.map(mapJobPostToCard));
    } catch (err) {
      console.error(err);
      setError("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || job.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [jobs, searchTerm, statusFilter]);

  const stats = {
    totalJobs: jobs.length,
    activeJobs: jobs.filter((j) => j.status === "Active").length,
    totalViews: jobs.reduce((sum, j) => sum + j.views, 0),
    totalApplications: jobs.reduce((sum, j) => sum + j.applications, 0),
  };
  const handleViewClick = (job: JobCardProps) => {
    setSelectedJob(job);
    setActiveTab("overview");
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };
  const handleJobDeleted = useCallback((deletedId: string) => {
    setJobs((prev) => prev.filter((job) => job.id !== deletedId));
  }, []);

  return {
    viewMode,
    setViewMode,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    filteredJobs,
    loading,
    error,
    stats,
    navigate,
    selectedJob,
    isModalOpen,
    activeTab,
    setActiveTab,
    handleViewClick,
    handleCloseModal,
    handleJobDeleted,
    setJobs,
    refetch: fetchJobs,
  };
};
