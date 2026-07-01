import { useState, useCallback } from "react";

import CandidateSidebar from "@/module/candidate/pages/components/personalInfo/shared/candidateSidebar";
import JobPostList from "./components/candidate-jobPost/JobPostList";
import JobDetailModal from "./components/candidate-jobPost/candidate-JobDetailModal";
import ApplicationSuccessModal from "./components/candidate-jobPost/ApplicationSuccessModal";
import type { Job } from "../types/job.types";
import type { ApplyJobDTO } from "@/module/job-application/types/application.types";
import type { JobApplication } from "@/module/job-application/types/jobApplication.types";
import { useJobPosts } from "../hooks/candidate-jobPost.hooks/useJobPosts"; 
import { useApplyJob } from "@/module/job-application/hooks/candidate/useApplyJob";
import { getJobById } from "../api/job.api";
import { getMyResume } from "@/module/resume/api/resume.api"; 

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

  const { apply, loading: applying } = useApplyJob();

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [application, setApplication] = useState<JobApplication | null>(null);
  const [showJobDetail, setShowJobDetail] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [showApplicationSuccess, setShowApplicationSuccess] = useState(false);

  const handleApplyClick = useCallback(async (job: Job) => {
    setShowJobDetail(true);
    setLoadingDetail(true);
    try {
      const detailedJob = await getJobById("candidate", job.id);
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
    if (!selectedJob) return;

    try {
      const resume = await getMyResume();

      if (!resume) {
        alert("Please upload a resume before applying.");
        return;
      }

      const payload: ApplyJobDTO = {
        jobId: selectedJob.id,
        resumeId: resume.id,
      };

      const result = await apply(payload);

      if (result) {
        setApplication(result);
        setShowJobDetail(false);
        setShowApplicationSuccess(true);
      }
    } catch (error) {
      console.error("Failed to apply:", error);
      alert("Failed to apply for this job. Please try again.");
    }
  }, [selectedJob, apply]);

  const handleCloseSuccess = useCallback(() => {
    setShowApplicationSuccess(false);
    setSelectedJob(null);
    setApplication(null);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <CandidateSidebar />

      <main className="flex-1 overflow-y-auto">
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
      </main>

      {showJobDetail && selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={handleCloseJobDetail}
          onApply={handleApplyNow}
          applying={applying}
          loading={loadingDetail}
        />
      )}

      {showApplicationSuccess && application && selectedJob && (
        <ApplicationSuccessModal
          applicationId={application.id}
          jobTitle={selectedJob.title}
          companyName={selectedJob.companyName}
          status={application.status}
          appliedAt={application.appliedAt}
          onClose={handleCloseSuccess}
        />
      )}
    </div>
  );
}
