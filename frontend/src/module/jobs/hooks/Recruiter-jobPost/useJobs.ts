import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { getJobs } from "@/module/jobs/api/job.api";
import type { Job } from "@/module/jobs/types/job.types";
import type {
  JobCardProps,
  ViewMode,
} from "../../types/jobCard.types";
import { mapJobPostToCard } from "../../mappers/jobCardMapper";

const JOBS_PER_PAGE = 6;

export const useJobs = () => {
  const [viewMode, setViewMode] =
    useState<ViewMode>("grid");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("All");

  const [jobs, setJobs] = useState<JobCardProps[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(
    null,
  );

  const [selectedJob, setSelectedJob] =
    useState<JobCardProps | null>(null);

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [activeTab, setActiveTab] = useState<
    "overview" | "applicants"
  >("overview");

  const [currentPage, setCurrentPage] =
    useState(1);

  const navigate = useNavigate();

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getJobs("recruiter");

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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        job.category
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        job.location
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        job.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [jobs, searchTerm, statusFilter]);

  const totalPages = Math.ceil(
    filteredJobs.length / JOBS_PER_PAGE,
  );

  const paginatedJobs = useMemo(() => {
    const start =
      (currentPage - 1) * JOBS_PER_PAGE;

    return filteredJobs.slice(
      start,
      start + JOBS_PER_PAGE,
    );
  }, [filteredJobs, currentPage]);

  const stats = {
    totalJobs: jobs.length,
    activeJobs: jobs.filter(
      (job) => job.status === "Active",
    ).length,
    totalViews: jobs.reduce(
      (sum, job) => sum + job.views,
      0,
    ),
    totalApplications: jobs.reduce(
      (sum, job) => sum + job.applications,
      0,
    ),
  };

  const handleViewClick = (
    job: JobCardProps,
  ) => {
    setSelectedJob(job);
    setActiveTab("overview");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  const handleJobDeleted = useCallback(
    (deletedId: string) => {
      setJobs((prev) =>
        prev.filter((job) => job.id !== deletedId),
      );
    },
    [],
  );

  return {
    viewMode,
    setViewMode,

    searchTerm,
    setSearchTerm,

    statusFilter,
    setStatusFilter,

    filteredJobs,
    paginatedJobs,

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

    currentPage,
    setCurrentPage,

    totalPages,
    jobsPerPage: JOBS_PER_PAGE,
  };
};