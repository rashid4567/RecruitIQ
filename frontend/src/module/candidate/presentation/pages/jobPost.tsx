

import { useState, useEffect, useCallback } from "react";
import JobPostList from "../components/JobPostList";
import JobDetailModal from "../components/JobDetailModal";
import ApplicationSuccessModal from "../components/ApplicationSuccessModal";
import { ApiJobPostRepository } from "../../infrastructure/repositories/ApiJobPostRepository";
import type { JobPost } from "../../domain/entities/jobPost";
import type { JobPostFilters } from "../../domain/dto/JobPostDTO";

export default function CareerPage() {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);
  const [showJobDetail, setShowJobDetail] = useState(false);
  const [showApplicationSuccess, setShowApplicationSuccess] = useState(false);
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [applying, setApplying] = useState(false);
  const [filters, setFilters] = useState<JobPostFilters>({
    page: 1,
    limit: 9,
    search: "",
    jobType: undefined,
    isRemote: undefined,
    skills: [],
    experienceMin: undefined,
    experienceMax: undefined,
    salaryMin: undefined,
    salaryMax: undefined,
    department: undefined,
  });

  const jobRepository = new ApiJobPostRepository();

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const result = await jobRepository.getAll(filters);
      setJobs(result.data);
      setTotalPages(result.totalPages);
      setCurrentPage(result.page);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleApplyClick = async (job: JobPost) => {
    setSelectedJobId(job.id);
    setShowJobDetail(true);
    setLoadingDetail(true);
    
    try {
      // Fetch detailed job data
      const detailedJob = await jobRepository.getById(job.id);
      setSelectedJob(detailedJob);
    } catch (error) {
      console.error("Failed to fetch job details:", error);
      // Fallback to the summary data if detail fetch fails
      setSelectedJob(job);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleApplyNow = async () => {
    if (!selectedJob) return;
    
    setApplying(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      // const response = await applyToJob(selectedJob.id);
      
      setShowJobDetail(false);
      setShowApplicationSuccess(true);
    } catch (error) {
      console.error("Failed to apply:", error);
      alert("Failed to submit application. Please try again.");
    } finally {
      setApplying(false);
    }
  };

  const handleCloseSuccess = () => {
    setShowApplicationSuccess(false);
    setSelectedJob(null);
    setSelectedJobId(null);
  };

  const handleContinueBrowsing = () => {
    setShowApplicationSuccess(false);
    setSelectedJob(null);
    setSelectedJobId(null);
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = (newFilters: Partial<JobPostFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  return (
    <>
      <JobPostList 
        jobs={jobs}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onApplyClick={handleApplyClick}
        onPageChange={handlePageChange}
        onFilterChange={handleFilterChange}
        filters={filters}
      />
      
      {showJobDetail && selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => {
            setShowJobDetail(false);
            setSelectedJob(null);
            setSelectedJobId(null);
          }}
          onApply={handleApplyNow}
          applying={applying}
          loading={loadingDetail}
        />
      )}
      
      {showApplicationSuccess && (
        <ApplicationSuccessModal
          onClose={handleCloseSuccess}
          onContinueBrowsing={handleContinueBrowsing}
        />
      )}
    </>
  );
}