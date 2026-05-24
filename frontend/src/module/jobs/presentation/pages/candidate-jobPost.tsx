import { useState, useCallback } from "react";

import JobPostList from "./components/candidate-jobPost/JobPostList";

import JobDetailModal from "./components/candidate-jobPost/candidate-JobDetailModal";

import ApplicationSuccessModal from "./components/candidate-jobPost/ApplicationSuccessModal";

import type { Job } from "../../domain/entity/jobPost.entity";

import { useJobPosts } from "../hooks/candidate-jobPost.hooks/useJobPosts";

import { GetCandidateJobPostByIdUC } from "../di/jobPost.di";

export default function CareerPage() {
  const {
    jobs,
    loading,
    filters,
    searchInput,
    pagination,
    updateFilters,
    updateSearch,
    changePage,
    resetFilters,
  } = useJobPosts();

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const [showJobDetail, setShowJobDetail] = useState(false);

  const [loadingDetail, setLoadingDetail] = useState(false);

  const [applying, setApplying] = useState(false);

  const [showApplicationSuccess, setShowApplicationSuccess] = useState(false);

  const handleApplyClick = useCallback(async (job: Job) => {
    setShowJobDetail(true);

    setLoadingDetail(true);

    try {
      const detailedJob = await GetCandidateJobPostByIdUC.execute(job.id);

      setSelectedJob(detailedJob);
    } catch (error) {
      console.error("Failed to fetch job details:", error);
    } finally {
      setLoadingDetail(false);
    }
  }, []);

  const handleCloseJobDetail = useCallback(() => {
    setShowJobDetail(false);

    setSelectedJob(null);
  }, []);

  const handleApplyNow = useCallback(async () => {
    if (!selectedJob) {
      return;
    }

    setApplying(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setShowJobDetail(false);

      setShowApplicationSuccess(true);
    } catch (error) {
      console.error("Failed to apply:", error);
    } finally {
      setApplying(false);
    }
  }, [selectedJob]);

  const handleCloseSuccess = useCallback(() => {
    setShowApplicationSuccess(false);

    setSelectedJob(null);
  }, []);

  return (
    <>
      <JobPostList
        jobs={jobs}
        loading={loading}
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        filters={filters}
        searchInput={searchInput}
        onApplyClick={handleApplyClick}
        onPageChange={changePage}
        onFilterChange={updateFilters}
        onSearchChange={updateSearch}
        onResetFilters={resetFilters}
      />

      {showJobDetail && selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={handleCloseJobDetail}
          onApply={handleApplyNow}
          applying={applying}
          loading={loadingDetail}
        />
      )}

      {showApplicationSuccess && (
        <ApplicationSuccessModal
          onClose={handleCloseSuccess}
          onContinueBrowsing={handleCloseSuccess}
        />
      )}
    </>
  );
}
