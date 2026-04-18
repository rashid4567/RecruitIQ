'use client';

import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { JobPost } from '@/module/recruiter/Domain/entities/jobPost.entity';
import type { JobCardProps, ViewMode } from '../../types/jobCard.types';
import { ApiJobPostRepository } from '@/module/recruiter/infrastructure/repositories/ApiJobPostRepository';
import { GetJobPostsUseCase } from '@/module/recruiter/Application/use-Cases/jobPost/getJobPosts.useCase';

const mapJobPostToCard = (job: JobPost): JobCardProps => {
  const locationStr = job.isRemote
    ? "Remote"
    : `${job.location?.city || ''}${job.location?.state ? `, ${job.location.state}` : ''}${job.location?.country ? `, ${job.location.country}` : ''}`.trim() || "Not specified";

  const statusMap: Record<string, JobCardProps['status']> = {
    active: "Active",
    draft: "Draft",
    expired: "Expired",
    blocked: "Paused",
  };

  return {
    id: job.id,
    description: job.description || "",
    salary: `${job.salary?.min ?? 0} - ${job.salary?.max ?? 0} ${job.salary?.currency ?? "INR"}`,
    department: job.department || "General",
    requiredSkills: job.requiredSkills || [],
    category: job.department || "General",
    status: statusMap[job.status || 'draft'] || "Draft",
    title: job.title,
    postedDate: job.postedOn
      ? new Date(job.postedOn).toISOString().split('T')[0]
      : "N/A",
    expiresDate: job.expiresAt
      ? new Date(job.expiresAt).toISOString().split('T')[0]
      : "No expiry",
    location: locationStr,
    jobType: job.jobType || "full-time",
    views: job.views || 0,
    applications: job.applicationsCount || 0,
    shortlisted: 0,
    avgAiScore: 85,
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
  const [activeTab, setActiveTab] = useState<"overview" | "applicants">("overview"); // 👈 NEW

  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const repository = new ApiJobPostRepository();
        const useCase = new GetJobPostsUseCase(repository);
        const jobPosts = await useCase.execute();
        const mappedJobs = jobPosts.map(mapJobPostToCard);
        setJobs(mappedJobs);
      } catch (err) {
        console.error(err);
        setError("Failed to load jobs. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "All" || job.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [jobs, searchTerm, statusFilter]);

  const stats = {
    totalJobs: jobs.length,
    activeJobs: jobs.filter(j => j.status === "Active").length,
    totalViews: jobs.reduce((sum, j) => sum + j.views, 0),
    totalApplications: jobs.reduce((sum, j) => sum + j.applications, 0),
  };

  const handleViewClick = (job: JobCardProps) => {
    setSelectedJob(job);
    setActiveTab("overview"); // always reset to overview on open
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

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
  };
};