export const AVAILABLE_VARIABLES = [
  { name: "candidateName", description: "Candidate's full name" },
  { name: "companyName", description: "Company / Organization name" },
  { name: "jobTitle", description: "Job position / role title" },
  { name: "interviewDate", description: "Interview scheduled date" },
  { name: "interviewTime", description: "Interview scheduled time" },
  { name: "interviewLink", description: "Video call / meeting link" },
  { name: "recruiterName", description: "Recruiter / Hiring manager name" },
  { name: "applicationStatus", description: "Current application status" },
  {
    name: "offerLink",
    description: "Employment offer page link for the candidate",
  },
];

export const EVENTS = [
  { value: "ACCOUNT_CREATED", label: "Account Created" },
  { value: "JOB_APPLIED", label: "Job Applied" },
  { value: "INTERVIEW_SCHEDULED", label: "Interview Scheduled" },
  { value: "INTERVIEW_RESCHEDULED", label: "Interview Rescheduled" },
  {
    value: "INTERVIEW_RESCHEDULE_REQUEST_REJECTED",
    label: "Interview Reschedule Request Rejected",
  },
  { value: "SELECTED", label: "Candidate Selected" },
  { value: "REJECTED", label: "Candidate Rejected" },
  { value: "SUBSCRIPTION_PURCHASED", label: "Subscription Purchased" },
  { value: "SUBSCRIPTION_EXPIRING", label: "Subscription Expiring" },
  { value: "SUBSCRIPTION_EXPIRED", label: "Subscription Expired" },
] as const;
