import type { Job } from "../../domain/entity/jobPost.entity";
import type { JobCardProps } from "@/module/jobs/presentation/types/jobCard.types";

export const mapJobPostToCard = (job: Job): JobCardProps => {
  const locationStr = job.isRemote
    ? "Remote"
    : [job.location?.city, job.location?.state, job.location?.country]
        .filter(Boolean)
        .join(", ") || "Not specified";

  const getDisplayStatus = (): JobCardProps["status"] => {
    if (job.isBlocked) return "Blocked";
    if (job.visibility === "hidden") return "Paused";
    if (job.status === "active") return "Active";
    if (job.status === "expired") return "Expired";
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
    jobType: job.jobType || "full-time",
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
    shortlisted: 0,
    avgAiScore: 0,
    positionsFilled: Math.round((job.applicationsCount || 0) * 0.3),
    publicationCount: job.publicationCount || 0,
  };
};
