import { useState, useCallback, useEffect, useRef } from "react";
import CandidateSidebar from "@/module/candidate/pages/components/personalInfo/shared/candidateSidebar";
import JobPostList from "./components/candidate-jobPost/JobPostList";
import JobDetailModal from "./components/candidate-jobPost/candidate-JobDetailModal";
import ApplicationSuccessModal from "./components/candidate-jobPost/ApplicationSuccessModal";
import ResumeProcessingModal from "./components/candidate-jobPost/Resumeprocessingmodal";
import ResumeFailedModal from "./components/candidate-jobPost/Resumefailedmodal";
import UploadResumeModal from "./components/candidate-jobPost/Uploadresumemodal";
import type { Job } from "../types/job.types";
import type { ApplyJobDTO } from "@/module/job-application/types/application.types";
import type { JobApplication } from "@/module/job-application/types/jobApplication.types";
import { useJobPosts } from "../hooks/candidate-jobPost.hooks/useJobPosts";
import { useApplyJob } from "@/module/job-application/hooks/candidate/useApplyJob";
import { getJobById } from "../api/job.api";
import { getMyResume } from "@/module/resume/api/resume.api";
import {
  ResumeParseStatus,
  type Resume,
} from "@/module/resume/types/resume.types";

const POLL_INTERVAL_MS = 2500;
const isResumeStillProcessing = (status: ResumeParseStatus) =>
  status === ResumeParseStatus.PENDING ||
  status === ResumeParseStatus.PROCESSING;

const isNoResumeError = (error: unknown): boolean => {
  const err = error as
    | { response?: { status?: number }; code?: string }
    | undefined;
  return err?.response?.status === 404 || err?.code === "RESUME_NOT_FOUND";
};

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
  const [checkingResume, setCheckingResume] = useState(false);
  const [showResumeProcessing, setShowResumeProcessing] = useState(false);
  const [showResumeFailed, setShowResumeFailed] = useState(false);
  const [showUploadResume, setShowUploadResume] = useState(false);
  const submitApplicationRef = useRef<() => Promise<void>>(async () => {});

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

  const submitApplication = useCallback(async () => {
    if (!selectedJob) return;

    try {
      const resume = await getMyResume();

      const payload: ApplyJobDTO = {
        jobId: selectedJob.id,
        resumeId: resume.id,
      };

      const result = await apply(payload);

      if (result) {
        setApplication(result);
        setShowJobDetail(false);
        setShowResumeProcessing(false);
        setShowApplicationSuccess(true);
      }
    } catch (error) {
      if (isNoResumeError(error)) {
        setShowResumeProcessing(false);
        setShowUploadResume(true);
        return;
      }
      console.error("Failed to apply:", error);
      alert("Failed to apply for this job. Please try again.");
    }
  }, [selectedJob, apply]);

  useEffect(() => {
    submitApplicationRef.current = submitApplication;
  }, [submitApplication]);

  const handleApplyNow = useCallback(async () => {
    if (!selectedJob) return;

    setCheckingResume(true);
    try {
      const resume = await getMyResume();

      if (isResumeStillProcessing(resume.parseStatus)) {
        setShowResumeProcessing(true);
        return;
      }

      if (resume.parseStatus === ResumeParseStatus.FAILED) {
        setShowResumeFailed(true);
        return;
      }

      await submitApplication();
    } catch (error) {
      if (isNoResumeError(error)) {
        setShowUploadResume(true);
        return;
      }
      console.error("Failed to check resume status:", error);
      alert(
        "Something went wrong while checking your resume. Please try again.",
      );
    } finally {
      setCheckingResume(false);
    }
  }, [selectedJob, submitApplication]);

  useEffect(() => {
    if (!showResumeProcessing) return;

    const interval = setInterval(async () => {
      try {
        const resume: Resume | null = await getMyResume();
        if (!resume) return;

        if (resume.parseStatus === ResumeParseStatus.COMPLETED) {
          clearInterval(interval);
          setShowResumeProcessing(false);
          await submitApplicationRef.current();
        } else if (resume.parseStatus === ResumeParseStatus.FAILED) {
          clearInterval(interval);
          setShowResumeProcessing(false);
          setShowResumeFailed(true);
        }
      } catch (error) {
        console.error("Resume status poll failed:", error);
      }
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [showResumeProcessing]);

  const handleCloseSuccess = useCallback(() => {
    setShowApplicationSuccess(false);
    setSelectedJob(null);
    setApplication(null);
  }, []);

  const handleResumeFailedClose = useCallback(() => {
    setShowResumeFailed(false);
  }, []);

  const handleResumeFailedUploadAnother = useCallback(() => {
    setShowResumeFailed(false);
    setShowUploadResume(true);
  }, []);

  const handleUploadResumeClose = useCallback(() => {
    setShowUploadResume(false);
  }, []);

  const handleUploadResumeComplete = useCallback(() => {
    setShowUploadResume(false);
    setShowResumeProcessing(true);
  }, []);

  return (
  <>
    <CandidateSidebar>
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
    </CandidateSidebar>

    {showJobDetail && selectedJob && (
      <JobDetailModal
        job={selectedJob}
        onClose={handleCloseJobDetail}
        onApply={handleApplyNow}
        applying={applying || checkingResume}
        loading={loadingDetail}
      />
    )}

    {showResumeProcessing && (
      <ResumeProcessingModal
        onCancel={() => setShowResumeProcessing(false)}
      />
    )}

    {showResumeFailed && (
      <ResumeFailedModal
        onClose={handleResumeFailedClose}
        onUploadAnother={handleResumeFailedUploadAnother}
      />
    )}

    {showUploadResume && (
      <UploadResumeModal
        onClose={handleUploadResumeClose}
        onUploaded={handleUploadResumeComplete}
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
  </>
);
}
